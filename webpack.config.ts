import { execSync } from 'child_process';
import path from 'path';

import { CheckerPlugin, TsConfigPathsPlugin } from 'awesome-typescript-loader';
import BrowserSyncPlugin from 'browser-sync-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import RollbarSourceMapPlugin from 'rollbar-sourcemap-webpack-plugin';
import webpack from 'webpack';
import { version as VERSION } from './package.json';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const IS_DEPLOYING = process.env.IS_DEPLOYING === 'true';
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
            from: path.resolve(__dirname, 'LICENSE'),
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
        ignored: /(node_modules|__tests__)/,
    },
    context: path.resolve(__dirname, 'src'),
    externals: {
        '@wordpress/api-fetch': 'wp.apiFetch',
        '@wordpress/blocks': 'wp.blocks',
        '@wordpress/components': 'wp.components',
        '@wordpress/compose': 'wp.compose',
        '@wordpress/data': 'wp.data',
        '@wordpress/edit-post': 'wp.editPost',
        '@wordpress/editor': 'wp.editor',
        '@wordpress/element': 'wp.element',
        '@wordpress/i18n': 'wp.i18n',
        '@wordpress/keycodes': 'wp.keycodes',
        '@wordpress/plugins': 'wp.plugins',
        '@wordpress/rich-text': 'wp.richText',
        '@wordpress/url': 'wp.url',
        citeproc: 'CSL',
        lodash: 'lodash',
    },
    entry: {
        /**
         * JS Entrypoints
         */
        'bundle/frontend': 'js/_legacy/_entrypoints/frontend',
        'bundle/options-page': 'js/_legacy/_entrypoints/options-page',
        'bundle/reference-list': [
            'custom-event-polyfill',
            'proxy-polyfill',
            'whatwg-fetch',
            'js/_legacy/_entrypoints/reference-list',
        ],
        'bundle/drivers/tinymce': 'js/_legacy/drivers/tinymce',
        'bundle/workers/locale-worker': 'workers/locale-worker',

        /**
         * New hotness
         */
        'bundle/editor': 'js/editor',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        alias: {
            css: path.resolve(__dirname, 'src/css'),
        },
        modules: [path.resolve(__dirname, 'src'), 'node_modules'],
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
                include: path.resolve(__dirname, 'src/workers'),
                use: [
                    {
                        loader: 'awesome-typescript-loader',
                        options: {
                            silent: process.argv.indexOf('--json') !== -1,
                            useBabel: true,
                            useCache: !IS_PRODUCTION,
                            cacheDirectory: path.resolve(
                                __dirname,
                                'node_modules/.cache/awesome-typescript-loader',
                            ),
                            babelCore: '@babel/core',
                            configFileName: path.resolve(
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
                    path.resolve(__dirname, 'src/workers'),
                ],
                use: [
                    {
                        loader: 'awesome-typescript-loader',
                        options: {
                            silent: process.argv.indexOf('--json') !== -1,
                            useBabel: true,
                            useCache: !IS_PRODUCTION,
                            cacheDirectory: path.resolve(
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
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,
                            modules: true,
                            camelCase: 'only',
                            localIdentName: '[name]__[local]___[hash:base64:5]',
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: [
                                require('postcss-preset-env')(),
                                ...(IS_PRODUCTION
                                    ? [require('cssnano')()]
                                    : []),
                            ],
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            includePaths: ['src/css'],
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                    },
                ],
            },
        ],
    },
};

export default config;
