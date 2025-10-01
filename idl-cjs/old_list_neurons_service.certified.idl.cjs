var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var old_list_neurons_service_certified_idl_exports = {};
__export(old_list_neurons_service_certified_idl_exports, {
  idlFactory: () => idlFactory
});
module.exports = __toCommonJS(old_list_neurons_service_certified_idl_exports);
const idlFactory = ({ IDL }) => {
  const NeuronId = IDL.Record({ "id": IDL.Nat64 });
  const Followees = IDL.Record({ "followees": IDL.Vec(NeuronId) });
  const KnownNeuronData = IDL.Record({
    "name": IDL.Text,
    "description": IDL.Opt(IDL.Text)
  });
  const NeuronStakeTransfer = IDL.Record({
    "to_subaccount": IDL.Vec(IDL.Nat8),
    "neuron_stake_e8s": IDL.Nat64,
    "from": IDL.Opt(IDL.Principal),
    "memo": IDL.Nat64,
    "from_subaccount": IDL.Vec(IDL.Nat8),
    "transfer_timestamp": IDL.Nat64,
    "block_height": IDL.Nat64
  });
  const BallotInfo = IDL.Record({
    "vote": IDL.Int32,
    "proposal_id": IDL.Opt(NeuronId)
  });
  const DissolveState = IDL.Variant({
    "DissolveDelaySeconds": IDL.Nat64,
    "WhenDissolvedTimestampSeconds": IDL.Nat64
  });
  const Neuron = IDL.Record({
    "id": IDL.Opt(NeuronId),
    "staked_maturity_e8s_equivalent": IDL.Opt(IDL.Nat64),
    "controller": IDL.Opt(IDL.Principal),
    "recent_ballots": IDL.Vec(BallotInfo),
    "voting_power_refreshed_timestamp_seconds": IDL.Opt(IDL.Nat64),
    "kyc_verified": IDL.Bool,
    "potential_voting_power": IDL.Opt(IDL.Nat64),
    "neuron_type": IDL.Opt(IDL.Int32),
    "not_for_profit": IDL.Bool,
    "maturity_e8s_equivalent": IDL.Nat64,
    "deciding_voting_power": IDL.Opt(IDL.Nat64),
    "cached_neuron_stake_e8s": IDL.Nat64,
    "created_timestamp_seconds": IDL.Nat64,
    "auto_stake_maturity": IDL.Opt(IDL.Bool),
    "aging_since_timestamp_seconds": IDL.Nat64,
    "hot_keys": IDL.Vec(IDL.Principal),
    "account": IDL.Vec(IDL.Nat8),
    "joined_community_fund_timestamp_seconds": IDL.Opt(IDL.Nat64),
    "dissolve_state": IDL.Opt(DissolveState),
    "followees": IDL.Vec(IDL.Tuple(IDL.Int32, Followees)),
    "neuron_fees_e8s": IDL.Nat64,
    "visibility": IDL.Opt(IDL.Int32),
    "transfer": IDL.Opt(NeuronStakeTransfer),
    "known_neuron_data": IDL.Opt(KnownNeuronData),
    "spawn_at_timestamp_seconds": IDL.Opt(IDL.Nat64)
  });
  const NeuronInfo = IDL.Record({
    "dissolve_delay_seconds": IDL.Nat64,
    "recent_ballots": IDL.Vec(BallotInfo),
    "voting_power_refreshed_timestamp_seconds": IDL.Opt(IDL.Nat64),
    "potential_voting_power": IDL.Opt(IDL.Nat64),
    "neuron_type": IDL.Opt(IDL.Int32),
    "deciding_voting_power": IDL.Opt(IDL.Nat64),
    "created_timestamp_seconds": IDL.Nat64,
    "state": IDL.Int32,
    "stake_e8s": IDL.Nat64,
    "joined_community_fund_timestamp_seconds": IDL.Opt(IDL.Nat64),
    "retrieved_at_timestamp_seconds": IDL.Nat64,
    "visibility": IDL.Opt(IDL.Int32),
    "known_neuron_data": IDL.Opt(KnownNeuronData),
    "voting_power": IDL.Nat64,
    "age_seconds": IDL.Nat64
  });
  const ListNeurons = IDL.Record({
    "neuron_ids": IDL.Vec(IDL.Nat64),
    "include_neurons_readable_by_caller": IDL.Bool
  });
  const ListNeuronsResponse = IDL.Record({
    "neuron_infos": IDL.Vec(IDL.Tuple(IDL.Nat64, NeuronInfo)),
    "full_neurons": IDL.Vec(Neuron)
  });
  return IDL.Service({
    "list_neurons": IDL.Func([ListNeurons], [ListNeuronsResponse], [])
  });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  idlFactory
});
