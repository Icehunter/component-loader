import { nodeResolve } from '@rollup/plugin-node-resolve';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import progress from 'rollup-plugin-progress';
import styles from 'rollup-plugin-styles';
import svg from 'rollup-plugin-svg';
import typescript from 'rollup-plugin-typescript2';

const plugins = [
  progress(),
  peerDepsExternal(),
  nodeResolve({
    resolveOnly: ['style-inject']
  }),
  styles({
    modules: true,
    minimize: true,
    sourceMap: true
  }),
  typescript({
    typescript: require('typescript'),
    tsconfig: 'tsconfig.build.json',
    tsconfigOverride: {
      exclude: ['**/*.test.ts', '**/*.test.tsx']
    }
  }),
  svg(),
  {
    name: 'Style Inject Fix',
    generateBundle: (options, bundle) => {
      Object.entries(bundle).forEach((entry) => {
        // early return if the file we're currently looking at doesn't need to be acted upon by this plugin
        if (!entry[0].match(/.*(.scss.js)$/)) {
          return;
        }

        // this line only runs for .scss.js files, which were generated by the postcss plugin.
        // depending on the use-case, the relative path to style-inject might need to change
        bundle[entry[0]].code = entry[1].code.replace(
          /(\.(\.)?\/){1,}node_modules\/rollup-plugin-styles\/dist\/runtime\/inject\-css\.js/i,
          'style-inject'
        );
      });
    }
  }
];

const config = [
  {
    input: 'src/lib/index.ts',
    output: {
      preserveModules: true,
      dir: 'lib/esm',
      format: 'module',
      sourcemap: true,
      exports: 'auto'
    },
    plugins
  },
  {
    input: 'src/lib/index.ts',
    output: {
      preserveModules: true,
      dir: 'lib',
      format: 'commonjs',
      sourcemap: true,
      exports: 'auto'
    },
    plugins
  }
];

export default config;