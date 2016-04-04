module.exports = {
  devtool: 'source-map',
  entry: {
    'inc/js/tinymce-entrypoint': './inc/js/tinymce-entrypoint.ts',
    'inc/js/frontend': './inc/js/frontend.ts',
    'inc/js/components/ReferenceWindow': './inc/js/components/ReferenceWindow.tsx',
    'inc/js/components/CitationWindow': './inc/js/components/CitationWindow.tsx',
    'inc/js/metaboxes': './inc/js/metaboxes.ts',
    'inc/js/components/PubmedWindow': './inc/js/components/PubmedWindow.tsx',
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
  },
  resolve: {
    extensions: ['', '.ts', '.tsx', '.js'],
  },
};
