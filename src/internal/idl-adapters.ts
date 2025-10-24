/**
 * IDL adapter for Node.js/CommonJS environments
 *
 * This module imports the converted CommonJS IDL factories from the idl-cjs directory.
 * These are used for the Node.js/CommonJS build target.
 *
 * For browser/ESM builds, see idl-adapters.browser.ts
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { ledgerIdlFactory, indexIdlFactory, governanceIdlFactory, governanceIdlFactoryOld } = require('../../idl-cjs/index.cjs')

export { ledgerIdlFactory, indexIdlFactory, governanceIdlFactory, governanceIdlFactoryOld }
