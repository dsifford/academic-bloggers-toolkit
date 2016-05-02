/* eslint-env node, es6 */
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const del = require('del');
const jade = require('gulp-jade2php');
const gfi = require("gulp-file-insert");
const postcss = require('gulp-postcss');
const sugarss = require('sugarss');
const rename  = require('gulp-rename');
const replace = require('gulp-replace');
const sourcemaps = require('gulp-sourcemaps');
const webpack = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');
const webpackDevConfig = Object.assign({}, webpackConfig, {
    devtool: 'source-map',
    cache: true,
});


// ==================================================
//                 Utility Tasks
// ==================================================

// Delete all files in dist/lib
gulp.task('clean', (done) => del(['dist/lib/**/*',], done) );

// Trigger a browsersync reload
gulp.task('reload', (done) => {
    browserSync.reload();
    done();
});

// Version bump the required files according to the version in package.json
gulp.task('bump', () => {
    const version = require('./package.json').version;
    return gulp.src([
        'academic-bloggers-toolkit.php',
        'readme.txt',
    ])
    .pipe(replace(/Version: [\d\.]+/, `Version: ${version}`))
    .pipe(replace(/Stable tag: [\d\.]+/, `Stable tag: ${version}`))
    .pipe(gulp.dest('./'));
});


// ==================================================
//              PHP/Static Asset Tasks
// ==================================================

gulp.task('jade', () =>
    gulp.src('lib/**/*.jade')
    .pipe(jade({
        omitPhpRuntime: true,
        omitPhpExtractor: true,
        arraysOnly: false,
    }))
    .pipe(rename({ extname: '.php' }))
    .pipe(gulp.dest('tmp'))
);


gulp.task('php', gulp.series('jade', () =>
    gulp.src('lib/options-page.php', { base: './', })
    .pipe(gfi({
        '<!-- JADE -->': 'tmp/options-page.php',
    }))
    .pipe(gulp.dest('./dist'))
));


gulp.task('static', gulp.parallel('php', () =>
    gulp.src([
        'academic-bloggers-toolkit.php',
        'CHANGELOG.md',
        'LICENSE',
        'readme.txt',
        'lib/**/*',
        'vendor/*',
        '!lib/**/*.{ts,tsx,sss,json,jade}',
        '!**/__tests__',
        '!lib/js/utils',
    ], { base: './', })
    .pipe(gulp.dest('./dist'))
));


// ==================================================
//                 Style Tasks
// ==================================================

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


// ==================================================
//                 Javascript Tasks
// ==================================================

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


// ==================================================
//                 Compound Tasks
// ==================================================

gulp.task('build',
    gulp.series('clean', 'bump', gulp.parallel('css', 'static', 'webpack:prod'), 'js')
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
