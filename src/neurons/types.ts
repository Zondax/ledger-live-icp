import { IDL } from '@dfinity/candid'
import { NeuronInfo as NNSNeuronInfo, Neuron as NNSNeuron } from '@dfinity/nns/dist/candid/governance'
import { KNOWN_TOPICS } from './consts'

export interface ICPNeuron extends NNSNeuron {
  accountIdentifier: string
  dissolveState: 'Unlocked' | 'Locked' | 'Dissolving' | 'Unknown' | 'Spawning'
  dissolveDelaySeconds: string
  whenDissolvedTimestampSeconds: string
  modFollowees: {
    [neuronId: string]: (keyof typeof KNOWN_TOPICS)[]
  }

  neuronInfo: NNSNeuronInfo
}

const NeuronId = IDL.Record({ id: IDL.Nat64 })
const BallotInfo = IDL.Record({
  vote: IDL.Int32,
  proposal_id: IDL.Opt(NeuronId),
})
const DissolveState = IDL.Variant({
  DissolveDelaySeconds: IDL.Nat64,
  WhenDissolvedTimestampSeconds: IDL.Nat64,
})
const Followees = IDL.Record({ followees: IDL.Vec(NeuronId) })
const NeuronStakeTransfer = IDL.Record({
  to_subaccount: IDL.Vec(IDL.Nat8),
  neuron_stake_e8s: IDL.Nat64,
  from: IDL.Opt(IDL.Principal),
  memo: IDL.Nat64,
  from_subaccount: IDL.Vec(IDL.Nat8),
  transfer_timestamp: IDL.Nat64,
  block_height: IDL.Nat64,
})
const KnownNeuronData = IDL.Record({
  name: IDL.Text,
  description: IDL.Opt(IDL.Text),
})

const Neuron = IDL.Record({
  id: IDL.Opt(NeuronId),
  staked_maturity_e8s_equivalent: IDL.Opt(IDL.Nat64),
  controller: IDL.Opt(IDL.Principal),
  recent_ballots: IDL.Vec(BallotInfo),
  kyc_verified: IDL.Bool,
  neuron_type: IDL.Opt(IDL.Int32),
  not_for_profit: IDL.Bool,
  maturity_e8s_equivalent: IDL.Nat64,
  cached_neuron_stake_e8s: IDL.Nat64,
  created_timestamp_seconds: IDL.Nat64,
  auto_stake_maturity: IDL.Opt(IDL.Bool),
  aging_since_timestamp_seconds: IDL.Nat64,
  hot_keys: IDL.Vec(IDL.Principal),
  account: IDL.Vec(IDL.Nat8),
  joined_community_fund_timestamp_seconds: IDL.Opt(IDL.Nat64),
  dissolve_state: IDL.Opt(DissolveState),
  followees: IDL.Vec(IDL.Tuple(IDL.Int32, Followees)),
  neuron_fees_e8s: IDL.Nat64,
  transfer: IDL.Opt(NeuronStakeTransfer),
  known_neuron_data: IDL.Opt(KnownNeuronData),
  spawn_at_timestamp_seconds: IDL.Opt(IDL.Nat64),
})

export const Neurons = IDL.Vec(Neuron)

// NeuronInfo
const NeuronInfo = IDL.Record({
  dissolve_delay_seconds: IDL.Nat64,
  recent_ballots: IDL.Vec(BallotInfo),
  voting_power_refreshed_timestamp_seconds: IDL.Opt(IDL.Nat64),
  potential_voting_power: IDL.Opt(IDL.Nat64),
  neuron_type: IDL.Opt(IDL.Int32),
  deciding_voting_power: IDL.Opt(IDL.Nat64),
  created_timestamp_seconds: IDL.Nat64,
  state: IDL.Int32,
  stake_e8s: IDL.Nat64,
  joined_community_fund_timestamp_seconds: IDL.Opt(IDL.Nat64),
  retrieved_at_timestamp_seconds: IDL.Nat64,
  visibility: IDL.Opt(IDL.Int32),
  known_neuron_data: IDL.Opt(KnownNeuronData),
  voting_power: IDL.Nat64,
  age_seconds: IDL.Nat64,
})

export const NeuronInfos = IDL.Vec(IDL.Tuple(IDL.Nat64, NeuronInfo))
