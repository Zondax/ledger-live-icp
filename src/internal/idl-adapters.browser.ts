/**
 * IDL adapter for browser/ESM environments
 *
 * This module imports the original ESM IDL factories directly from @dfinity packages.
 * These are used for the browser/ESM build target.
 *
 * For Node.js/CommonJS builds, see idl-adapters.ts
 */

import { idlFactory as ledgerIdlFactory } from '@dfinity/ledger-icp/dist/candid/ledger.idl.js'
import { idlFactory as indexIdlFactory } from '@dfinity/ledger-icp/dist/candid/index.idl.js'
import { idlFactory as governanceIdlFactory } from '@dfinity/nns/dist/candid/governance.idl.js'
import { idlFactory as governanceIdlFactoryOld } from '@dfinity/nns/dist/candid/old_list_neurons_service.certified.idl.js'

export { ledgerIdlFactory, indexIdlFactory, governanceIdlFactory, governanceIdlFactoryOld }
