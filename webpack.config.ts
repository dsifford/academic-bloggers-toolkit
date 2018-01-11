import { TsConfigPathsPlugin } from 'awesome-typescript-loader';
import { execSync } from 'child_process';
import { resolve } from 'path';
import * as webpack from 'webpack';

import * as ExtractTextPlugin from 'extract-text-webpack-plugin';
import * as RollbarSourceMapPlugin from 'rollbar-sourcemap-webpack-plugin';
import * as UglifyJsPlugin from 'uglifyjs-webpack-plugin';

const ENTRYPOINT_DIR = './src/js/_entrypoints';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const IS_DEPLOYING = process.env.IS_DEPLOYING === 'true';
const VERSION = IS_PRODUCTION
    ? execSync('git rev-parse HEAD', { encoding: 'utf8' })
    : '';

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
        .add(new webpack.optimize.OccurrenceOrderPlugin(true))
        .add(new UglifyJsPlugin({ sourceMap: true }));
}

if (IS_DEPLOYING) {
    plugins.add(
        new RollbarSourceMapPlugin({
            accessToken: process.env.ROLLBAR_API_TOKEN,
            version: VERSION,
            publicPath:
                'http://dynamichost/wp-content/plugins/academic-bloggers-toolkit',
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
        'js/frontend': `${ENTRYPOINT_DIR}/frontend`,
        'js/options-page': `${ENTRYPOINT_DIR}/options-page`,
        'js/reference-list': [
            'custom-event-polyfill',
            'proxy-polyfill',
            'whatwg-fetch',
            `${ENTRYPOINT_DIR}/reference-list`,
        ],
        'js/drivers/tinymce': './src/js/drivers/tinymce',
        'workers/locale-worker': './src/workers/locale-worker',
    },
    output: {
        path: resolve(__dirname, 'dist'),
        filename: '[name].js',
    },
    resolve: {
        alias: {
            css: resolve(__dirname, 'src/css'),
        },
        extensions: ['*', '.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
        modules: [resolve(__dirname, 'src'), 'node_modules'],
        plugins: [new TsConfigPathsPlugin()],
    },
    plugins: [...plugins],
    stats: {
        children: IS_PRODUCTION,
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
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
                            instance: 'at-worker-loader',
                        },
                    },
                ],
            },
            {
                test: /\.tsx?$/,
                exclude: [
                    /(?:__tests__|node_modules)/,
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
                                localIdentName:
                                    '[name]__[local]___[hash:base64:5]',
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
