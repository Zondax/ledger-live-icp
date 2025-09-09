import { asciiStringToByteArray, arrayOfNumberToUint8Array, uint8ArrayToBigInt } from './index'
import { sha256 } from '@noble/hashes/sha2'
import invariant from 'invariant'
import { Principal } from '@dfinity/principal'
import { SubAccount, AccountIdentifier } from '@dfinity/ledger-icp'
import { derivePrincipalFromPubkey } from './pubKey'

// Cross-platform random bytes generation
const getRandomBytes = async (length: number): Promise<Uint8Array> => {
  if (typeof window !== 'undefined' && window.crypto) {
    // Browser environment
    const bytes = new Uint8Array(length)
    window.crypto.getRandomValues(bytes)
    return bytes
  } else {
    // Node.js environment
    const crypto = await import('crypto')
    return new Uint8Array(crypto.randomBytes(length))
  }
}

const getNeuronStakeSubAccountBytes = (nonce: Uint8Array, principal: Principal): Uint8Array => {
  const padding = asciiStringToByteArray('neuron-stake')

  const shaObj = sha256.create()
  shaObj.update(arrayOfNumberToUint8Array([0x0c, ...padding, ...principal.toUint8Array(), ...nonce]))
  return shaObj.digest()
}

export const getSubAccountIdentifier = async (govCanisterId: string, pubkey: string): Promise<{ identifier: string; nonce: string }> => {
  const nonceBytes = await getRandomBytes(8)
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
