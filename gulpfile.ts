// tslint:disable:no-console
import { exec as cp_exec, spawn } from 'child_process';
import * as gulp from 'gulp';
import * as autoprefixer from 'gulp-autoprefixer';
import * as replace from 'gulp-replace';
import * as sass from 'gulp-sass';
import * as sort from 'gulp-sort';
import * as sourcemaps from 'gulp-sourcemaps';
import * as composer from 'gulp-uglify/composer';
import * as wpPot from 'gulp-wp-pot';
import * as merge from 'merge-stream';
import * as uglifyEs from 'uglify-es';
import { promisify } from 'util';

const browserSync = require('browser-sync').create();
const uglify = composer(uglifyEs, console);
const exec = promisify(cp_exec);

const VERSION = require('./package.json').version;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

process.env.FORCE_COLOR = '1';

type Replacer = (match: string, ...submatches: string[]) => string;
type Callback = () => void;

// prettier-ignore
const reload = (cb: Callback) => { browserSync.reload(); cb(); }
const clean = () => exec(`rm -rf ${__dirname}/dist/*`);
export { clean, reload };

/**
 * Version bump the required files according to the version in package.json
 * Append link to changelog for current version in readme.txt
 */
export function bump() {
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
        .pipe(replace(/define\('ABT_VERSION', '.+?'\);/, `define('ABT_VERSION', '${VERSION}');`))
        .pipe(replace(new RegExp(re), repl))
        .pipe(gulp.dest('./src'));

    const repoFiles = gulp
        .src('ISSUE_TEMPLATE.md', { base: './' })
        .pipe(replace(/\*\*ABT Version:.+/, `**ABT Version:** ${VERSION}`))
        .pipe(gulp.dest('./'));

    return merge(srcFiles, repoFiles);
}

// Translations
export function pot() {
    return gulp
        .src('./src/**/*.php', { base: 'dist/*' })
        .pipe(sort())
        .pipe(
            wpPot({
                domain: 'academic-bloggers-toolkit',
                package: `Academic Blogger's Toolkit ${VERSION}`,
                bugReport: 'https://github.com/dsifford/academic-bloggers-toolkit/issues',
                lastTranslator: 'Derek P Sifford <dereksifford@gmail.com>',
                team: 'Derek P Sifford <dereksifford@gmail.com>',
                headers: false,
            }),
        )
        .pipe(replace(/(\s)(src\/)(\S+)/gm, '$1$3'))
        .pipe(gulp.dest('./src/academic-bloggers-toolkit.pot'));
}

// ==================================================
//              PHP/Static Asset Tasks
// ==================================================

export function php(): NodeJS.ReadWriteStream {
    const re1 = new RegExp(/(\s=\s|\sreturn\s)((?:\(object\))|)(\[)([\W\w\s]*?)(])(;\s?)/, 'gm');
    const re2 = new RegExp(/$(\s+)(.+?)(\s=>\s)((?:\(object\))?)(\[)/, 'gm');
    const re3 = new RegExp(/$(\s+)(],|\[)$/, 'gm');
    const re4 = new RegExp(/(array\()(],)/, 'gm');
    const re5 = new RegExp(/(,\s+)(\[)(.*)(])/, 'gm');

    const rep1: Replacer = (_match, p1, p2, _p3, p4, _p5, p6) => `${p1}${p2}array(${p4})${p6}`;
    const rep2: Replacer = (_match, p1, p2, p3, p4) => `${p1}${p2}${p3}${p4}array(`;
    const rep3: Replacer = (_match, p1, p2) => {
        const r = p2 === '],' ? '),' : 'array(';
        return p1 + r;
    };
    const rep4: Replacer = (_match, p1) => `${p1}),`;
    const rep5: Replacer = (_match, p1, _p2, p3) => `${p1}array(${p3})`;

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
    const PHP = php();
    return merge(misc, license, PHP);
}

// ==================================================
//                 Style Tasks
// ==================================================

export function styles() {
    let stream = gulp.src('src/css/**/[^_]*.scss', { base: './src' });

    if (!IS_PRODUCTION) {
        stream = stream.pipe(sourcemaps.init());
    }

    stream = stream
        .pipe(
            sass({
                outputStyle: IS_PRODUCTION ? 'compressed' : 'nested',
            }).on('error', sass.logError),
        )
        .pipe(autoprefixer({ browsers: ['last 2 versions'] }));

    if (!IS_PRODUCTION) {
        stream = stream.pipe(sourcemaps.write('.', undefined));
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

export function bundle(cb: Callback) {
    const args = IS_PRODUCTION ? ['-p'] : [];
    const child = spawn(`${__dirname}/node_modules/.bin/webpack`, args, {
        env: process.env,
    });
    child.on('error', err => {
        console.error(err);
        process.exit(1);
    });
    child.on('exit', (code, signal) => {
        if (code !== 0) {
            console.error(`Exited with non-zero exit code (${code}): ${signal}`);
            process.exit(1);
        }
        cb();
    });
    child.on('disconnect', () => child.kill());
    child.stdout.on('data', data => {
        const msg = data.toString();
        console.log(msg.trim());
        if (msg.indexOf('[at-loader] Ok') > -1) {
            browserSync.reload();
        }
    });
    child.stderr.on('data', data => {
        const msg = data.toString();
        console.error(msg.trim());
    });
    if (!IS_PRODUCTION) return cb();
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
    gulp.parallel(styles, staticFiles, js, pot),
    bundle,
    (cb: Callback) => {
        if (IS_PRODUCTION) return cb();

        gulp.watch('src/**/*.styl', gulp.series(styles));

        gulp.watch(
            ['src/**/*', '!src/**/*.{ts,tsx,styl}', '!src/**/__tests__/', '!src/**/__tests__/*'],
            gulp.series(staticFiles, reload),
        );

        browserSync.init({
            proxy: 'localhost:8080',
            open: false,
            reloadDebounce: 2000,
            port: 3005,
        });
    },
);

export default main;
