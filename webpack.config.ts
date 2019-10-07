/* eslint-disable @typescript-eslint/no-var-requires */
import { promises as fs } from 'fs';
import path from 'path';
import { promisify } from 'util';

import DependencyExtractionPlugin from '@wordpress/dependency-extraction-webpack-plugin';
import { CheckerPlugin, TsConfigPathsPlugin } from 'awesome-typescript-loader';
import BrowserSyncPlugin from 'browser-sync-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import rimrafLib from 'rimraf';
import { rollup } from 'rollup';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import { Configuration, Plugin, ProgressPlugin } from 'webpack';

import { version as VERSION } from './package.json';

const rimraf = promisify(rimrafLib);

// eslint-disable-next-line
export default async (_: any, argv: any): Promise<Configuration> => {
    const IS_PRODUCTION = argv.mode === 'production';
    const CHANGELOG = await getMostRecentChangelogEntry();

    // Clean out dist directory
    await rimraf(path.join(__dirname, 'dist', '*'));

    await Promise.all([
        rollup({
            input: 'citeproc',
            plugins: IS_PRODUCTION
                ? [resolve(), commonjs(), terser()]
                : [resolve(), commonjs()],
        }),
    ]).then(async ([citeproc]) =>
        Promise.all([
            citeproc.write({
                file: 'dist/vendor/citeproc.js',
                format: 'iife',
                name: 'CSL',
            }),
        ]),
    );

    const plugins = new Set<Plugin>([
        new DependencyExtractionPlugin({
            injectPolyfill: true,
            requestToExternal(request) {
                if (request === 'citeproc') {
                    return 'CSL';
                }
                return;
            },
        }),
        new MiniCssExtractPlugin(),
        new CopyWebpackPlugin([
            {
                from: '**/*.{php,mo,pot}',
                ignore: ['academic-bloggers-toolkit.php'],
            },
            {
                from: '*.json',
                transform(content) {
                    return JSON.stringify(JSON.parse(content.toString()));
                },
            },
            {
                from: path.resolve(__dirname, 'LICENSE'),
            },
            {
                from: 'academic-bloggers-toolkit.php',
                transform(content) {
                    return content.toString().replace(/{{VERSION}}/g, VERSION);
                },
            },
            {
                from: 'readme.txt',
                transform(content) {
                    return content
                        .toString()
                        .replace(/{{VERSION}}/g, VERSION)
                        .replace(/{{CHANGELOG}}/g, CHANGELOG);
                },
            },
        ]),
        new CheckerPlugin(),
    ]);

    if (IS_PRODUCTION) {
        plugins.add(new ProgressPlugin());
    } else {
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
        devtool: IS_PRODUCTION ? 'source-map' : 'cheap-module-eval-source-map',
        watchOptions: {
            ignored: /(node_modules|__tests__)/,
        },
        context: path.resolve(__dirname, 'src'),
        entry: {
            'bundle/editor': 'js/gutenberg',
            'bundle/editor-blocks': 'js/gutenberg/blocks',
            'bundle/editor-formats': 'js/gutenberg/formats',
            'bundle/editor-stores': 'js/stores',
            'bundle/frontend': 'js/frontend',
            'bundle/options-page': 'js/options-page',
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
        stats: IS_PRODUCTION ? 'errors-warnings' : 'minimal',
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
                                                modules: {
                                                    localIdentName:
                                                        '[name]__[local]___[hash:base64:5]',
                                                },
                                                localsConvention:
                                                    'camelCaseOnly',
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
                                        sassOptions: {
                                            includePaths: ['src/css'],
                                        },
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

function getMostRecentChangelogEntry(): Promise<string> {
    return fs
        .readFile(path.join(__dirname, 'CHANGELOG.md'), { encoding: 'utf-8' })
        .then(contents => {
            const entry = /(^## .*?)\n^## /ms.exec(contents);
            if (!entry || !entry[1]) {
                throw new Error('Error parsing last changelog entry');
            }
            return entry[1];
        })
        .then(entry =>
            entry.replace(/^## (\S+)/, '= $1 =').replace(/^-/gm, '*'),
        );
}
