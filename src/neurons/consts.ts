import { Topic } from '@dfinity/nns'

// Topics name same as 'getTopicTitle' in ../common-logic/neuron.ts
export const KNOWN_TOPICS = {
  [Topic.Governance]: 'Governance',
  [Topic.SnsAndCommunityFund]: "SNS & Neurons' Fund",
  [Topic.Unspecified]: 'Unspecified',
  [Topic.ApiBoundaryNodeManagement]: 'API Boundary Node Management',
  [Topic.NodeAdmin]: 'Node Admin',
  [Topic.NeuronManagement]: 'Neuron Management',
  [Topic.ExchangeRate]: 'Exchange Rate',
  [Topic.NetworkEconomics]: 'Network Economics',
  [Topic.ParticipantManagement]: 'Participant Management',
  [Topic.SubnetManagement]: 'Subnet Management',
  [Topic.NetworkCanisterManagement]: 'Network Canister Management',
  [Topic.Kyc]: 'KYC',
  [Topic.NodeProviderRewards]: 'Node Provider Rewards',
  [Topic.IcOsVersionDeployment]: 'IC OS Version Deployment',
  [Topic.IcOsVersionElection]: 'IC OS Version Election',
  [Topic.SubnetRental]: 'Subnet Rental',
  [Topic.ProtocolCanisterManagement]: 'Protocol Canister Management',
  [Topic.ServiceNervousSystemManagement]: 'Service Nervous System Management',
}

// NeuronIds
export const KNOWN_NEURON_IDS: Record<string, string> = {
  '27': 'DFINITY Foundation',
  '12093733865587997066': 'Aviate Labs',
  '55674167450360693': 'ICPL.app',
  '1100477100620240869': 'ICP Hub Bulgaria',
  '2776371642396604393': 'ICP Hub México',
}

// Time constants
export const SECONDS_IN_MINUTE = 60
export const MINUTES_IN_HOUR = 60
export const HOURS_IN_DAY = 24
export const SECONDS_IN_HOUR = SECONDS_IN_MINUTE * MINUTES_IN_HOUR
export const SECONDS_IN_DAY = SECONDS_IN_HOUR * HOURS_IN_DAY
export const SECONDS_IN_YEAR = ((4 * 365 + 1) * SECONDS_IN_DAY) / 4
export const SECONDS_IN_HALF_YEAR = SECONDS_IN_YEAR / 2
export const SECONDS_IN_FOUR_YEARS = SECONDS_IN_YEAR * 4
export const SECONDS_IN_EIGHT_YEARS = SECONDS_IN_YEAR * 8

// Dissolve delay constants
export const MIN_DISSOLVE_DELAY = SECONDS_IN_HALF_YEAR

// Max ICP fees
export const ICP_FEES = 1e4
export const E8S_PER_ICP = 100_000_000
export const MAX_DISSOLVE_DELAY = SECONDS_IN_EIGHT_YEARS

// Bonus constants
export const MAX_DISSOLVE_DELAY_BONUS = 1 // = +100%
export const MAX_AGE_BONUS = 0.25 // = +25%

// ICP Canister Ids
export const ICP_NETWORK_URL = 'https://ic0.app'
// exportconst ICP_NETWORK_URL = "http://localhost:8080";
export const MAINNET_LEDGER_CANISTER_ID = 'ryjl3-tyaaa-aaaaa-aaaba-cai'
export const MAINNET_GOVERNANCE_CANISTER_ID = 'rrkah-fqaaa-aaaaa-aaaaq-cai'
export const MAINNET_INDEX_CANISTER_ID = 'qhbym-qaaaa-aaaaa-aaafq-cai'
// export const MAINNET_INDEX_CANISTER_ID = "q3fc5-haaaa-aaaaa-aaahq-cai";

// Min ICP Staking amount
export const ICP_MIN_STAKING_AMOUNT = 1e8

// Default ingress expiry delta in milliseconds
export const DEFAULT_INGRESS_EXPIRY_DELTA_IN_MSECS = 5 * 60 * 1000

// Voting power refresh threshold
export const VOTING_POWER_REFRESH_THRESHOLD_IN_DAYS = 30
