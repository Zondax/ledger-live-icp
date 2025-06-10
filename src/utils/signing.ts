import { nowInSeconds } from './time'
import { AccountIdentifier } from '@dfinity/ledger-icp'
import {
  ledgerIdlFactory as idlFactoryLedger,
  governanceIdlFactoryOld as idlFactoryGovernanceOld,
  governanceIdlFactory as idlFactoryGovernance,
  getCanisterIdlFunc,
  encodeCanisterIdlFunc,
} from '../canisterIDL'
import invariant from 'invariant'
import { Principal } from '@dfinity/principal'
import { Expiry, ReadStateRequest, requestIdOf, SubmitRequestType } from '@dfinity/agent'
import {
  DEFAULT_INGRESS_EXPIRY_DELTA_IN_MSECS,
  ICP_FEES,
  MAINNET_GOVERNANCE_CANISTER_ID,
  MAINNET_LEDGER_CANISTER_ID,
} from '../neurons/consts'
import { toNullable, derivePrincipalFromPubkey } from '.'

export interface UnsignedTransaction extends Record<string, any> {
  request_type: SubmitRequestType
  canister_id: Principal
  method_name: string
  arg: ArrayBuffer
  sender: Principal
  ingress_expiry: Expiry
}

export interface TransferRawRequest {
  to: Uint8Array
  amount: { e8s: bigint }
  memo: bigint
  fee: { e8s: bigint }
  created_at_time: [{ timestamp_nanos: bigint }]
  from_subaccount: []
}

interface DisburseCommand {
  Disburse: { to_account: string[]; amount: [{ e8s: bigint }] }
}

interface StakeMaturityCommand {
  StakeMaturity: {
    percentage_to_stake: [number] | []
  }
}

interface SpawnNeuronCommand {
  Spawn: {
    percentage_to_spawn: [number] | []
    new_controller: [Principal] | []
    nonce: [bigint] | []
  }
}

interface RefreshVotingPowerCommand {
  RefreshVotingPower: object
}

interface SplitNeuronCommand {
  Split: {
    memo: bigint
    amount_e8s: bigint
  }
}

interface ManageNeuronFollowRequestCommand {
  Follow: {
    topic: number
    followees: { id: bigint }[]
  }
}

// Neuron configuration commands
interface IncreaseDissolveDelayConfig {
  IncreaseDissolveDelay: {
    additional_dissolve_delay_seconds: number
  }
}

interface SetDissolveDelayConfig {
  SetDissolveTimestamp: {
    dissolve_timestamp_seconds: bigint
  }
}

interface StartDissolvingConfig {
  StartDissolving: object
}

interface StopDissolvingConfig {
  StopDissolving: object
}

interface RemoveHotKeyConfig {
  RemoveHotKey: {
    hot_key_to_remove: [Principal]
  }
}

interface AddHotKeyConfig {
  AddHotKey: {
    new_hot_key: [Principal]
  }
}

interface ChangeAutoStakeMaturityConfig {
  ChangeAutoStakeMaturity: {
    requested_setting_for_auto_stake_maturity: boolean
  }
}

interface ConfigureOperationCommand {
  Configure: {
    operation: [
      | StartDissolvingConfig
      | StopDissolvingConfig
      | IncreaseDissolveDelayConfig
      | SetDissolveDelayConfig
      | ChangeAutoStakeMaturityConfig
      | RemoveHotKeyConfig
      | AddHotKeyConfig,
    ]
  }
}

export interface NeuronCommandRawRequest<
  T extends
    | DisburseCommand
    | ConfigureOperationCommand
    | StakeMaturityCommand
    | SpawnNeuronCommand
    | RefreshVotingPowerCommand
    | SplitNeuronCommand
    | ManageNeuronFollowRequestCommand,
> {
  id: [{ id: bigint }]
  command: T[]
  neuron_id_or_subaccount: []
}

interface ListNeuronsRawRequest {
  include_public_neurons_in_full_neurons: [boolean] | []
  neuron_ids: BigUint64Array
  include_empty_neurons_readable_by_caller: [boolean] | []
  include_neurons_readable_by_caller: boolean
}

export const createUnsignedListNeuronsTransaction = (
  pubKey: string,
): { unsignedTransaction: UnsignedTransaction; listNeuronsRawRequest: ListNeuronsRawRequest } => {
  const listNeuronsRawRequest: ListNeuronsRawRequest = {
    include_public_neurons_in_full_neurons: toNullable(false),
    neuron_ids: BigUint64Array.from([]),
    include_empty_neurons_readable_by_caller: toNullable(true),
    include_neurons_readable_by_caller: true,
  }

  const listNeuronsIdlFunc = getCanisterIdlFunc(idlFactoryGovernanceOld, 'list_neurons')
  const args = encodeCanisterIdlFunc(listNeuronsIdlFunc, [listNeuronsRawRequest])

  const canisterID = Principal.from(MAINNET_GOVERNANCE_CANISTER_ID)
  const unsignedTransaction: UnsignedTransaction = {
    request_type: SubmitRequestType.Call,
    canister_id: canisterID,
    method_name: 'list_neurons',
    arg: args,
    sender: derivePrincipalFromPubkey(pubKey),
    ingress_expiry: new Expiry(DEFAULT_INGRESS_EXPIRY_DELTA_IN_MSECS),
  }

  return { unsignedTransaction, listNeuronsRawRequest }
}

const createCommandConfigOperation = (
  op:
    | StartDissolvingConfig
    | StopDissolvingConfig
    | IncreaseDissolveDelayConfig
    | SetDissolveDelayConfig
    | ChangeAutoStakeMaturityConfig
    | RemoveHotKeyConfig
    | AddHotKeyConfig,
): ConfigureOperationCommand => {
  return {
    Configure: {
      operation: [op],
    },
  }
}

// Generic function to create an unsigned transaction for a neuron command
export const createUnsignedNeuronCommandTransaction = (
  transaction: any,
  pubKey: string,
): {
  unsignedTransaction: UnsignedTransaction
  neuronCommandRawRequest: NeuronCommandRawRequest<
    | DisburseCommand
    | ConfigureOperationCommand
    | StakeMaturityCommand
    | SpawnNeuronCommand
    | RefreshVotingPowerCommand
    | SplitNeuronCommand
    | ManageNeuronFollowRequestCommand
  >
} => {
  const {
    neuronId,
    amount,
    dissolveDelay,
    additionalDissolveDelay,
    autoStakeMaturity,
    hotKeyToRemove,
    hotKeyToAdd,
    followTopic,
    followeesIds,
    percentageToStake,
  } = transaction
  invariant(neuronId, '[ICP](createUnsignedNeuronCommandTransaction) Neuron ID is required')

  const rawCommand: NeuronCommandRawRequest<
    | DisburseCommand
    | ConfigureOperationCommand
    | StakeMaturityCommand
    | SpawnNeuronCommand
    | RefreshVotingPowerCommand
    | SplitNeuronCommand
    | ManageNeuronFollowRequestCommand
  > = {
    id: [{ id: BigInt(neuronId) }],
    neuron_id_or_subaccount: [],
    command: [],
  }

  switch (transaction.type) {
    case 'disburse':
      rawCommand.command = [
        {
          Disburse: {
            to_account: [],
            amount: [{ e8s: BigInt(amount.toString()) }],
          },
        },
      ]
      break
    case 'start_dissolving':
      rawCommand.command = [createCommandConfigOperation({ StartDissolving: {} })]
      break
    case 'stop_dissolving':
      rawCommand.command = [createCommandConfigOperation({ StopDissolving: {} })]
      break
    case 'stake_maturity':
      rawCommand.command = [
        {
          StakeMaturity: { percentage_to_stake: [Number(percentageToStake)] },
        },
      ]
      break
    case 'spawn_neuron':
      rawCommand.command = [
        {
          Spawn: { percentage_to_spawn: [100], new_controller: [], nonce: [] },
        },
      ]
      break
    case 'refresh_voting_power':
      rawCommand.command = [
        {
          RefreshVotingPower: {},
        },
      ]
      break
    case 'increase_dissolve_delay':
      invariant(additionalDissolveDelay, '[ICP](createUnsignedNeuronCommandTransaction) Additional dissolve delay is required')
      rawCommand.command = [
        createCommandConfigOperation({
          IncreaseDissolveDelay: {
            additional_dissolve_delay_seconds: Number(additionalDissolveDelay),
          },
        }),
      ]
      break
    case 'set_dissolve_delay':
      invariant(dissolveDelay, '[ICP](createUnsignedNeuronCommandTransaction) Dissolve delay is required')
      rawCommand.command = [
        createCommandConfigOperation({
          SetDissolveTimestamp: {
            dissolve_timestamp_seconds: BigInt(dissolveDelay) + BigInt(nowInSeconds()),
          },
        }),
      ]
      break
    case 'auto_stake_maturity':
      invariant(autoStakeMaturity !== undefined, '[ICP](createUnsignedNeuronCommandTransaction) Auto stake maturity is required')
      rawCommand.command = [
        createCommandConfigOperation({
          ChangeAutoStakeMaturity: {
            requested_setting_for_auto_stake_maturity: autoStakeMaturity,
          },
        }),
      ]
      break
    case 'split_neuron':
      rawCommand.command = [
        {
          Split: {
            memo: BigInt(transaction.memo ?? 0),
            amount_e8s: BigInt(amount.toString()),
          },
        },
      ]
      break
    case 'remove_hot_key':
      invariant(hotKeyToRemove, '[ICP](createUnsignedNeuronCommandTransaction) Hot key to remove is required')
      rawCommand.command = [
        createCommandConfigOperation({
          RemoveHotKey: { hot_key_to_remove: [Principal.fromText(hotKeyToRemove)] },
        }),
      ]
      break
    case 'add_hot_key':
      invariant(hotKeyToAdd, '[ICP](createUnsignedNeuronCommandTransaction) Hot key to add is required')
      rawCommand.command = [
        createCommandConfigOperation({
          AddHotKey: { new_hot_key: [Principal.fromText(hotKeyToAdd)] },
        }),
      ]
      break
    case 'follow':
      invariant(followTopic !== undefined, '[ICP](createUnsignedNeuronCommandTransaction) Follow topic is required')
      invariant(followeesIds, '[ICP](createUnsignedNeuronCommandTransaction) Followees IDs are required')
      rawCommand.command = [
        {
          Follow: {
            topic: followTopic,
            followees: followeesIds.map((id: string) => ({ id: BigInt(id) })),
          },
        },
      ]
      break
  }

  const manageNeuronIdlFunc = getCanisterIdlFunc(idlFactoryGovernance, 'manage_neuron')
  const args = encodeCanisterIdlFunc(manageNeuronIdlFunc, [rawCommand])

  const canisterID = Principal.from(MAINNET_GOVERNANCE_CANISTER_ID)
  const unsignedTransaction: UnsignedTransaction = {
    request_type: SubmitRequestType.Call,
    canister_id: canisterID,
    method_name: 'manage_neuron',
    arg: args,
    sender: derivePrincipalFromPubkey(pubKey),
    ingress_expiry: new Expiry(DEFAULT_INGRESS_EXPIRY_DELTA_IN_MSECS),
  }

  return { unsignedTransaction, neuronCommandRawRequest: rawCommand }
}

export const createUnsignedSendTransaction = (
  transaction: any,
  pubKey: string,
): { unsignedTransaction: UnsignedTransaction; transferRawRequest: TransferRawRequest } => {
  const toAccount = AccountIdentifier.fromHex(transaction.recipient)

  const transferRawRequest: TransferRawRequest = {
    to: toAccount.toUint8Array(),
    amount: { e8s: BigInt(transaction.amount.toString()) },
    memo: BigInt(transaction.memo ?? 0),
    fee: { e8s: BigInt(ICP_FEES) },
    created_at_time: [{ timestamp_nanos: BigInt(new Date().getTime() * 1000000) }],
    from_subaccount: [],
  }

  const transferIdlFunc = getCanisterIdlFunc(idlFactoryLedger, 'transfer')
  const args = encodeCanisterIdlFunc(transferIdlFunc, [transferRawRequest])

  const canisterID = Principal.from(MAINNET_LEDGER_CANISTER_ID)
  const unsignedTransaction: UnsignedTransaction = {
    request_type: SubmitRequestType.Call,
    canister_id: canisterID,
    method_name: 'transfer',
    arg: args,
    sender: derivePrincipalFromPubkey(pubKey),
    ingress_expiry: new Expiry(DEFAULT_INGRESS_EXPIRY_DELTA_IN_MSECS),
  }

  return { unsignedTransaction, transferRawRequest }
}

export const createReadStateRequest = async (body: UnsignedTransaction) => {
  const requestId = await requestIdOf(body)
  const paths = [[new TextEncoder().encode('request_status'), requestId]] as ArrayBuffer[][]
  const readStateBody: ReadStateRequest = {
    request_type: 'read_state' as any,
    paths,
    ingress_expiry: body.ingress_expiry,
    sender: body.sender,
  }
  return {
    readStateBody,
    requestId,
  }
}
