import autoprefixer from 'autoprefixer';
import del from 'del';
import { exec } from 'child_process';
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
import _webpack from 'webpack';

import webpackConfig from './webpack.config.js';
import { version as VERSION } from './package.json';

const browserSync = require('browser-sync').create();

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

/**
 * Version bump the required files according to the version in package.json
 * Append link to changelog for current version in readme.txt
 */
gulp.task('bump', () => {
    const re = `== Changelog ==\n(?!\n= ${VERSION})`;
    const repl =
    `== Changelog ==\n\n` +
    `= ${VERSION} =\n\n` +
    `[Click here](https://headwayapp.co/academic-bloggers-toolkit-changelog) to view changes.\n`;

    const srcFiles = gulp
        .src([
            'src/academic-bloggers-toolkit.php',
            'src/readme.txt',
        ], { base: './src' })
        .pipe(replace(/Version: [\d\.]+/, `Version: ${VERSION}`))
        .pipe(replace(/Stable tag: .+/, `Stable tag: ${VERSION}`))
        .pipe(replace(/define\('ABT_VERSION', '.+?'\);/, `define('ABT_VERSION', '${VERSION}');`))
        .pipe(replace(new RegExp(re), repl))
        .pipe(gulp.dest('./src'));

    const repoFiles = gulp
        .src('ISSUE_TEMPLATE.md', { base: './' })
        .pipe(replace(/\*\*ABT Version:.+/, `**ABT Version:** ${VERSION}`))
        .pipe(gulp.dest('./'));

    return merge(srcFiles, repoFiles);
});

// Translations
gulp.task('pot', () =>
    gulp
        .src('dist/**/*.php')
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
    gulp.src('src/lib/php/views/*.jade', { base: './src' })
    .pipe(jade({
        omitPhpRuntime: true,
        omitPhpExtractor: true,
        arraysOnly: false,
    }))
    .pipe(rename({ extname: '.php' }))
    .pipe(gulp.dest('dist'))
);

gulp.task('php', gulp.parallel('jade', () => {
    const re1 = new RegExp(/(\s=\s|\sreturn\s)((?:\(object\))|)(\[)([\W\w\s]*?)(\])(;\s?)/, 'gm');
    const re2 = new RegExp(/$(\s+)(.+?)(\s=>\s)((?:\(object\))?)(\[)/, 'gm');
    const re3 = new RegExp(/$(\s+)(\],|\[)$/, 'gm');
    const re4 = new RegExp(/(array\()(\],)/, 'gm');
    const re5 = new RegExp(/(,\s+)(\[)(.*)(\])/, 'gm');

    function rep1(match, p1, p2, p3, p4, p5, p6) {
        return p1 + p2 + 'array(' + p4 + ')' + p6;
    }

    function rep2(match, p1, p2, p3, p4, p5) {
        return p1 + p2 + p3 + p4 + 'array(';
    }

    function rep3(match, p1, p2) {
        const r = p2 === '],'
            ? '),'
            : 'array('
        return p1 + r;
    }

    function rep4(match, p1, p2) {
        return p1 + '),'
    }

    function rep5(match, p1, p2, p3, p4) {
        return p1 + 'array(' + p3 + ')';
    }

    return gulp.src('src/**/*.php', { base: './src' })
    .pipe(replace(re1, rep1))
    .pipe(replace(re2, rep2))
    .pipe(replace(re3, rep3))
    .pipe(replace(re4, rep4))
    .pipe(replace(re5, rep5))
    .pipe(gulp.dest('dist'));
}));


gulp.task('static', () => {
    const main = gulp
        .src('src/**/*.{js,po,pot,mo,html,txt}', { base: './src' })
        .pipe(gulp.dest('dist'));
    const misc = gulp
        .src(['LICENSE'])
        .pipe(gulp.dest('dist'));
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
let firstBuildReady = false;

gulp.task('webpack:dev', (done) =>
    gulp
        .src('src/lib/js/Frontend.ts')
        .pipe(webpack(webpackConfig, _webpack))
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.stream())
);

gulp.task('webpack:prod', () =>
    gulp
        .src('src/lib/js/Frontend.ts')
        .pipe(webpack(webpackConfig, _webpack))
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

gulp.task('_build',
    gulp.series(
        'clean', 'bump',
        gulp.parallel('stylus:prod', 'static', 'webpack:prod'),
        gulp.parallel('js', 'php'),
        'pot'
    )
);


gulp.task('_dev',
    gulp.series(
        'chown', 'clean', 'static',
        gulp.parallel('php', 'stylus:dev', 'webpack:dev'), () => {

            gulp.watch('src/lib/**/*.styl', gulp.series('stylus:dev'));

            gulp.watch([
                'src/**/*',
                '!src/**/*.{ts,tsx,styl}',
                '!src/**/__tests__/',
                '!src/**/__tests__/*',
            ], gulp.series('static', 'php', 'reload'));

            gulp.watch([
                'src/lib/**/*.{ts,tsx}',
                '!src/lib/**/__tests__/',
                '!src/lib/**/__tests__/*',
            ], gulp.series('webpack:dev'));

            browserSync.init({
                proxy: 'localhost:8080',
                open: false,
            });
        }
    )
);
