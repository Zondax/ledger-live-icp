import { fromNullable } from '../utils'
import BigNumber from 'bignumber.js'
import { ICP_FEES, ICP_MIN_STAKING_AMOUNT, MIN_DISSOLVE_DELAY, SECONDS_IN_HALF_YEAR, SECONDS_IN_HOUR } from './consts'
import { ICPNeuron } from './types'
import { getDissolveDelayMultiplier, getNeuronDissolveDurationSeconds } from './votingPower'
import { derivePrincipalFromPubkey } from '../utils'
import invariant from 'invariant'

export const getMinDissolveDelay = (neuron: ICPNeuron) => {
  const currentDissolveDelay = getNeuronDissolveDurationSeconds(neuron)
  return Math.max(MIN_DISSOLVE_DELAY, Number(currentDissolveDelay) + SECONDS_IN_HOUR)
}

export const getNeuronDissolveDelayBonus = (neuron: ICPNeuron) => {
  const dissolveDelay = getNeuronDissolveDurationSeconds(neuron)
  if (dissolveDelay < SECONDS_IN_HALF_YEAR) {
    return 0
  }

  const multiplier = getDissolveDelayMultiplier(BigInt(dissolveDelay))
  return Math.round((multiplier + Number.EPSILON - 1) * 100)
}

export const canSplitNeuron = (neuron: ICPNeuron) => {
  return neuron.cached_neuron_stake_e8s > BigInt(2 * ICP_MIN_STAKING_AMOUNT + ICP_FEES)
}

export const canSpawnNeuron = (neuron: ICPNeuron) => {
  return neuron.maturity_e8s_equivalent > BigInt(ICP_MIN_STAKING_AMOUNT)
}

export const canStakeMaturity = (neuron: ICPNeuron) => {
  return neuron.maturity_e8s_equivalent > BigInt(0)
}

export const maxAllowedSplitAmount = (neuron: ICPNeuron) => {
  return BigNumber(neuron.cached_neuron_stake_e8s.toString()).minus(ICP_MIN_STAKING_AMOUNT)
}

export const isDeviceControlledNeuron = (neuron: ICPNeuron, pubkey: string) => {
  const principal = derivePrincipalFromPubkey(pubkey)
  const controller = fromNullable(neuron.controller)
  invariant(controller, '[ICP](isDeviceControlledNeuron) controller is required')

  return controller.toString() === principal.toString()
}
