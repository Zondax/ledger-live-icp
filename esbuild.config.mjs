import { build } from 'esbuild'
import { dtsPlugin } from 'esbuild-plugin-d.ts'

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
    plugins: [dtsPlugin()],
  }),
  build({
    entryPoints,
    outdir: 'dist/esm',
    bundle: true,
    platform: 'node',
    format: 'esm',
    target: 'node18',
    sourcemap: true,
    plugins: [dtsPlugin()],
  }),
])
