import { hashTransaction } from './hash'

describe('hashTransaction', () => {
  it('should produce a deterministic sha256 hash of the CBOR-serialized transaction', () => {
    const result = hashTransaction({
      from: 'e8a1474afbed438be8b019c4293b9e01b33075d72757ac715183ae7c7ba77e37',
      to: 'a7c5b4cb43daa47de7880e6e228a0383c9c04aa2e5e0fcaa8e038e358e23b41a',
      amount: BigInt(100000000),
      fee: BigInt(10000),
      memo: BigInt(0),
      created_at_time: BigInt(1700000000000000000),
    })

    expect(result).toBe('61f80c5c1288ccd31ce4c2fb2d671d484030e5079b9fa34a4dad377ab284fdc5')
  })

  it('should handle zero created_at_time and non-zero memo', () => {
    const result = hashTransaction({
      from: 'e8a1474afbed438be8b019c4293b9e01b33075d72757ac715183ae7c7ba77e37',
      to: 'a7c5b4cb43daa47de7880e6e228a0383c9c04aa2e5e0fcaa8e038e358e23b41a',
      amount: BigInt(50000000),
      fee: BigInt(10000),
      memo: BigInt(12345),
      created_at_time: BigInt(0),
    })

    expect(result).toBe('d9a46ebe58aaee94d35821e6d9f0b4bac88493e1c38c1e8592b1ed2c078e2947')
  })

  it('should produce different hashes for different inputs', () => {
    const hash1 = hashTransaction({
      from: 'e8a1474afbed438be8b019c4293b9e01b33075d72757ac715183ae7c7ba77e37',
      to: 'a7c5b4cb43daa47de7880e6e228a0383c9c04aa2e5e0fcaa8e038e358e23b41a',
      amount: BigInt(100000000),
      fee: BigInt(10000),
      memo: BigInt(0),
      created_at_time: BigInt(1700000000000000000),
    })

    const hash2 = hashTransaction({
      from: 'e8a1474afbed438be8b019c4293b9e01b33075d72757ac715183ae7c7ba77e37',
      to: 'a7c5b4cb43daa47de7880e6e228a0383c9c04aa2e5e0fcaa8e038e358e23b41a',
      amount: BigInt(200000000),
      fee: BigInt(10000),
      memo: BigInt(0),
      created_at_time: BigInt(1700000000000000000),
    })

    expect(hash1).not.toBe(hash2)
  })

  it('should return a 64-character hex string', () => {
    const result = hashTransaction({
      from: 'e8a1474afbed438be8b019c4293b9e01b33075d72757ac715183ae7c7ba77e37',
      to: 'a7c5b4cb43daa47de7880e6e228a0383c9c04aa2e5e0fcaa8e038e358e23b41a',
      amount: BigInt(100000000),
      fee: BigInt(10000),
      memo: BigInt(0),
      created_at_time: BigInt(0),
    })

    expect(result).toMatch(/^[0-9a-f]{64}$/)
  })
})
