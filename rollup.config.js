import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import pkg from './package.json';

export default {
  input: 'src/main.js',
  output: {
    file: pkg.browser,
    format: 'umd',
    name: 'Crypto',
    exports: 'named',
    globals: {
      'crypto-js': 'CryptoJS',
      jsencrypt: 'JSEncrypt'
    }
  },
  plugins: [
    resolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**'
    })
  ],
  external: ['crypto-js', 'jsencrypt']
};
