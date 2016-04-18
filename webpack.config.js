module.exports = {
  devtool: 'source-map',
  entry: {
    'inc/js/tinymce-entrypoint': './inc/js/tinymce-entrypoint.ts',
    'inc/js/frontend': './inc/js/frontend.ts',
    'inc/js/Reflist': './inc/js/Reflist.tsx',
    'inc/js/PeerReviewMetabox': './inc/js/PeerReviewMetabox.tsx',
    'inc/js/components/ReferenceWindow': './inc/js/components/ReferenceWindow.tsx',
    'inc/js/components/PubmedWindow': './inc/js/components/PubmedWindow.tsx',
    'inc/js/components/BibtexWindow': './inc/js/components/BibtexWindow.tsx',
    'inc/js/vendor/noneditable': './inc/js/vendor/noneditable.ts',
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
        loader: 'babel?presets[]=es2015,presets[]=react!ts',
      },
    ],
  },
  resolve: {
    extensions: ['', '.ts', '.tsx', '.js'],
  },
};
