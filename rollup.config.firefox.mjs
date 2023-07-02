import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';
import copy from 'rollup-plugin-copy'

const production = !process.env.ROLLUP_WATCH
const outputDir = "static_ff/build";

function getPlugins({ name }) {
  return [
    svelte({
      preprocess: sveltePreprocess({
      }),
      // enable run-time checks when not in production
      dev: !production,
      // we'll extract any component CSS out into
      // a separate file — better for performance
      css: css => {
        css.write(`${outputDir}/${name}.css`)
      },
    }),
    resolve({ browser: true }),
    commonjs(),
    typescript(),
    css({ output: `${name}.css` })

  ];
}

export default [
  {
    input: 'src/popup.ts',
    output: {
      sourcemap: true,
      format: 'iife',
      name: 'popup',
      file: `${outputDir}/popup.js`,
    },
    plugins: getPlugins({ name: "popup" }),
  },
  {
    input: 'src/background.ts',
    output: {
      sourcemap: true,
      format: 'iife',
      name: 'background',
      file: `${outputDir}/background.js`,
    },
    plugins: [
      resolve({ browser: true }),
      commonjs(),
      typescript(),
      copy({
        targets: [
          { src: 'assets/icons', dest: 'static_ff/' },
          { src: 'assets/styles', dest: 'static_ff/' },
          { src: 'assets/popup.html', dest: 'static_ff/' }
        ]
      })
    ]
  },
  {
    input: 'src/content.ts',
    output: {
      sourcemap: true,
      format: 'iife',
      name: 'content',
      file: `${outputDir}/content.js`,
    },
    plugins: getPlugins({ name: "content" }),
  },
];