const path = require('path');
const webpack = require('webpack');
const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;

const devPlugins = [
    new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
    }),
    new webpack.NoErrorsPlugin(),
    new ForkCheckerPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: Infinity,
        filename: 'vendor/vendor.bundle.js',
    }),
];

const productionPlugins = [
    ...devPlugins,
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false,
        },
        output: {
            comments: false,
        },
        sourceMap: false,
    }),
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('production'),
        },
    }),
];

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    devtool: isProduction ? 'hidden-source-map' : 'eval-source-map',
    cache: true,
    entry: {
        'lib/js/Frontend': './src/lib/js/Frontend.ts',
        'lib/js/tinymce/index': './src/lib/js/tinymce/index.ts',
        'lib/js/reference-list/index': './src/lib/js/reference-list/',
        'lib/js/tinymce/components/reference-window/index': './src/lib/js/tinymce/components/reference-window/', // eslint-disable-line
        'lib/js/tinymce/components/pubmed-window/index': './src/lib/js/tinymce/components/pubmed-window/', // eslint-disable-line
        'lib/js/tinymce/components/import-window/index': './src/lib/js/tinymce/components/import-window/', // eslint-disable-line
        vendor: ['react', 'mobx', 'mobx-react'],
    },
    output: {
        filename: '[name].js',
    },
    resolve: {
        modules: [path.resolve(__dirname, 'src'), 'node_modules'],
        extensions: ['*', '.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
        mainFiles: ['index'],
        mainFields: ['main', 'browser'],
        descriptionFiles: ['package.json'],
    },
    plugins: isProduction ? productionPlugins : devPlugins,
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                include: path.resolve(__dirname, 'src'),
                loaders: ['awesome-typescript'],
            },
            {
                test: /\.css$/,
                loaders: ['style', 'css'],
            },
        ],
    },
};
