module.exports = {
  devtool: 'source-map',
  entry: {
    'lib/js/tinymce-entrypoint': './lib/js/tinymce-entrypoint.ts',
    'lib/js/frontend': './lib/js/frontend.ts',
    'lib/js/Reflist': './lib/js/Reflist.tsx',
    'lib/js/PeerReviewMetabox': './lib/js/PeerReviewMetabox.tsx',
    'lib/js/components/ReferenceWindow/ReferenceWindow': './lib/js/components/ReferenceWindow/ReferenceWindow.tsx',
    'lib/js/components/PubmedWindow': './lib/js/components/PubmedWindow.tsx',
    'lib/js/components/ImportWindow': './lib/js/components/ImportWindow.tsx',
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
  ts: {
    compiler: 'ntypescript',
  },
};
