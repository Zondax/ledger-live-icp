import { build } from 'esbuild'
import { dtsPlugin } from 'esbuild-plugin-d.ts'
import path from 'path'
import wildcardImports from 'esbuild-plugin-wildcard-imports'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const entryPoints = ['src/index.ts', 'src/canisterIDL.ts', 'src/utils/index.ts', 'src/agent.ts', 'src/nns.ts', 'src/neurons/index.ts']
await Promise.all([
  build({
    entryPoints,
    outdir: 'dist/cjs',
    bundle: true,
    platform: 'node',
    format: 'cjs',
    target: 'node18',
    sourcemap: true,
    plugins: [dtsPlugin(), wildcardImports()],
  }),
  build({
    entryPoints,
    outdir: 'dist/esm',
    bundle: true,
    platform: 'node',
    format: 'esm',
    target: 'node18',
    sourcemap: true,
    plugins: [dtsPlugin(), wildcardImports()],
    alias: {
      '@dfinity/principal': path.resolve(__dirname, 'node_modules/@dfinity/principal/lib/esm/index.js'),
      '@dfinity/utils': path.resolve(__dirname, 'node_modules/@dfinity/utils/dist/esm/index.js'),
      '@dfinity/agent': path.resolve(__dirname, 'node_modules/@dfinity/agent/lib/esm/index.js'),
      '@dfinity/candid': path.resolve(__dirname, 'node_modules/@dfinity/candid/lib/esm/index.js'),
      '@dfinity/identity-secp256k1': path.resolve(__dirname, 'node_modules/@dfinity/identity-secp256k1/lib/esm/index.js'),
      '@dfinity/ledger-icp': path.resolve(__dirname, 'node_modules/@dfinity/ledger-icp/dist/esm/index.js'),
      '@dfinity/nns': path.resolve(__dirname, 'node_modules/@dfinity/nns/dist/esm/index.js'),
    },
  }),
])
