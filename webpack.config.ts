import path from 'path';

import { CheckerPlugin, TsConfigPathsPlugin } from 'awesome-typescript-loader';
import BrowserSyncPlugin from 'browser-sync-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import rimraf from 'rimraf';
import { Configuration, Plugin } from 'webpack';

import { version as VERSION } from './package.json';

export default (_: never, argv: any): Configuration => {
    const IS_PRODUCTION = argv.mode === 'production';

    // Clean out dist directory
    rimraf.sync(path.join(__dirname, 'dist', '*'));

    const plugins = new Set<Plugin>([
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
            new BrowserSyncPlugin({
                proxy: 'localhost:8080',
                open: false,
                reloadDebounce: 2000,
                port: 3005,
                notify: false,
            }),
        );
    }

    const TS_BASE_CONFIG = {
        silent: argv.json,
        useCache: !IS_PRODUCTION,
        cacheDirectory: path.resolve(
            __dirname,
            'node_modules/.cache/awesome-typescript-loader',
        ),
        reportFiles: ['**/*.{ts,tsx}', '!**/__tests__/**'],
    };

    return {
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
            '@wordpress/dom-ready': 'wp.domReady',
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
             * Legacy
             */
            'bundle/frontend-legacy': 'js/_legacy/_entrypoints/frontend',
            'bundle/options-page': 'js/_legacy/_entrypoints/options-page',
            'bundle/editor-legacy': [
                'custom-event-polyfill',
                'proxy-polyfill',
                'js/_legacy/_entrypoints/reference-list',
            ],
            'bundle/drivers/tinymce': 'js/_legacy/drivers/tinymce',
            'bundle/workers/locale-worker': 'js/_legacy/workers/locale-worker',

            /**
             * New hotness
             */
            'bundle/editor': 'js/gutenberg',
            'bundle/editor-blocks': 'js/gutenberg/blocks',
            'bundle/editor-formats': 'js/gutenberg/formats',
            'bundle/editor-stores': 'js/stores',
            'bundle/frontend': 'js/frontend',
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
        stats: IS_PRODUCTION ? 'normal' : 'minimal',
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    sideEffects: false,
                    rules: [
                        {
                            loader: 'babel-loader',
                        },
                        {
                            oneOf: [
                                {
                                    include: path.resolve(
                                        __dirname,
                                        'src/js/_legacy/workers',
                                    ),
                                    use: [
                                        {
                                            loader: 'awesome-typescript-loader',
                                            options: {
                                                ...TS_BASE_CONFIG,
                                                configFileName: path.resolve(
                                                    __dirname,
                                                    'src/js/_legacy/workers/tsconfig.json',
                                                ),
                                                instance: 'workers',
                                            },
                                        },
                                    ],
                                },
                                {
                                    use: [
                                        {
                                            loader: 'awesome-typescript-loader',
                                            options: {
                                                ...TS_BASE_CONFIG,
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    test: /\.scss$/,
                    rules: [
                        {
                            use: [MiniCssExtractPlugin.loader],
                        },
                        {
                            oneOf: [
                                {
                                    resourceQuery: /global/,
                                    use: [
                                        {
                                            loader: 'css-loader',
                                            options: {
                                                importLoaders: 2,
                                                modules: false,
                                            },
                                        },
                                    ],
                                },
                                {
                                    use: [
                                        {
                                            loader: 'css-loader',
                                            options: {
                                                importLoaders: 2,
                                                modules: true,
                                                camelCase: 'only',
                                                localIdentName:
                                                    '[name]__[local]___[hash:base64:5]',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            use: [
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
                    ],
                },
            ],
        },
    };
};
