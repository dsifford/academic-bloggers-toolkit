// tslint:disable:no-var-requires
import { CheckerPlugin, TsConfigPathsPlugin } from 'awesome-typescript-loader';
import { execSync } from 'child_process';
import { resolve } from 'path';
import webpack from 'webpack';

import CopyWebpackPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
const RollbarSourceMapPlugin = require('rollbar-sourcemap-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const ENTRYPOINT_DIR = 'js/_entrypoints';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const IS_DEPLOYING = process.env.IS_DEPLOYING === 'true';
const VERSION = require('./package.json').version;
const COMMIT_HASH = IS_PRODUCTION
    ? execSync('git rev-parse HEAD', { encoding: 'utf8' })
    : '';

// Clean out dist directory
execSync(`rm -rf ${__dirname}/dist/*`);

const plugins = new Set<webpack.Plugin>([
    new webpack.EnvironmentPlugin({
        NODE_ENV: 'development',
        ROLLBAR_CLIENT_TOKEN: '',
        COMMIT_HASH,
    }),
    new MiniCssExtractPlugin(),
    new CopyWebpackPlugin([
        {
            from: '**/*.{php,mo}',
            ignore: ['academic-bloggers-toolkit.php'],
        },
        {
            from: 'vendor/*',
        },
        {
            from: resolve(__dirname, 'LICENSE'),
        },
        {
            from: '@(readme.txt|academic-bloggers-toolkit.php)',
            transform(content): string {
                return content.toString().replace(/{{VERSION}}/g, VERSION);
            },
        },
    ]),
    new CheckerPlugin(),
]);

if (!IS_PRODUCTION) {
    plugins.add(
        new BrowserSyncPlugin(
            {
                proxy: 'localhost:8080',
                open: false,
                reloadDebounce: 2000,
                port: 3005,
                notify: false,
            },

            {
                injectCss: true,
            },
        ),
    );
}

if (IS_DEPLOYING) {
    plugins.add(
        new RollbarSourceMapPlugin({
            accessToken: process.env.ROLLBAR_API_TOKEN,
            version: COMMIT_HASH,
            publicPath:
                'http://dynamichost/wp-content/plugins/academic-bloggers-toolkit',
        }),
    );
}

const config: webpack.Configuration = {
    mode: IS_PRODUCTION ? 'production' : 'development',
    watch: !IS_PRODUCTION,
    devtool: IS_PRODUCTION ? 'source-map' : 'cheap-module-eval-source-map',
    watchOptions: {
        ignored: /(node_modules|dist|lib|webpack.config)/,
    },
    context: resolve(__dirname, 'src'),
    entry: {
        /**
         * JS Entrypoints
         */
        'js/frontend': `${ENTRYPOINT_DIR}/frontend`,
        'js/options-page': `${ENTRYPOINT_DIR}/options-page`,
        'js/reference-list': [
            'custom-event-polyfill',
            'proxy-polyfill',
            'whatwg-fetch',
            `${ENTRYPOINT_DIR}/reference-list`,
        ],
        'js/drivers/tinymce': 'js/drivers/tinymce',
        'workers/locale-worker': 'workers/locale-worker',

        /**
         * Stylesheet entrypoints
         */
        'css/frontend': 'css/_entrypoints/frontend',
    },
    output: {
        filename: '[name].js',
        path: resolve(__dirname, 'dist'),
    },
    resolve: {
        alias: {
            css: resolve(__dirname, 'src/css'),
        },
        modules: [resolve(__dirname, 'src'), 'node_modules'],
        extensions: ['*', '.ts', '.tsx', '.js', '.scss'],
        plugins: [new TsConfigPathsPlugin()],
    },
    plugins: [...plugins],
    stats: IS_PRODUCTION ? 'verbose' : 'minimal',
    module: {
        rules: [
            {
                test: /\.ts$/,
                sideEffects: false,
                include: resolve(__dirname, 'src/workers'),
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
                            configFileName: resolve(
                                __dirname,
                                'src/workers/tsconfig.json',
                            ),
                            instance: 'workers',
                        },
                    },
                ],
            },
            {
                test: /\.tsx?$/,
                sideEffects: false,
                exclude: [
                    /__tests__/,
                    /node_modules/,
                    resolve(__dirname, 'src/workers'),
                ],
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
                            reportFiles: [
                                '**/*.{ts,tsx}',
                                '!(src/**/__tests__/**|src/workers/**)',
                            ],
                        },
                    },
                ],
            },
            {
                test: /\.scss$/,
                oneOf: [
                    {
                        resourceQuery: /global/,
                        use: [
                            MiniCssExtractPlugin.loader,
                            {
                                loader: 'css-loader',
                                options: {
                                    importLoaders: 1,
                                    modules: false,
                                    minimize: IS_PRODUCTION,
                                    sourceMap: !IS_PRODUCTION,
                                },
                            },
                            {
                                loader: 'sass-loader',
                                options: {
                                    sourceMap: !IS_PRODUCTION,
                                    outputStyle: IS_PRODUCTION
                                        ? 'compressed'
                                        : 'expanded',
                                    includePaths: ['src/css'],
                                },
                            },
                        ],
                    },
                    {
                        use: [
                            MiniCssExtractPlugin.loader,
                            {
                                loader: 'css-loader',
                                options: {
                                    importLoaders: 1,
                                    modules: true,
                                    minimize: IS_PRODUCTION,
                                    sourceMap: !IS_PRODUCTION,
                                    camelCase: 'only',
                                    localIdentName:
                                        '[name]__[local]___[hash:base64:5]',
                                },
                            },
                            {
                                loader: 'sass-loader',
                                options: {
                                    sourceMap: !IS_PRODUCTION,
                                    outputStyle: IS_PRODUCTION
                                        ? 'compressed'
                                        : 'expanded',
                                    includePaths: ['src/css'],
                                },
                            },
                        ],
                    },
                ],
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            minimize: IS_PRODUCTION,
                            sourceMap: !IS_PRODUCTION,
                        },
                    },
                ],
            },
        ],
    },
};

export default config;
