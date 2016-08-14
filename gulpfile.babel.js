import autoprefixer from 'autoprefixer';
import del from 'del';
import { exec } from 'child_process';
import gfi from 'gulp-file-insert';
import gulp from 'gulp';
import jade from 'gulp-jade2php';
import merge from 'merge-stream';
import poststylus from 'poststylus';
import rename from 'gulp-rename';
import replace from 'gulp-replace';
import sort from 'gulp-sort';
import sourcemaps from 'gulp-sourcemaps';
import stylus from 'gulp-stylus';
import uglify from 'gulp-uglify';
import wpPot from 'gulp-wp-pot';
import webpack from 'webpack-stream';

import webpackConfig from './webpack.config.js';
import { version as VERSION } from './package.json';

const browserSync = require('browser-sync').create();

const webpackDevConfig = Object.assign({}, webpackConfig, {
    devtool: 'eval',
    cache: false,
});

// ==================================================
//                 Utility Tasks
// ==================================================

gulp.task('reload', (done) => { browserSync.reload(); done();});

// Delete all files in dist/lib
gulp.task('clean', (done) => del(['dist/**/*'], done));

gulp.task('chown', (done) => {
    exec("ls -l dist/ | awk '{print $3}' | tail -n -1", (err, stdout, stderr) => {
        if (stdout.trim() === process.env.USER) {
            return done();
        }
        exec(`sudo chown -R ${process.env.USER} dist/`, (err, stdout, stderr) => {
            done();
        });
    });
});

// Version bump the required files according to the version in package.json
gulp.task('bump', () =>
    gulp.src([
        'src/academic-bloggers-toolkit.php',
        'src/readme.txt',
    ], { base: './src' })
    .pipe(replace(/Version: [\d\.]+/, `Version: ${VERSION}`))
    .pipe(replace(/Stable tag: .+/, `Stable tag: ${VERSION}`))
    .pipe(replace(/\$ABT_VERSION = '.+?';/, `$ABT_VERSION = '${VERSION}';`))
    .pipe(gulp.dest('./src'))
);

// Translations
gulp.task('pot', () =>
    gulp
        .src([
            'src/academic-bloggers-toolkit.php',
            'src/lib/**/*.php',
            'dist/lib/php/options-page.php',
        ])
        .pipe(sort())
        .pipe(wpPot({
            domain: 'academic-bloggers-toolkit',
            package: `Academic Blogger's Toolkit ${VERSION}`,
            bugReport: 'https://github.com/dsifford/academic-bloggers-toolkit/issues',
            lastTranslator: 'Derek P Sifford <dereksifford@gmail.com>',
            team: 'Derek P Sifford <dereksifford@gmail.com>',
            headers: false,
        }))
        .pipe(gulp.dest('./src'))
);

// ==================================================
//              PHP/Static Asset Tasks
// ==================================================

gulp.task('jade', () =>
    gulp.src('src/lib/php/*.jade', { base: 'src/lib/php' })
    .pipe(jade({
        omitPhpRuntime: true,
        omitPhpExtractor: true,
        arraysOnly: false,
    }))
    .pipe(rename({ extname: '.php' }))
    .pipe(gulp.dest('tmp'))
);


gulp.task('php', gulp.series('jade', () =>
    gulp.src('src/lib/php/options-page.php', { base: './src' })
    .pipe(gfi({
        '<!-- JADE -->': 'tmp/options-page.php',
    }))
    .pipe(gulp.dest('./dist'))
));


gulp.task('static', () => {
    const main = gulp
        .src('src/**/*.{js,php,po,pot,mo,html,txt}', { base: './src' })
        .pipe(gulp.dest('./dist'));
    const misc = gulp
        .src(['LICENSE', 'CHANGELOG.md'])
        .pipe(gulp.dest('./dist'));
    return merge(main, misc);
});


// ==================================================
//                 Style Tasks
// ==================================================

gulp.task('stylus:dev', () =>
    gulp
        .src('src/**/*.styl', { base: './src' })
        .pipe(sourcemaps.init())
        .pipe(stylus({
            use: [poststylus([autoprefixer({ browsers: ['last 2 versions'] })])],
            compress: false,
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream({ match: '**/*.css' }))
);

gulp.task('stylus:prod', () =>
    gulp
        .src(['src/**/*.styl', '!src/lib/css/collections/*'], { base: './src' })
        .pipe(stylus({
            use: [poststylus([autoprefixer({ browsers: ['last 2 versions'] })])],
            compress: true,
        }))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream({ match: '**/*.css' }))
);


// ==================================================
//                 Javascript Tasks
// ==================================================

gulp.task('webpack:dev', () =>
    gulp
        .src('src/lib/js/Frontend.ts')
        .pipe(webpack(webpackDevConfig))
        .pipe(gulp.dest('dist/'))
);


gulp.task('webpack:prod', () =>
    gulp
        .src('src/lib/js/Frontend.ts')
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest('dist/'))
);

gulp.task('js', () =>
    gulp
        .src('dist/**/*.js', { base: 'dist' })
        .pipe(uglify({
            compress: {
                dead_code: true,
                unused: true,
                drop_debugger: true,
                drop_console: true,
            },
        }))
        .pipe(gulp.dest('dist'))
);


// ==================================================
//                 Compound Tasks
// ==================================================

gulp.task('build',
    gulp.series(
        'clean', 'bump',
        gulp.parallel('stylus:prod', 'static', 'webpack:prod'),
        gulp.parallel('js', 'php'),
        'pot'
    )
);


gulp.task('default',
    gulp.series(
        'chown', 'clean', 'static',
        gulp.parallel('php', 'stylus:dev', 'webpack:dev'), () => {
            browserSync.init({
                proxy: 'localhost:8080',
                open: false,
            });

            gulp.watch('src/lib/**/*.styl', gulp.series('stylus:dev'));

            gulp.watch([
                'src/lib/**/*.{ts,tsx}',
                '!src/lib/**/__tests__/',
                '!src/lib/**/__tests__/*',
            ], gulp.series('webpack:dev', 'reload'));

            gulp.watch([
                'src/**/*',
                '!src/**/*.{ts,tsx,styl}',
                '!src/**/__tests__/',
                '!src/**/__tests__/*',
            ], gulp.series('static', 'php', 'reload'));
        }
    )
);
