var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    browserSync = require('browser-sync').create();

gulp.task('build', ['js', 'css'], function() {
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
    './inc/**/*.js'
  ], { base: './' })
  .pipe(uglify())
  .pipe(gulp.dest('./dist'));
});

gulp.task('sass', function() {
  gulp.src([
    './inc/**/*.scss'
  ], { base: './' })
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest('./'))
  .pipe(browserSync.stream());
});

gulp.task('css', function() {
  gulp.src([
    './inc/**/*.css'
  ], { base: './' })
  .pipe(autoprefixer({
    browsers: ['last 2 versions']
  }))
  .pipe(cleanCSS({compatibility: 'ie10'}))
  .pipe(gulp.dest('./dist'))
});

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
