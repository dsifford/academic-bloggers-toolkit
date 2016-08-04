/* eslint-env node, es6 */
module.exports = {
    entry: {
        'lib/js/Frontend': './lib/js/Frontend.ts',
        'lib/js/TinymceEntrypoint': './lib/js/TinymceEntrypoint.ts',
        'lib/js/reference-list/index': './lib/js/reference-list/',
        'lib/js/peer-review-metabox/index': './lib/js/peer-review-metabox/',
        'lib/js/tinymce/components/reference-window/index': './lib/js/tinymce/components/reference-window/',
        'lib/js/tinymce/components/pubmed-window/index': './lib/js/tinymce/components/pubmed-window/',
        'lib/js/tinymce/components/import-window/index': './lib/js/tinymce/components/import-window/',
    },
    output: {
        filename: '[name].js',
        path: __dirname,
    },
    devtool: 'eval-source-map',
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loaders: ['babel', 'ts'],
            },
            {
                test: /\.css$/,
                loader: 'style!css',
            },
        ],
    },
    resolve: {
        extensions: ['', '.ts', '.tsx', '.js'],
    },
};
