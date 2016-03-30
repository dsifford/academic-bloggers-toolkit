var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    browserSync = require('browser-sync').create(),
    webpack = require('webpack-stream');

gulp.task('build', ['webpack', 'js', 'scss'], function() {
  gulp.src([
    './academic-bloggers-toolkit.php',
    './CHANGELOG.md',
    './LICENSE',
    './readme.txt',
    './inc/**/*',
    '!./inc/**/*.{ts,js,css,scss}'
  ], { base: './' })
  .pipe(gulp.dest('./dist'));
});


gulp.task('js', function() {
  gulp.src([
    './dist/inc/**/*.js'
  ], { base: './' })
  .pipe(uglify())
  .pipe(gulp.dest('./'));
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

// gulp.task('css', function() {
//   gulp.src([
//     './inc/**/*.css'
//   ], { base: './' })
//   .pipe(autoprefixer({
//     browsers: ['last 2 versions']
//   }))
//   .pipe(cleanCSS({compatibility: 'ie10'}))
//   .pipe(gulp.dest('./dist'))
// });

gulp.task('serve', ['sass'], function() {
  browserSync.init({
    proxy: 'localhost:8080'
  });

  gulp.watch('./inc/**/*.scss', ['sass']);
  gulp.watch([
    './inc/**/*',
    '!./inc/**/*.{ts,css}',
  ]).on('change', browserSync.reload);

});

gulp.task('webpack', function() {
  return gulp.src('./inc/js/tinymce-views/inline-citation/inline-citation.ts')
    .pipe(webpack( require('./webpack.config.js') ))
    .pipe(gulp.dest('./dist'));
})
