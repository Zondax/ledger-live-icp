import { AccountIdentifier } from '@dfinity/ledger-icp'
import { Secp256k1PublicKey } from '@dfinity/identity-secp256k1'
import { Principal } from '@dfinity/principal'
import { DerEncodedPublicKey } from '@dfinity/agent'

export const derivePrincipalFromPubkey = (publicKey: string): Principal => {
  const pubkeyArray = new Uint8Array(Buffer.from(publicKey, 'hex'))
  const pubkey = Secp256k1PublicKey.fromRaw(pubkeyArray.buffer)
  return Principal.selfAuthenticating(new Uint8Array(pubkey.toDer()))
}

export const deriveAddressFromPubkey = (publicKey: string): string => {
  const pubKeyArray = new Uint8Array(Buffer.from(publicKey, 'hex'))
  const pubkey = Secp256k1PublicKey.fromRaw(pubKeyArray.buffer)
  const principal = Principal.selfAuthenticating(new Uint8Array(pubkey.toDer()))
  const address = AccountIdentifier.fromPrincipal({ principal: principal })

  return address.toHex()
}

export const pubkeyToDer = (publicKey: string): DerEncodedPublicKey => {
  const pubKeyArray = new Uint8Array(Buffer.from(publicKey, 'hex'))
  const pubkey = Secp256k1PublicKey.fromRaw(pubKeyArray.buffer)
  return pubkey.toDer()
}
