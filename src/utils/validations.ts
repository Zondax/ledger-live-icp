import { Principal } from '@dfinity/principal'
import { AccountIdentifier } from '@dfinity/ledger-icp'

export const validatePrincipal = (principal: string): { isValid: boolean; error?: string } => {
  try {
    Principal.fromText(principal)
    return { isValid: true }
  } catch (e) {
    const defaultError = 'Invalid principal'
    return { isValid: false, error: e instanceof Error ? e.message || defaultError : defaultError }
  }
}

export function validateAddress(address: string): { isValid: boolean; error?: string } {
  const defaultError = 'Invalid address, account identifier could not be created.'
  try {
    const accId = AccountIdentifier.fromHex(address)
    if (!accId || !accId.toHex()) {
      return { isValid: false, error: defaultError }
    }
    return { isValid: true }
  } catch (e) {
    return { isValid: false, error: e instanceof Error ? e.message || defaultError : defaultError }
  }
}

export function validateMemo(memo?: string): { isValid: boolean; error?: string } {
  try {
    const res = BigInt(memo ?? 0)

    if (res < 0) {
      return { isValid: false }
    }
    return { isValid: true }
  } catch (e) {
    const defaultError = 'Invalid memo'
    return { isValid: false, error: e instanceof Error ? e.message || defaultError : defaultError }
  }
}
