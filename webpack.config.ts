import { TsConfigPathsPlugin } from 'awesome-typescript-loader';
import { execSync } from 'child_process';
import { resolve } from 'path';
import * as RollbarSourceMapPlugin from 'rollbar-sourcemap-webpack-plugin';
import * as webpack from 'webpack';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

let VERSION = '';

if (IS_PRODUCTION) {
    try {
        VERSION = execSync('git rev-parse HEAD', {
            cwd: __dirname,
            encoding: 'utf8',
        });
    } catch (err) {
        console.log('Error getting revision', err); // tslint:disable-line no-console
        process.exit(1);
    }
}

const sharedPlugins: webpack.Plugin[] = [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'process.env.ROLLBAR_TOKEN': JSON.stringify(process.env.ROLLBAR_CLIENT_TOKEN),
        'process.env.COMMIT_HASH': JSON.stringify(VERSION),
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //     name: 'js/worker',
    //     minChunks: Infinity,
    // }),
    // new webpack.optimize.CommonsChunkPlugin({
    //     name: 'js/vendor',
    //     filename: 'vendor/vendor.bundle.js',
    //     minChunks: Infinity,
    // }),
];

const devPlugins: webpack.Plugin[] = [...sharedPlugins];

const productionPlugins = [
    ...sharedPlugins,
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(true),
    new RollbarSourceMapPlugin({
        accessToken: process.env.ROLLBAR_API_TOKEN,
        version: VERSION,
        publicPath: 'http://dynamichost/wp-content/plugins/academic-bloggers-toolkit',
    }),
];

const config: webpack.Configuration = {
    watch: !IS_PRODUCTION,
    watchOptions: {
        ignored: /(node_modules|gulpfile|dist|lib|webpack.config)/,
    },
    devtool: 'source-map',
    entry: {
        'js/worker': ['babel-polyfill', './src/js/worker/worker'],
        'js/frontend': ['babel-polyfill', './src/js/frontend'],
        'js/reference-list/index': [
            'babel-polyfill',
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
    plugins: IS_PRODUCTION ? productionPlugins : devPlugins,
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
                        },
                    },
                ],
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
};

export default config;
