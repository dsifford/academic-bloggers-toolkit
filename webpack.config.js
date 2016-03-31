module.exports = {
  devtool: 'source-map',
  entry: {
    'inc/js/tinymce-entrypoint': './inc/js/tinymce-entrypoint.ts',
    'inc/js/frontend': './inc/js/frontend.ts',
    'inc/js/tinymce-views/formatted-reference/formatted-reference': './inc/js/tinymce-views/formatted-reference/formatted-reference.ts',
    'inc/js/tinymce-views/inline-citation/inline-citation': './inc/js/tinymce-views/inline-citation/inline-citation.ts',
    'inc/js/metaboxes': './inc/js/metaboxes.ts',
    'inc/js/tinymce-views/pubmed-window/pubmed-window': './inc/js/tinymce-views/pubmed-window/pubmed-window.tsx',
  },
  output: {
    filename: '[name].js',
    path: __dirname,
  },
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      }
    ],
    resolve: {
      extensions: ['', '.ts', 'tsx', '.js']
    }
  }
}
