import { TsConfigPathsPlugin } from 'awesome-typescript-loader';
import { execSync } from 'child_process';
import { resolve } from 'path';
import * as webpack from 'webpack';

const RollbarSourceMapPlugin = require('rollbar-sourcemap-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const IS_DEPLOYING = process.env.IS_DEPLOYING === 'true';
const VERSION = IS_PRODUCTION ? execSync('git rev-parse HEAD', { encoding: 'utf8' }) : '';

const plugins = new Set<webpack.Plugin>([
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.EnvironmentPlugin({
        NODE_ENV: 'development',
        ROLLBAR_CLIENT_TOKEN: '',
        COMMIT_HASH: VERSION,
    }),
    new ExtractTextPlugin({
        filename: (getPath: (format: string) => string): string => {
            return getPath('[name]')
                .split('/')
                .reverse()
                .filter(n => n !== 'index')
                .map(n => `css/${n}` + '.css')[0];
        },
        ignoreOrder: true,
    }),
]);

if (IS_PRODUCTION) {
    plugins
        .add(new webpack.optimize.ModuleConcatenationPlugin())
        .add(new webpack.optimize.OccurrenceOrderPlugin(true));
}

if (IS_DEPLOYING) {
    plugins.add(
        new RollbarSourceMapPlugin({
            accessToken: process.env.ROLLBAR_API_TOKEN,
            version: VERSION,
            publicPath: 'http://dynamichost/wp-content/plugins/academic-bloggers-toolkit',
        }),
    );
}

export default <webpack.Configuration>{
    watch: !IS_PRODUCTION,
    watchOptions: {
        ignored: /(node_modules|gulpfile|dist|lib|webpack.config)/,
    },
    devtool: 'source-map',
    entry: {
        'js/worker': ['@babel/polyfill', './src/js/worker/worker'],
        'js/frontend': ['@babel/polyfill', './src/js/frontend'],
        'js/reference-list/index': [
            './src/js/utils/polyfill',
            'whatwg-fetch',
            'raf/polyfill',
            './src/js/reference-list/',
        ],
        'js/drivers/tinymce': ['./src/js/drivers/tinymce'],
    },
    output: {
        path: resolve(__dirname, 'dist'),
        filename: '[name].js',
    },
    resolve: {
        modules: [resolve(__dirname, 'src'), 'node_modules'],
        extensions: ['*', '.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
        plugins: [new TsConfigPathsPlugin()],
    },
    plugins: [...plugins],
    stats: {
        children: false,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /(?:__tests__|node_modules)/,
                use: [
                    {
                        loader: 'awesome-typescript-loader',
                        options: {
                            useBabel: true,
                            useCache: !IS_PRODUCTION,
                            cacheDirectory: resolve(
                                __dirname,
                                'node_modules/.cache/awesome-typescript-loader',
                            ),
                            babelCore: '@babel/core',
                            reportFiles: ['src/**/*.{ts,tsx}'],
                        },
                    },
                ],
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                                modules: true,
                                minimize: IS_PRODUCTION,
                                sourceMap: !IS_PRODUCTION,
                                camelCase: 'only',
                                localIdentName: '[name]__[local]___[hash:base64:5]',
                            },
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: !IS_PRODUCTION,
                                includePaths: [resolve(__dirname, 'src/css')],
                            },
                        },
                    ],
                    allChunks: true,
                }),
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: IS_PRODUCTION,
                                sourceMap: !IS_PRODUCTION,
                            },
                        },
                    ],
                    allChunks: true,
                }),
            },
        ],
    },
};
