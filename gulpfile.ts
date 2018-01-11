// tslint:disable:no-console
import { exec as cp_exec, spawn } from 'child_process';
import * as gulp from 'gulp';
import * as replace from 'gulp-replace';
import * as sort from 'gulp-sort';
import * as composer from 'gulp-uglify/composer';
import * as wpPot from 'gulp-wp-pot';
import * as merge from 'merge-stream';
import * as uglifyEs from 'uglify-es';
import { promisify } from 'util';

process.env.FORCE_COLOR = '1';

const browserSync = require('browser-sync').create();
const uglify = composer(uglifyEs, console);
const exec = promisify(cp_exec);

const VERSION = require('./package.json').version;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

type Callback = () => void;

// prettier-ignore
const reload = (cb: Callback): void => { browserSync.reload(); cb(); }
const clean = async (): Promise<any> => exec(`rm -rf ${__dirname}/dist/*`);
export { clean, reload };

/**
 * Version bump the required files according to the version in package.json
 * Append link to changelog for current version in readme.txt
 */
export function bump(): NodeJS.ReadWriteStream {
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
                `define('ABT_VERSION', '${VERSION}');`,
            ),
        )
        .pipe(replace(new RegExp(re), repl))
        .pipe(gulp.dest('./src'));

    const repoFiles = gulp
        .src('./.github/ISSUE_TEMPLATE.md', { base: './' })
        .pipe(replace(/\*\*ABT Version:.+/, `**ABT Version:** ${VERSION}`))
        .pipe(gulp.dest('./'));

    return merge(srcFiles, repoFiles);
}

// Translations
export function pot(): NodeJS.ReadWriteStream {
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
            }),
        )
        .pipe(replace(/(\s)(src\/)(\S+)/gm, '$1$3'))
        .pipe(gulp.dest('./src/academic-bloggers-toolkit.pot'));
}

// ==================================================
//              PHP/Static Asset Tasks
// ==================================================

export function staticFiles(): NodeJS.ReadWriteStream {
    const misc = gulp
        .src('src/**/*.{po,pot,mo,html,txt,json,php}', {
            base: './src',
        })
        .pipe(gulp.dest('dist'));
    const license = gulp.src(['LICENSE']).pipe(gulp.dest('dist'));
    return merge(misc, license);
}

// ==================================================
//                 Javascript Tasks
// ==================================================

export function bundle(cb: Callback): void {
    const child = spawn(`${__dirname}/node_modules/.bin/webpack`, [], {
        env: process.env,
    });
    child.on('error', err => {
        console.error(err);
        process.exit(1);
    });
    child.on('exit', (code, signal) => {
        if (code !== 0) {
            console.error(
                `Exited with non-zero exit code (${code}): ${signal}`,
            );
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
    if (!IS_PRODUCTION) {
        return cb();
    }
}

export function js(): NodeJS.ReadWriteStream {
    let stream = gulp.src('src/**/*.js', { base: './src' });
    if (IS_PRODUCTION) {
        stream = stream.pipe(uglify());
    }
    stream = stream.pipe(gulp.dest('dist'));
    return stream;
}

const main = gulp.series(
    clean,
    gulp.parallel(staticFiles, js /*, pot*/),
    bundle,
    (cb: Callback) => {
        if (IS_PRODUCTION) {
            return cb();
        }

        gulp.watch(
            [
                'src/**/*',
                '!src/**/*.{ts,tsx,scss}',
                '!src/**/__tests__/',
                '!src/**/__tests__/*',
            ],
            gulp.series(staticFiles, reload),
        );

        browserSync.init({
            proxy: 'localhost:8080',
            open: false,
            reloadDebounce: 2000,
            port: 3005,
            notify: false,
        });
    },
);

export default main;
