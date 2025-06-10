import { fromNullable, secondsToDuration } from '@dfinity/utils'
import { Neuron as NNSNeuron } from '@dfinity/nns/dist/candid/governance'
import { BigNumber } from 'bignumber.js'
import { getTimeUntil, nowInSeconds } from '../utils'
import {
  E8S_PER_ICP,
  MAX_AGE_BONUS,
  MAX_DISSOLVE_DELAY_BONUS,
  SECONDS_IN_EIGHT_YEARS,
  SECONDS_IN_FOUR_YEARS,
  SECONDS_IN_HALF_YEAR,
  VOTING_POWER_REFRESH_THRESHOLD_IN_DAYS,
} from './consts'
import { ICPNeuron } from './types'

/**
 * Calculation of the voting power of a neuron.
 *
 * If neuron's dissolve delay is less than 6 months, the voting power is 0.
 *
 * Else:
 * votingPower = (stake + staked maturity) * dissolve_delay_bonus * age_bonus
 * dissolve_delay_bonus = 1 + (dissolve_delay_multiplier * neuron dissolve delay / 8 years)
 * age_bonus = 1 + (age_multiplier * ageSeconds / 4 years)
 *
 * dissolve_delay_multiplier is 1 in NNS
 * age_multiplier is 0.25 in NNS
 *
 * ageSeconds is capped at 4 years
 * neuron dissolve delay is capped at 8 years
 *
 * Reference: https://internetcomputer.org/docs/current/tokenomics/sns/rewards#recap-on-nns-voting-rewards
 */
export const neuronVotingPower = ({ neuron }: { neuron: NNSNeuron }): BigNumber => {
  const dissolveState = fromNullable(neuron.dissolve_state)
  if (dissolveState === undefined) {
    return BigNumber(0)
  }
  let dissolveDelay = 'DissolveDelaySeconds' in dissolveState ? BigInt(dissolveState.DissolveDelaySeconds) : BigInt(0)

  dissolveDelay =
    'WhenDissolvedTimestampSeconds' in dissolveState
      ? BigInt(BigNumber(dissolveState.WhenDissolvedTimestampSeconds.toString()).minus(nowInSeconds()).abs().toString())
      : dissolveDelay

  const cachedNeuronStakeE8s = BigInt(neuron.cached_neuron_stake_e8s)
  const stakedMaturityE8s = BigInt(neuron.staked_maturity_e8s_equivalent?.[0] ?? 0)
  const stakeE8s = cachedNeuronStakeE8s + stakedMaturityE8s
  const votingPowerBigInt = calculateVotingPower({
    stakeE8s,
    dissolveDelay,
    ageSeconds: BigInt(neuron.aging_since_timestamp_seconds),
  })

  return BigNumber(votingPowerBigInt.toString())
}

interface VotingPowerParams {
  // Neuron data
  dissolveDelay: bigint
  stakeE8s: bigint
  ageSeconds: bigint
  // Params
  maxAgeBonus?: number
  maxDissolveDelayBonus?: number
  maxAgeSeconds?: number
  maxDissolveDelaySeconds?: number
  minDissolveDelaySeconds?: number
}

/**
 * For now used only internally in this file.
 *
 * It might be useful to use it for SNS neurons.
 */
export const calculateVotingPower = ({
  stakeE8s,
  dissolveDelay,
  ageSeconds,
  minDissolveDelaySeconds = SECONDS_IN_HALF_YEAR,
}: VotingPowerParams): number => {
  if (dissolveDelay < minDissolveDelaySeconds) {
    return 0
  }

  const dissolveDelayMultiplier = getDissolveDelayMultiplier(dissolveDelay)
  const ageMultiplier = getAgeMultiplier(ageSeconds)

  return Math.round(Number(stakeE8s) * dissolveDelayMultiplier * ageMultiplier) / E8S_PER_ICP
}

export const neuronPotentialVotingPower = ({
  neuron,
  newDissolveDelayInSeconds,
}: {
  neuron: ICPNeuron
  newDissolveDelayInSeconds: number
}): number => {
  const stakeE8s = neuron.cached_neuron_stake_e8s + (neuron.staked_maturity_e8s_equivalent?.[0] ?? 0n)

  return calculateVotingPower({
    stakeE8s,
    dissolveDelay: BigInt(newDissolveDelayInSeconds),
    ageSeconds: BigInt(neuron.aging_since_timestamp_seconds),
  })
}

// Calculates the bonus multiplier for an amount (such as dissolve delay or age)
// which results in bonus eligibility which scales linearly from 1 to
// `maxBonus`. For example for dissolve delay, the values
//   amount: 4 years
//   amountForMaxBonus: 8 years
//   maxBonus: 1
// Would mean that there is a maximum bonus of 1 = 100% (which means a
// multiplier of 2) but with a dissolve delay of 4 years out of a maximum of
// 8 years, the bonus would be 50%, which means a multiplier of 1.5.
// So in this case the return value would be 1.5.
export const bonusMultiplier = ({
  amount,
  amountForMaxBonus,
  maxBonus,
}: {
  amount: bigint
  amountForMaxBonus: number
  maxBonus: number
}): number => {
  const bonusProportion = amountForMaxBonus === 0 ? 0 : Math.min(Number(amount), amountForMaxBonus) / amountForMaxBonus
  return 1 + maxBonus * bonusProportion
}

export const getNeuronDissolveDurationSeconds = (neuron: ICPNeuron) => {
  if (neuron.dissolveDelaySeconds === '0') {
    if (neuron.whenDissolvedTimestampSeconds === '0') {
      return BigInt(0)
    }
    return BigInt(BigNumber(neuron.whenDissolvedTimestampSeconds).minus(nowInSeconds()).abs().toString())
  }
  return BigInt(neuron.dissolveDelaySeconds)
}

export const secondsToDurationString = (seconds: string) => {
  return secondsToDuration({
    seconds: BigInt(parseInt(seconds)),
  })
}

export const getNeuronDissolveDuration = (neuron: ICPNeuron) => {
  const seconds = getNeuronDissolveDurationSeconds(neuron)
  return secondsToDuration({
    seconds,
  })
}

export const getDissolveDelayMultiplier = (delayInSeconds: bigint): number =>
  bonusMultiplier({
    amount: delayInSeconds,
    maxBonus: MAX_DISSOLVE_DELAY_BONUS,
    amountForMaxBonus: SECONDS_IN_EIGHT_YEARS,
  })

export const getAgeMultiplier = (ageSeconds: bigint): number =>
  bonusMultiplier({
    amount: ageSeconds,
    maxBonus: MAX_AGE_BONUS,
    amountForMaxBonus: SECONDS_IN_FOUR_YEARS,
  })

export const votingPowerNeedsRefresh = (
  fullNeurons: ICPNeuron[],
): {
  needsRefresh: boolean
  minDays: number
  minHours: number
  minMinutes: number
} => {
  const filteredNeurons = fullNeurons.filter(neuron => getNeuronVotingPower(neuron) > 0)

  let minSeconds = Number.MAX_SAFE_INTEGER
  for (const neuron of filteredNeurons) {
    const secondsTillVotingPowerExpires = getSecondsTillVotingPowerExpires(neuron)
    if (secondsTillVotingPowerExpires <= 0) {
      return {
        needsRefresh: true,
        minDays: 0,
        minMinutes: 0,
        minHours: 0,
      }
    }

    minSeconds = Math.min(minSeconds, secondsTillVotingPowerExpires)
  }

  const { days, minutes, hours } = getTimeUntil(minSeconds, false)

  return {
    needsRefresh: days <= VOTING_POWER_REFRESH_THRESHOLD_IN_DAYS,
    minDays: days,
    minHours: hours,
    minMinutes: minutes,
  }
}

export const getSecondsTillVotingPowerExpires = (neuron: ICPNeuron) => {
  const votingPowerLastRefresh = fromNullable(neuron.neuronInfo.voting_power_refreshed_timestamp_seconds)

  if (!votingPowerLastRefresh) {
    return 0
  }

  const timeNow = nowInSeconds()
  const timeSinceLastRefresh = timeNow - Number(votingPowerLastRefresh)

  return SECONDS_IN_HALF_YEAR - timeSinceLastRefresh
}

export const getNeuronVotingPower = (neuron: ICPNeuron) => {
  if (getNeuronDissolveDurationSeconds(neuron) < SECONDS_IN_HALF_YEAR) {
    return 0
  }

  return Number(neuron.neuronInfo.voting_power)
}
