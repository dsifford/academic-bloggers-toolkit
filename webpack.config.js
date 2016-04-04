module.exports = {
  devtool: 'source-map',
  entry: {
    'inc/js/tinymce-entrypoint': './inc/js/tinymce-entrypoint.ts',
    'inc/js/frontend': './inc/js/frontend.ts',
    'inc/js/components/referenceWindow': './inc/js/components/referenceWindow.tsx',
    'inc/js/components/inline-citation': './inc/js/components/inline-citation.ts',
    'inc/js/metaboxes': './inc/js/metaboxes.ts',
    'inc/js/components/pubmed-window': './inc/js/components/pubmed-window.tsx',
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
        loader: 'babel?presets[]=es2015!ts',
      },
    ],
    resolve: {
      extensions: ['', '.ts', 'tsx', '.js'],
    },
  },
};
