import { IDL } from '@dfinity/candid'
import { ICPNeuron, NeuronInfos, Neurons } from './types'
import { BigNumber } from 'bignumber.js'
import { fromNullable } from '@dfinity/utils'
import { Neuron as NNSNeuron, DissolveState as NNSDissolveState, NeuronInfo } from '@dfinity/nns/dist/candid/governance'
import invariant from 'invariant'
import { principalToAccountIdentifier } from '@dfinity/ledger-icp'
import { Principal } from '@dfinity/principal'
import { nowInSeconds } from '../utils/time'
import { getAgeMultiplier, getNeuronDissolveDurationSeconds, neuronVotingPower } from './votingPower'
import { MAINNET_GOVERNANCE_CANISTER_ID, SECONDS_IN_HALF_YEAR } from './consts'

export class NeuronsData {
  fullNeurons: ICPNeuron[]
  neuronInfos: [bigint, NeuronInfo][]
  lastUpdatedMSecs: number

  // calculated values
  totalStaked: BigNumber
  totalMaturity: BigNumber
  totalMaturityStaked: BigNumber

  constructor(neurons: NNSNeuron[], neuronInfos: [bigint, NeuronInfo][], lastUpdated: number, governanceCanisterId: string) {
    this.neuronInfos = neuronInfos
    this.fullNeurons = neurons.map(neuron => {
      const neuronId = fromNullable(neuron.id)

      invariant(neuronId !== undefined, 'Neuron ID is undefined')
      const neuronInfo = neuronInfos.find(info => info[0] === neuronId.id)
      invariant(neuronInfo !== undefined, 'Neuron info is undefined')

      const dissolveState = fromNullable(neuron.dissolve_state)
      const dissolveDelaySeconds =
        dissolveState && 'DissolveDelaySeconds' in dissolveState ? dissolveState.DissolveDelaySeconds.toString() : '0'
      const whenDissolvedTimestampSeconds =
        dissolveState && 'WhenDissolvedTimestampSeconds' in dissolveState ? dissolveState.WhenDissolvedTimestampSeconds.toString() : '0'
      return {
        ...neuron,
        modFollowees: neuron.followees.reduce(
          (acc, followee) => {
            const topic = followee[0]
            followee[1].followees.forEach(followee => {
              acc[followee.id.toString()] = acc[followee.id.toString()] ?? []
              acc[followee.id.toString()].push(topic)
            })
            return acc
          },
          {} as Record<string, number[]>,
        ),
        accountIdentifier: principalToAccountIdentifier(Principal.from(governanceCanisterId), Uint8Array.from(neuron.account)),
        dissolveState: getNeuronDissolveState(dissolveState),
        votingPower: neuronVotingPower({ neuron }),
        dissolveDelaySeconds,
        whenDissolvedTimestampSeconds,

        neuronInfo: neuronInfo[1],
      }
    })

    this.totalStaked = BigNumber(0)
    this.totalMaturity = BigNumber(0)
    this.totalMaturityStaked = BigNumber(0)
    this.lastUpdatedMSecs = lastUpdated

    this.fullNeurons.forEach(neuron => {
      this.totalStaked = this.totalStaked.plus(BigNumber(neuron.cached_neuron_stake_e8s.toString()))
      this.totalMaturity = this.totalMaturity.plus(BigNumber(neuron.maturity_e8s_equivalent.toString()))
      this.totalMaturityStaked = this.totalMaturityStaked.plus(BigNumber(neuron.staked_maturity_e8s_equivalent[0]?.toString() ?? '0'))
    })
  }

  serialize() {
    const encodedFullNeurons = IDL.encode([Neurons], [this.fullNeurons])
    const encodedNeuronInfos = IDL.encode([NeuronInfos], [this.neuronInfos])
    return {
      fullNeurons: Buffer.from(encodedFullNeurons).toString('hex'),
      neuronInfos: Buffer.from(encodedNeuronInfos).toString('hex'),
    }
  }

  public static empty() {
    return new NeuronsData([], [], 0, '')
  }

  public static deserialize(
    fullNeuronsRaw: string,
    neuronInfosRaw: string,
    lastUpdated?: number,
    governanceCanisterId = MAINNET_GOVERNANCE_CANISTER_ID,
  ) {
    const encodedFullNeurons = new Uint8Array(Buffer.from(fullNeuronsRaw, 'hex'))
    const [fullNeurons]: any = IDL.decode([Neurons], encodedFullNeurons.buffer)
    const encodedNeuronInfos = new Uint8Array(Buffer.from(neuronInfosRaw, 'hex'))
    const [neuronInfos]: any = IDL.decode([NeuronInfos], encodedNeuronInfos.buffer)
    return new NeuronsData(fullNeurons, neuronInfos, lastUpdated ?? Date.now(), governanceCanisterId)
  }
}

// https://github.com/dfinity/nns-dapp/blob/main/frontend/src/lib/utils/sns-neuron.utils.ts#L46
const getNeuronDissolveState = (dissolveState?: NNSDissolveState) => {
  if (dissolveState === undefined) {
    return 'Unlocked'
  }
  if ('DissolveDelaySeconds' in dissolveState) {
    return dissolveState.DissolveDelaySeconds.toString() === '0'
      ? // 0 = already dissolved (more info: https://gitlab.com/dfinity-lab/public/ic/-/blob/master/rs/nns/governance/src/governance.rs#L827)
        'Unlocked'
      : 'Locked'
  }
  if ('WhenDissolvedTimestampSeconds' in dissolveState) {
    // In case `nowInSeconds` ever changes and doesn't return an integer we use Math.floor
    return dissolveState.WhenDissolvedTimestampSeconds < BigInt(Math.floor(nowInSeconds())) ? 'Unlocked' : 'Dissolving'
  }
  return 'Unknown'
}

export const getNeuronAgeBonus = (neuron: ICPNeuron) => {
  const age = neuron.neuronInfo.age_seconds
  if (getNeuronDissolveDurationSeconds(neuron) < SECONDS_IN_HALF_YEAR) {
    return 0
  }

  const multiplier = getAgeMultiplier(BigInt(age))
  return Math.round((multiplier + Number.EPSILON - 1) * 100)
}
