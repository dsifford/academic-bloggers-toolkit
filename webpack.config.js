const path = require('path');
const webpack = require('webpack');

console.log(process.env.NODE_ENV);

module.exports = {
    devtool: process.env.NODE_ENV === 'production' ? 'hidden-source-map' : 'eval-source-map',
    entry: {
        'lib/js/Frontend': './src/lib/js/Frontend.ts',
        'lib/js/tinymce/index': './src/lib/js/tinymce/index.ts',
        'lib/js/reference-list/index': './src/lib/js/reference-list/',
        'lib/js/tinymce/components/reference-window/index': './src/lib/js/tinymce/components/reference-window/',
        'lib/js/tinymce/components/pubmed-window/index': './src/lib/js/tinymce/components/pubmed-window/',
        'lib/js/tinymce/components/import-window/index': './src/lib/js/tinymce/components/import-window/',
        'vendor': ['react', 'mobx', 'mobx-react'],
    },
    output: {
        filename: '[name].js',
    },
    resolve: {
        modules: [path.resolve(__dirname, "src"), "node_modules"],
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
        mainFiles: ['index'],
        descriptionFiles: ['package.json'],
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: Infinity,
            filename: 'vendor/vendor.bundle.js'
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false,
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            output: {
                comments: false,
            },
            sourceMap: false,
        }),
    ],
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                include: path.resolve(__dirname, 'src'),
                loaders: [
                    {
                        loader: 'babel',
                        query: {
                            presets: [
                                ['es2015', { modules: false }],
                                'react',
                            ]
                        },
                    },
                    'ts',
                ],
            },
            {
                test: /\.css$/,
                loaders: ['style', 'css'],
            },
        ],
    },
};
