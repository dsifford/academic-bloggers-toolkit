var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    browserSync = require('browser-sync').create(),
    webpack = require('webpack-stream');

gulp.task('build', ['webpack', 'sass'], function() {
  gulp.src([
    './academic-bloggers-toolkit.php',
    './CHANGELOG.md',
    './LICENSE',
    './readme.txt',
    './inc/**/*',
    '!./inc/**/*.{ts,js,css,scss,json}'
  ], { base: './' })
  .pipe(gulp.dest('./dist'));
});

gulp.task('sass', function() {
  gulp.src([
    './inc/**/*.scss'
  ], { base: './' })
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer({
    browsers: ['last 2 versions']
  }))
  .pipe(cleanCSS({compatibility: 'ie10'}))
  .pipe(gulp.dest('./dist'))
  .pipe(browserSync.stream());
});

gulp.task('webpack', function() {
  return gulp.src('inc/js/frontend.ts')
    .pipe(webpack( require('./webpack.config.js') ))
    .pipe(gulp.dest('dist/'));
})

gulp.task('serve', ['build'], function() {
  browserSync.init({
    proxy: 'localhost:8080',
    open: false,
  });

  gulp.watch('./inc/**/*.ts', ['webpack']).on('change', browserSync.reload);
  gulp.watch('./inc/**/*.scss', ['sass']);
  gulp.watch([
    './inc/**/*',
    '!./inc/**/*.{ts,scss}'
  ], ['build']).on('change', browserSync.reload);
})
