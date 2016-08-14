const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        'lib/js/Frontend': './src/lib/js/Frontend.ts',
        'lib/js/tinymce/index': './src/lib/js/tinymce/index.ts',
        'lib/js/reference-list/index': './src/lib/js/reference-list/',
        'lib/js/tinymce/components/reference-window/index': './src/lib/js/tinymce/components/reference-window/',
        'lib/js/tinymce/components/pubmed-window/index': './src/lib/js/tinymce/components/pubmed-window/',
        'lib/js/tinymce/components/import-window/index': './src/lib/js/tinymce/components/import-window/',
    },
    output: {
        filename: '[name].js',
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.NoErrorsPlugin(),
    ],
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules/,
                loaders: ['babel', 'ts'],
            },
        ],
    },
};
