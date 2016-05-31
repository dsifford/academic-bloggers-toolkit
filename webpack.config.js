/* eslint-env node, es6 */
module.exports = {
    entry: {
        'lib/js/Frontend': './lib/js/Frontend.ts',
        'lib/js/TinymceEntrypoint': './lib/js/TinymceEntrypoint.ts',
        'lib/js/reference-list/components/Entrypoint': './lib/js/reference-list/components/Entrypoint.tsx',
        'lib/js/components/peer-review-metabox/Entrypoint': './lib/js/components/peer-review-metabox/Entrypoint.tsx',
        'lib/js/tinymce/components/reference-window/ReferenceWindow': './lib/js/tinymce/components/reference-window/ReferenceWindow.tsx',
        'lib/js/tinymce/components/pubmed-window/Entrypoint': './lib/js/tinymce/components/pubmed-window/Entrypoint.tsx',
        'lib/js/tinymce/components/import-window/Entrypoint': './lib/js/tinymce/components/import-window/Entrypoint.tsx'
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
    ts: {
        compiler: 'ntypescript',
    },
};
