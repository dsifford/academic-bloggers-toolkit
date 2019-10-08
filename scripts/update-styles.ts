import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

import { transform } from 'camaro';
import rimraf from 'rimraf';

import oldStyles from '../src/citation-styles.json';
import { Style, StyleJSON } from '../src/js/stores/data';
import { StyleKind } from '../src/js/stores/data/constants';

const mkdir = promisify(fs.mkdir);
const readfile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);
const writeFile = promisify(fs.writeFile);

const CACHE_DIR = path.join(
    __dirname,
    '..',
    'node_modules',
    '.cache',
    'academic-bloggers-toolkit',
);
const TEMP_DIR = path.join(CACHE_DIR, 'tmp');
const OUTPUT_PATH = path.join(__dirname, '..', 'src');

(async () => {
    await mkdir(TEMP_DIR, { recursive: true });
    spawnSync(
        'git',
        [
            'clone',
            'https://github.com/citation-style-language/styles.git',
            TEMP_DIR,
        ],
        {
            stdio: 'inherit',
        },
    );

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const renamedStyles = require(path.join(TEMP_DIR, 'renamed-styles.json'));
    const independent = await getFiles(TEMP_DIR, { extension: '.csl' });
    const dependent = await getFiles(TEMP_DIR, {
        relpath: 'dependent',
        extension: '.csl',
    });

    const INCLUDED_STYLES: Set<string> = new Set();
    let styles: Style[] = [];

    for (const style of independent) {
        const styleData = await parseCSL(path.join(TEMP_DIR, style), true);
        styleData.forEach(({ value }) => INCLUDED_STYLES.add(value));
        styles = [...styles, ...styleData];
    }

    for (const style of dependent) {
        const styleData = (await parseCSL(
            path.join(TEMP_DIR, style),
            false,
        )).filter(({ value }) => INCLUDED_STYLES.has(value));
        styles = [...styles, ...styleData];
    }

    styles = [...styles].sort((a, b) => {
        const prev = a.label.toLowerCase();
        const curr = b.label.toLowerCase();
        return prev < curr ? -1 : 1;
    });

    const renamed = Object.entries<string>(renamedStyles).reduce(
        (obj, [key, val]) => {
            if (INCLUDED_STYLES.has(val)) {
                return { ...obj, [key]: val };
            }
            return obj;
        },
        {},
    );

    const newStyles: StyleJSON = {
        renamed,
        styles,
    };

    logNewStyles(oldStyles as StyleJSON, newStyles);

    await writeFile(
        path.join(OUTPUT_PATH, 'citation-styles.json'),
        JSON.stringify(newStyles, null, 4),
    );

    rimraf.sync(TEMP_DIR);
})();

interface GetFilesOptions {
    relpath?: string;
    extension?: string;
}

async function getFiles(
    rootpath: string,
    { relpath = '', extension = '' }: GetFilesOptions = {},
) {
    const files = await readdir(path.join(rootpath, relpath), {
        withFileTypes: true,
    });
    return files
        .filter(
            file =>
                file.isFile() &&
                !file.isDirectory() &&
                file.name.endsWith(extension),
        )
        .map(file => path.join(relpath, file.name));
}

interface StyleQuery {
    kind: 'in-text' | 'note';
    hasBibliography: boolean;
    parent: string;
    title: string;
    shortTitle: string;
    updated: string;
}

async function parseCSL(
    filepath: string,
    isIndependent: boolean,
): Promise<Style[]> {
    const xml = await readfile(filepath, { encoding: 'utf-8' });
    const data: StyleQuery = await transform(xml, {
        kind: '/style/@class',
        hasBibliography: 'boolean(/style/bibliography)',
        parent: '/style/info/link[@rel="independent-parent"]/@href',
        title: '/style/info/title',
        shortTitle: '/style/info/title-short',
        updated: '/style/info/updated',
    });
    return data.kind === 'note' || (isIndependent && !data.hasBibliography)
        ? []
        : [
              {
                  kind: StyleKind.PREDEFINED,
                  value: path.basename(
                      isIndependent ? filepath : data.parent,
                      '.csl',
                  ),
                  label: data.title,
                  ...(data.shortTitle ? { shortTitle: data.shortTitle } : {}),
              },
          ];
}

function logNewStyles(before: StyleJSON, after: StyleJSON) {
    const BEFORE_LABELS: Set<string> = new Set(before.styles.map(s => s.label));
    console.log('============== STYLES ADDED ==============');
    for (const { label } of after.styles) {
        if (BEFORE_LABELS.has(label)) {
            continue;
        }
        console.log(label);
    }
}
