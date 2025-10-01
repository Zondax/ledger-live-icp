import { build } from 'esbuild'
import { dtsPlugin } from 'esbuild-plugin-d.ts'
import { importPatternPlugin } from 'esbuild-plugin-import-pattern'
import { execSync } from 'child_process'
import { polyfillNode } from 'esbuild-plugin-polyfill-node'
import { glob } from 'glob'

const entryPoints = glob.sync('src/**/*.ts').filter(file => !file.includes('.test.ts'))
await Promise.all([
  build({
    entryPoints,
    outdir: 'dist/browser',
    bundle: true,
    platform: 'browser',
    format: 'esm',
    target: ['chrome90', 'firefox88', 'safari14', 'edge90'],
    plugins: [
      polyfillNode({
        globals: {
          global: true,
          buffer: true,
          process: true,
        },
        polyfills: {
          crypto: true,
          url: true,
        },
      }),
      dtsPlugin(),
      importPatternPlugin(),
    ],
    define: {
      global: 'globalThis',
    },
  }),
])

// Use TypeScript compiler for CommonJS build
execSync('tsc --module commonjs --outDir dist/cjs', { stdio: 'inherit' })

// Generate types with TypeScript compiler
execSync('tsc --emitDeclarationOnly --outDir dist/types', { stdio: 'inherit' })
