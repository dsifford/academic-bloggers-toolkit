/* eslint-env node, es6 */
module.exports = {
    entry: {
        'lib/js/Frontend': './lib/js/Frontend.ts',
        'lib/js/TinymceEntrypoint': './lib/js/TinymceEntrypoint.ts',
        'lib/js/components/ReferenceList': './lib/js/components/ReferenceList.tsx',
        'lib/js/components/PeerReviewMetabox': './lib/js/components/PeerReviewMetabox.tsx',
        'lib/js/components/reference-window/ReferenceWindow': './lib/js/components/reference-window/ReferenceWindow.tsx',
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
