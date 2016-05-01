/* eslint-env node, es6 */
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const del = require('del');
const postcss = require('gulp-postcss');
const sugarss = require('sugarss');
const rename  = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const webpack = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');
const webpackDevConfig = Object.assign({}, webpackConfig, {
    devtool: 'source-map',
    cache: true,
});

gulp.task('clean', (done) => del(['dist/lib/**/*',], done) );

gulp.task('css', () => {

    const processors = [
        require('precss'),
        require('autoprefixer')({ browsers: ['last 2 versions'] }),
        require('cssnano')(),
    ];

    return gulp.src([
        'lib/**/*.sss',
    ], { base: './', })
    .pipe(sourcemaps.init())
    .pipe(postcss(processors, { parser: sugarss }))
    .pipe(rename({ extname: '.css' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());

});

gulp.task('static', () =>
    gulp.src([
        'academic-bloggers-toolkit.php',
        'CHANGELOG.md',
        'LICENSE',
        'readme.txt',
        'lib/**/*',
        'vendor/*',
        '!lib/**/*.{ts,tsx,sss,json}',
        '!**/__tests__',
        '!lib/js/utils',
    ], { base: './', })
    .pipe(gulp.dest('./dist'))
);

gulp.task('webpack:dev', () =>
    gulp.src('lib/js/Frontend.ts')
    .pipe(webpack(webpackDevConfig))
    .pipe(gulp.dest('dist/'))
);

gulp.task('webpack:prod', () =>
    gulp.src('lib/js/Frontend.ts')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('dist/'))
);

gulp.task('js', () =>
    gulp.src([
        'dist/**/*.js',
        'dist/vendor/**/*.js',
    ])
    .pipe(uglify({
        compress: {
            'dead_code': true,
            'unused': true,
            'drop_debugger': true,
            'drop_console': true,
        }
    }))
    .pipe(gulp.dest('./dist/'))
);

gulp.task('reload', (done) => {
    browserSync.reload();
    done();
});

gulp.task('build',
    gulp.series('clean', gulp.parallel('css', 'static', 'webpack:prod'), 'js')
);

gulp.task('default', gulp.series('clean', gulp.parallel('static', 'css', 'webpack:dev'), () => {
    browserSync.init({
        proxy: 'localhost:8080',
        open: false,
    });

    gulp.watch('./lib/**/*.sss', gulp.series('css'));

    gulp.watch([
        'lib/**/*.{ts,tsx}',
        '!lib/**/__tests__/',
        '!lib/**/__tests__/*',
    ], gulp.series('webpack:dev', 'reload'));

    gulp.watch([
        'academic-bloggers-toolkit.php',
        'lib/**/*',
        '!lib/**/*.{ts,tsx,sss}',
        '!lib/**/__tests__/',
        '!lib/**/__tests__/*',
    ], gulp.series('static', 'reload'));

}));
