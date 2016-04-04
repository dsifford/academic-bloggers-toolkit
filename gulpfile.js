var gulp         = require('gulp');
var uglify       = require('gulp-uglify');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS     = require('gulp-clean-css');
var browserSync  = require('browser-sync').create();
var webpack      = require('webpack-stream');
var del          = require('del');

// TODO: Better minifyer for js (one that doesn't break)

gulp.task('clean', function () {
  return del([
    'dist/inc/**/*',
  ]);
});

gulp.task('build', ['clean', 'webpack', 'sass'], function () {
  gulp.src([
    './academic-bloggers-toolkit.php',
    './CHANGELOG.md',
    './LICENSE',
    './readme.txt',
    './inc/**/*',
    '!./inc/**/*.{ts,js,css,scss,json}',
  ], { base: './' })
  .pipe(gulp.dest('./dist'));
});

gulp.task('sass', function () {
  gulp.src([
    './inc/**/*.scss',
  ], { base: './' })
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer({
    browsers: ['last 2 versions'],
  }))
  .pipe(cleanCSS({ compatibility: 'ie10' }))
  .pipe(gulp.dest('./dist'))
  .pipe(browserSync.stream());
});

gulp.task('webpack', function () {
  return gulp.src('inc/js/frontend.ts')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('dist/'));
});

gulp.task('serve', ['build'], function () {
  browserSync.init({
    proxy: 'localhost:8080',
    open: false,
  });

  gulp.watch(['./inc/**/*.tsx?'], ['webpack']).on('change', browserSync.reload);
  gulp.watch('./inc/**/*.scss', ['sass']);
  gulp.watch([
    './inc/**/*',
    '!./inc/**/*.{tsx?,scss}',
  ], ['build']).on('change', browserSync.reload);
});
