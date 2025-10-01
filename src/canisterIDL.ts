import { IDL } from '@dfinity/candid'
import invariant from 'invariant'

// Import from the converted CommonJS files
// These will be copied to dist/idl-cjs during build
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { ledgerIdlFactory, indexIdlFactory, governanceIdlFactory, governanceIdlFactoryOld } = require('../idl-cjs/index.cjs')

export { ledgerIdlFactory, indexIdlFactory, governanceIdlFactory, governanceIdlFactoryOld }

export const getCanisterIdlFunc = (idlFactory: any, methodName: string) => {
  const func = idlFactory({ IDL })._fields.find((f: any[]) => f[0] === methodName)
  invariant(func, `[ICP](getCanisterIdlFunc) Method ${methodName} not found`)
  return func[1]
}

export const encodeCanisterIdlFunc = (func: any, args: any[]) => {
  return IDL.encode(func.argTypes, args)
}

export const decodeCanisterIdlFunc = (func: any, args: ArrayBuffer) => {
  return IDL.decode(func.retTypes, args)
}
