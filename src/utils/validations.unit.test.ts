import { validateAddress } from './validations'

describe('validateAddress', () => {
  it('should return false if the address is invalid', () => {
    const address = 'invalidAddress'
    const { isValid, error } = validateAddress(address)
    expect(isValid).toBe(false)
    expect(error).toBeDefined()
  })

  it('should return true if the address is valid', () => {
    const address = 'e8a1474afbed438be8b019c4293b9e01b33075d72757ac715183ae7c7ba77e37'
    const { isValid, error } = validateAddress(address)
    expect(isValid).toBe(true)
    expect(error).toBeUndefined()
  })
})
