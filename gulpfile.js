var gulp = require('gulp');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var browserSync = require('browser-sync').create();
var webpack = require('webpack-stream');
var del = require('del');
var coveralls = require('gulp-coveralls');

gulp.task('clean', function () {
  return del([
    'dist/inc/**/*',
  ]);
});

gulp.task('sass', function () {
  return gulp.src(['./inc/**/*.scss'], {
      base: './',
    })
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
    }))
    .pipe(cleanCSS({
      compatibility: 'ie10',
    }))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());
});

gulp.task('webpack', function () {
  return gulp.src('inc/js/frontend.ts')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('dist/'));
});

gulp.task('build', ['clean', 'webpack', 'sass'], function () {
  gulp.src([
      './academic-bloggers-toolkit.php',
      './CHANGELOG.md',
      './LICENSE',
      './readme.txt',
      './inc/**/*',
      './vendor/*',
      '!./inc/**/*.{ts,tsx,css,scss,json}',
      '!./**/__tests__',
      '!./inc/js/utils',
    ], {
      base: './',
    })
    .pipe(gulp.dest('./dist'));
});

gulp.task('serve', ['build'], function () {
  browserSync.init({
    proxy: 'localhost:8080',
    open: false,
  });

  gulp.watch(['./inc/**/*.{ts,tsx}', '!./inc/**/*-test.{ts,tsx}'], ['webpack']).on('change', browserSync.reload);
  gulp.watch('./inc/**/*.scss', ['sass']);
  gulp.watch([
    './inc/**/*',
    '!./inc/**/*.{ts,tsx,scss}',
    '!__tests__/**/*',
    '!./inc/**/*-test.{ts,tsx}',
  ], ['build']).on('change', browserSync.reload);
});

gulp.task('remove-mapfiles', function (cb) {
  del(['./dist/**/*.map']);
  cb();
});

gulp.task('minify-js', ['remove-mapfiles'], function () {
  gulp.src([
      './dist/**/*.js',
      './dist/vendor/**/*.js',
    ])
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'));
});

gulp.task('deploy', ['remove-mapfiles', 'minify-js']);

// TODO: Build this into travis pipeline
gulp.task('coveralls', function () {
  gulp.src('./coverage/**/lcov.info')
    .pipe(coveralls());
});
