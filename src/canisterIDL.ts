import { idlFactory as ledgerIdlFactory } from '@dfinity/ledger-icp/dist/candid/ledger.idl'
import { idlFactory as indexIdlFactory } from '@dfinity/ledger-icp/dist/candid/index.idl'
import { idlFactory as governanceIdlFactory } from '@dfinity/nns/dist/candid/governance.idl'
import { idlFactory as governanceIdlFactoryOld } from '@dfinity/nns/dist/candid/old_list_neurons_service.certified.idl'
import { IDL } from '@dfinity/candid'
import invariant from 'invariant'

export const getCanisterIdlFunc = (idlFactory: IDL.InterfaceFactory, methodName: string) => {
  const func = idlFactory({ IDL })._fields.find((f: any) => f[0] === methodName)
  invariant(func, `[ICP](getCanisterIdlFunc) Method ${methodName} not found`)
  return func[1]
}

export const encodeCanisterIdlFunc = (func: IDL.FuncClass, args: any) => {
  return IDL.encode(func.argTypes, args)
}

export const decodeCanisterIdlFunc = <T>(func: IDL.FuncClass, args: ArrayBuffer): T => {
  return IDL.decode(func.retTypes, args) as T
}

export { ledgerIdlFactory, indexIdlFactory, governanceIdlFactory, governanceIdlFactoryOld }
