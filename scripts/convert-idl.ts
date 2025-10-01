import { build } from 'esbuild'
import fs from 'fs'
import path from 'path'

const idlFiles = [
  {
    input: '@dfinity/ledger-icp/dist/candid/ledger.idl.js',
    output: 'ledger.idl.cjs',
  },
  {
    input: '@dfinity/ledger-icp/dist/candid/index.idl.js',
    output: 'index.idl.cjs',
  },
  {
    input: '@dfinity/nns/dist/candid/governance.idl.js',
    output: 'governance.idl.cjs',
  },
  {
    input: '@dfinity/nns/dist/candid/old_list_neurons_service.certified.idl.js',
    output: 'old_list_neurons_service.certified.idl.cjs',
  },
]

const outputDir = path.join(process.cwd(), 'idl-cjs')

// Create output directory
fs.mkdirSync(outputDir, { recursive: true })

async function convertIdlFiles() {
  for (const file of idlFiles) {
    try {
      // Resolve the actual file path
      const inputPath = require.resolve(file.input)
      const outputPath = path.join(outputDir, file.output)

      // Use esbuild to convert ESM to CJS
      await build({
        entryPoints: [inputPath],
        outfile: outputPath,
        format: 'cjs',
        platform: 'node',
        bundle: false,
        minify: false,
        target: 'node14',
      })

      console.log(`✓ Converted ${file.input} -> ${file.output}`)
    } catch (error) {
      console.error(`✗ Failed to convert ${file.input}:`, error.message)
    }
  }

  // Create an index file for easy importing
  const indexContent = `
// Auto-generated CommonJS IDL exports
exports.ledgerIdlFactory = require('./ledger.idl.cjs').idlFactory;
exports.indexIdlFactory = require('./index.idl.cjs').idlFactory;
exports.governanceIdlFactory = require('./governance.idl.cjs').idlFactory;
exports.governanceIdlFactoryOld = require('./old_list_neurons_service.certified.idl.cjs').idlFactory;
`

  fs.writeFileSync(path.join(outputDir, 'index.cjs'), indexContent.trim())
  console.log('✓ Created index.cjs')
}

convertIdlFiles().catch(console.error)
