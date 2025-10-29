import { build } from 'esbuild'
import { execSync } from 'child_process'
import { glob } from 'glob'
import { promises as fs } from 'fs'
import { dtsPlugin } from 'esbuild-plugin-d.ts'
import { importPatternPlugin } from 'esbuild-plugin-import-pattern'

// ============================================================================
// Plugins
// ============================================================================

/**
 * Rewrites imports to use browser-specific adapter modules
 * Transforms: ./internal/idl-adapters -> ./internal/idl-adapters.browser
 */
const createBrowserAdapterPlugin = () => ({
  name: 'browser-adapter-resolve',
  setup(build) {
    build.onLoad({ filter: /canisterIDL\.ts$/ }, async args => {
      const contents = await fs.readFile(args.path, 'utf8')
      const transformed = contents.replace(/from ['"]\.\/internal\/idl-adapters['"]/g, "from './internal/idl-adapters.browser'")
      return { contents: transformed, loader: 'ts' }
    })
  },
})

// ============================================================================
// Build Configuration
// ============================================================================

const entryPoints = glob.sync('src/**/*.ts').filter(file => !file.includes('.test.ts'))

const browserBuildOptions = {
  entryPoints,
  outdir: 'dist/browser',
  bundle: false,
  platform: 'browser',
  format: 'esm',
  target: ['chrome90', 'firefox88', 'safari14', 'edge90'],
  define: {
    global: 'globalThis',
  },
  plugins: [createBrowserAdapterPlugin(), dtsPlugin(), importPatternPlugin()],
}

// ============================================================================
// Build Execution
// ============================================================================

// Browser ESM build
await build(browserBuildOptions)

// CommonJS build (using TypeScript compiler)
execSync('tsc --module commonjs --outDir dist/cjs', { stdio: 'inherit' })

// Type definitions
execSync('tsc --emitDeclarationOnly --outDir dist/types', { stdio: 'inherit' })
