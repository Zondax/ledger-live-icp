import { asciiStringToByteArray, arrayOfNumberToUint8Array, uint8ArrayToBigInt } from './index'
import { sha256 } from '@noble/hashes/sha256'
import invariant from 'invariant'
import { Principal } from '@dfinity/principal'
import { randomBytes } from 'crypto'
import { SubAccount, AccountIdentifier } from '@dfinity/ledger-icp'
import { derivePrincipalFromPubkey } from './pubKey'

const getNeuronStakeSubAccountBytes = (nonce: Uint8Array, principal: Principal): Uint8Array => {
  const padding = asciiStringToByteArray('neuron-stake')

  const shaObj = sha256.create()
  shaObj.update(arrayOfNumberToUint8Array([0x0c, ...padding, ...principal.toUint8Array(), ...nonce]))
  return shaObj.digest()
}

export const getSubAccountIdentifier = (govCanisterId: string, pubkey: string): { identifier: string; nonce: string } => {
  const nonceBytes = new Uint8Array(randomBytes(8))
  const nonce = uint8ArrayToBigInt(nonceBytes)

  const toSubAccount = SubAccount.fromBytes(getNeuronStakeSubAccountBytes(nonceBytes, derivePrincipalFromPubkey(pubkey)))

  invariant(toSubAccount instanceof SubAccount, 'subaccount cannot be created')

  const subAccountIdentifier = AccountIdentifier.fromPrincipal({
    principal: Principal.from(govCanisterId),
    subAccount: toSubAccount,
  })

  return {
    identifier: subAccountIdentifier.toHex(),
    nonce: nonce.toString(),
  }
}
