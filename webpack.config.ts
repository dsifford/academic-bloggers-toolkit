import { resolve } from 'path';
import * as webpack from 'webpack';
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isProduction = process.env.NODE_ENV === 'production';

const sharedPlugins: webpack.Plugin[] = [
    new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: Infinity,
        filename: 'vendor/vendor.bundle.js',
    }),
    new webpack.DefinePlugin({
        __DEV__: JSON.stringify(!isProduction),
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
];

const devPlugins: webpack.Plugin[] = [
    ...sharedPlugins,
    // new BundleAnalyzerPlugin({
    //     analyzerMode: 'server',
    //     analyzerPort: 8888,
    //     openAnalyzer: true,
    // }),
];

const productionPlugins = [
    ...sharedPlugins,
    new webpack.optimize.UglifyJsPlugin(),
];

const config: webpack.Configuration = {
    devtool: 'eval-source-map',
    cache: true,
    entry: {
        'js/Frontend': './src/js/Frontend.ts',
        'js/tinymce/index': './src/js/tinymce/index.ts',
        'js/reference-list/index': './src/js/reference-list/',
        'js/tinymce/components/reference-window/index':
            './src/js/tinymce/components/reference-window/',
        'js/tinymce/components/pubmed-window/index':
            './src/js/tinymce/components/pubmed-window/',
        'js/tinymce/components/edit-reference-window/index':
            './src/js/tinymce/components/edit-reference-window/',
        'js/tinymce/components/import-window/index':
            './src/js/tinymce/components/import-window/',
        vendor: [
            'react',
            'react-dom',
            'mobx',
            'mobx-react',
        ],
    },
    output: {
        filename: '[name].js',
    },
    resolve: {
        modules: [resolve(__dirname, 'src'), 'node_modules'],
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
                include: resolve(__dirname, 'src'),
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

export default config;
