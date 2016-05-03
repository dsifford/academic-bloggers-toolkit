/* eslint-env node, es6 */
module.exports = {
    entry: {
        'lib/js/Frontend': './lib/js/Frontend.ts',
        'lib/js/TinymceEntrypoint': './lib/js/TinymceEntrypoint.ts',
        'lib/js/components/reference-list/Entrypoint': './lib/js/components/reference-list/Entrypoint.tsx',
        'lib/js/components/PeerReviewMetabox': './lib/js/components/PeerReviewMetabox.tsx',
        'lib/js/components/reference-window/ReferenceWindow': './lib/js/components/reference-window/ReferenceWindow.tsx',
        'lib/js/components/pubmed-window/Entrypoint': './lib/js/components/pubmed-window/Entrypoint.tsx',
        'lib/js/components/import-window/Entrypoint': './lib/js/components/import-window/Entrypoint.tsx',
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
