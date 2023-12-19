/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import summary from 'rollup-plugin-summary';
import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import copy from 'rollup-plugin-copy';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import litcss from 'rollup-plugin-postcss-lit';

const TARGETS = [
  {src: 'src/index.html', dest: 'dist'},
  {src: 'src/index.css', dest: 'dist'},
  {
    src: '../node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js',
    dest: 'dist',
  },
  {src: '../node_modules/lit/polyfill-support.js', dest: 'dist'},
];

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'esm',
    sourcemap: true,
  },
  onwarn(warning) {
    if (warning.code !== 'THIS_IS_UNDEFINED') {
      console.error(`(!) ${warning.message}`);
    }
  },
  plugins: [
    replace({'Reflect.decorate': 'undefined', preventAssignment: true}),
    resolve(),
    typescript(),
    postcss({
      minimize: false,
      inject: false,
    }),
    litcss(),
    terser({
      ecma: 2017,
      module: true,
      warnings: true,
      mangle: {
        properties: {
          regex: /^__/,
        },
      },
    }),
    copy({
      targets: TARGETS,
    }),
    summary(),
  ],
};
