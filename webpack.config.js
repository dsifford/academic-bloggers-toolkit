module.exports = {
  devtool: 'source-map',
  entry: {
    'tinymce-entrypoint': './inc/js/tinymce-entrypoint.ts'
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/test'
  },
  module: {
    loaders: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'awesome-typescript-loader',
      }
    ],
    resolve: {
      extensions: ['.ts']
    }
  }
}
