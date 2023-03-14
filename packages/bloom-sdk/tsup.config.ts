import type { Options } from 'tsup'

const config: Options = {
  entry: ['src/index.ts'],
  dts: true,
  sourcemap: true,
  clean: true,
  skipNodeModulesBundle: true,
  format: ['cjs', 'esm'],
}

export default config
