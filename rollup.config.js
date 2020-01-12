const babel = require('rollup-plugin-babel')
const {uglify} = require('rollup-plugin-uglify')

const plugins = [
  babel({
    presets: [
      '@babel/preset-env',
    ],
  }),
  uglify(),
]


export default [{
  input: './src/io-client.js',
  output: {
    file: './lib/io-client.min.js',
    format: 'iife',
  },
  plugins,
},
]
