const path = require('path');
const webpack = require('webpack');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isProduction = process.env.NODE_ENV === 'production';

const sharedPlugins = [
    new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
    }),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: Infinity,
        filename: 'vendor/vendor.bundle.js',
    }),
    new webpack.DefinePlugin({
        __DEV__: JSON.stringify(!isProduction),
    }),
];

const devPlugins = [
    ...sharedPlugins,
    // new BundleAnalyzerPlugin({
    //     analyzerMode: 'server',
    //     analyzerPort: 8888,
    //     openAnalyzer: true,
    // }),
];

const productionPlugins = [
    ...sharedPlugins,
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false,
            unused: true,
            dead_code: true,
        },
        screw_ie8: true,
    }),
];

module.exports = {
    devtool: 'eval-source-map',
    cache: true,
    entry: {
        'lib/js/Frontend': './src/lib/js/Frontend.ts',
        'lib/js/tinymce/index': './src/lib/js/tinymce/index.ts',
        'lib/js/reference-list/index': './src/lib/js/reference-list/',
        'lib/js/tinymce/components/reference-window/index': './src/lib/js/tinymce/components/reference-window/', // eslint-disable-line
        'lib/js/tinymce/components/pubmed-window/index': './src/lib/js/tinymce/components/pubmed-window/', // eslint-disable-line
        'lib/js/tinymce/components/edit-reference-window/index': './src/lib/js/tinymce/components/edit-reference-window/', // eslint-disable-line
        'lib/js/tinymce/components/import-window/index': './src/lib/js/tinymce/components/import-window/', // eslint-disable-line
        vendor: [
            'react',
            'react-dom',
            'mobx',
            'mobx-react',
            'mobx-react-devtools',
            'babel-polyfill',
        ],
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
                exclude: /__tests__/,
                loaders: ['babel-loader', 'ts-loader'],
            },
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader'],
            },
        ],
    },
};
