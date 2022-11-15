import serve from 'rollup-plugin-serve'

export default {
  input: './src/single-spa.js',
  output: {
    file: './lib/umd/my-single-spa.js',
    format: 'umd',
    name: 'singleSpa',
    sourcemap: true,
  },
  plugins: [
    serve({
      openPage: './index.html',
      contentBase: '',
      port: 3000,
    }),
  ],
}
