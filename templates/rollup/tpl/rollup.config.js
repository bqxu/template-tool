import typescript from 'rollup-plugin-typescript2'
import external from 'rollup-plugin-peer-deps-external'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import nodePolyfills from 'rollup-plugin-polyfill-node'
import cleanup from 'rollup-plugin-cleanup'

import { terser } from 'rollup-plugin-terser'

import pkg from './package.json'

export default [
  {
    input: 'src/client.ts',
    output: [
      {
        file: pkg.browser,
        format: 'iife',
      },
    ],
    plugins: [
      nodePolyfills({
        include: ['include'],
      }),
      external(),
      resolve({
        preferBuiltins: true,
        mainFields: ['browser'],
      }),
      typescript({
        rollupCommonJSResolveHack: true,
        exclude: '**/__tests__/**',
        clean: true,
      }),
      commonjs({
        include: ['node_modules/**'],
      }),
      cleanup(),
      terser({
        format: {
          comments: () => false,
        },
      }),
    ],
  },
  {
    input: 'src/player.ts',
    output: [
      {
        file: pkg['browser-player'],
        format: 'cjs',
      },
    ],
    plugins: [
      typescript({
        rollupCommonJSResolveHack: true,
        exclude: '**/__tests__/**',
        clean: true,
      }),
      cleanup(),
      terser({
        format: {
          comments: () => false,
        },
      }),
    ],
  },
]
