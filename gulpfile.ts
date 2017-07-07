import * as autoprefixer from 'autoprefixer-stylus';
import { exec as cp_exec } from 'child_process';
import * as gulp from 'gulp';
import * as replace from 'gulp-replace';
import * as sort from 'gulp-sort';
import * as sourcemaps from 'gulp-sourcemaps';
import * as stylus from 'gulp-stylus';
import * as uglify from 'gulp-uglify';
import * as wpPot from 'gulp-wp-pot';
import * as merge from 'merge-stream';
import { promisify } from 'util';
import * as webpack from 'webpack';
import * as webpackStream from 'webpack-stream';

import webpackConfig from './webpack.config';
const VERSION = require('./package.json').version;

const browserSync = require('browser-sync').create();
const exec = promisify(cp_exec);

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// ==================================================
//                 Utility Tasks
// ==================================================

// prettier-ignore
const reload = cb => { browserSync.reload(); cb(); }
const clean = () => exec(`rm -rf ${__dirname}/dist/*`);
export { clean, reload };

/**
 * Version bump the required files according to the version in package.json
 * Append link to changelog for current version in readme.txt
 */
gulp.task('bump', () => {
    const re = `== Changelog ==\n(?!\n= ${VERSION})`;
    const repl =
        '== Changelog ==\n\n' +
        `= ${VERSION} =\n\n` +
        '[Click here](https://headwayapp.co/academic-bloggers-toolkit-changelog) to view changes.\n';

    const srcFiles = gulp
        .src(['src/academic-bloggers-toolkit.php', 'src/readme.txt'], {
            base: './src',
        })
        .pipe(replace(/Version: [\d.]+/, `Version: ${VERSION}`))
        .pipe(replace(/Stable tag: .+/, `Stable tag: ${VERSION}`))
        .pipe(
            replace(
                /define\('ABT_VERSION', '.+?'\);/,
                `define('ABT_VERSION', '${VERSION}');`
            )
        )
        .pipe(replace(new RegExp(re), repl))
        .pipe(gulp.dest('./src'));

    const repoFiles = gulp
        .src('ISSUE_TEMPLATE.md', { base: './' })
        .pipe(replace(/\*\*ABT Version:.+/, `**ABT Version:** ${VERSION}`))
        .pipe(gulp.dest('./'));

    return merge(srcFiles, repoFiles);
});

// FIXME:
gulp.task('rollbar', () =>
    gulp
        .src('dist/php/dom-injects.php', { base: './' })
        .pipe(replace(/(^\s+environment: ")(test)(",)/gm, '$1production$3'))
        .pipe(gulp.dest('./'))
);

// Translations
export function pot() {
    return gulp
        .src('./src/**/*.php', { base: 'dist/*' })
        .pipe(sort())
        .pipe(
            wpPot({
                domain: 'academic-bloggers-toolkit',
                package: `Academic Blogger's Toolkit ${VERSION}`,
                bugReport:
                    'https://github.com/dsifford/academic-bloggers-toolkit/issues',
                lastTranslator: 'Derek P Sifford <dereksifford@gmail.com>',
                team: 'Derek P Sifford <dereksifford@gmail.com>',
                headers: false,
            })
        )
        .pipe(replace(/(\s)(src\/)(\S+)/gm, '$1$3'))
        .pipe(gulp.dest('./src/academic-bloggers-toolkit.pot'));
}

// ==================================================
//              PHP/Static Asset Tasks
// ==================================================

export function php() {
    const re1 = new RegExp(
        /(\s=\s|\sreturn\s)((?:\(object\))|)(\[)([\W\w\s]*?)(])(;\s?)/,
        'gm'
    );
    const re2 = new RegExp(/$(\s+)(.+?)(\s=>\s)((?:\(object\))?)(\[)/, 'gm');
    const re3 = new RegExp(/$(\s+)(],|\[)$/, 'gm');
    const re4 = new RegExp(/(array\()(],)/, 'gm');
    const re5 = new RegExp(/(,\s+)(\[)(.*)(])/, 'gm');

    function rep1(_match, p1, p2, _p3, p4, _p5, p6) {
        return `${p1}${p2}array(${p4})${p6}`;
    }

    function rep2(_match, p1, p2, p3, p4) {
        return `${p1}${p2}${p3}${p4}array(`;
    }

    function rep3(_match, p1, p2) {
        const r = p2 === '],' ? '),' : 'array(';
        return p1 + r;
    }

    function rep4(_match, p1) {
        return `${p1}),`;
    }

    function rep5(_match, p1, _p2, p3) {
        return `${p1}array(${p3})`;
    }

    return gulp
        .src(['src/**/*.php', '!**/views/*.php'], { base: './src' })
        .pipe(replace(re1, rep1))
        .pipe(replace(re2, rep2))
        .pipe(replace(re3, rep3))
        .pipe(replace(re4, rep4))
        .pipe(replace(re5, rep5))
        .pipe(gulp.dest('dist'));
}

export function staticFiles() {
    const misc = gulp
        .src(['src/**/*.{po,pot,mo,html,txt}', 'src/**/views/*.php'], {
            base: './src',
        })
        .pipe(gulp.dest('dist'));
    const license = gulp.src(['LICENSE']).pipe(gulp.dest('dist'));
    return merge(misc, license);
}

// ==================================================
//                 Style Tasks
// ==================================================

export function styles() {
    let stream = gulp.src('src/**/*.styl', { base: './src' });

    if (!IS_PRODUCTION) {
        stream = stream.pipe(sourcemaps.init());
    }

    stream = stream.pipe(
        stylus({
            use: [autoprefixer({ browsers: ['last 2 versions'] })],
            compress: IS_PRODUCTION,
        })
    );

    if (!IS_PRODUCTION) {
        stream = stream.pipe(sourcemaps.write('.'));
    }

    stream = stream.pipe(gulp.dest('dist'));

    if (!IS_PRODUCTION) {
        stream = stream.pipe(browserSync.stream({ match: '**/*.css' }));
    }

    return stream;
}

// ==================================================
//                 Javascript Tasks
// ==================================================

export function bundle() {
    let stream = gulp
        .src('src/js/Frontend.ts')
        // tslint:disable-next-line:prefer-object-spread
        .pipe(webpackStream(Object.assign({}, webpackConfig, { watch: !IS_PRODUCTION }), webpack))
        .pipe(gulp.dest('dist/'));
    if (!IS_PRODUCTION) {
        stream = stream.pipe(browserSync.stream());
    }
    return stream;
}

export function js() {
    let stream = gulp.src('src/**/*.js', { base: './src' });
    if (IS_PRODUCTION) {
        stream = stream.pipe(uglify());
    }
    stream = stream.pipe(gulp.dest('dist'));
    return stream;
}

const main = gulp.series(
    clean,
    gulp.parallel(styles, staticFiles, js, php, pot),
    bundle,
    cb => {
        if (IS_PRODUCTION) return cb();

        // tslint:disable-next-line:no-console
        console.log('FOOOO');

        gulp.watch('src/**/*.styl', gulp.series(styles));

        gulp.watch(
            [
                'src/**/*',
                '!src/**/*.{ts,tsx,styl}',
                '!src/**/__tests__/',
                '!src/**/__tests__/*',
            ],
            gulp.series(php, staticFiles, reload)
        );

        // gulp.watch(
        //     [
        //         'src/lib/**/*.{ts,tsx}',
        //         '!src/lib/**/__tests__/',
        //         '!src/lib/**/__tests__/*',
        //     ],
        //     gulp.series(bundle)
        // );

        // browserSync.init({
        //     proxy: 'localhost:8080',
        //     open: false,
        // });
    }
);

export default main;
