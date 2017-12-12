// tslint:disable no-console
import { exec as cp_exec } from 'child_process';
import { oneLine, stripIndents } from 'common-tags';
import { readFile as fsreadfile, writeFile as fswritefile } from 'fs';
import { request } from 'https';
import * as path from 'path';
import { stringify } from 'querystring';
import { promisify } from 'util';

const exec = promisify(cp_exec);
const readFile = promisify(fsreadfile);
const writeFile = promisify(fswritefile);

const TOKEN = process.env.PO_EDITOR_TOKEN;
const PROJECT_ID = 68585;
const ROOT_DIR = path.resolve(__dirname, '../../');

if (!TOKEN) {
    console.error('API token not found in environment');
    process.exit(1);
}

interface API<T> {
    response: {
        status: string;
        code: string;
        message: string;
    };
    result: T;
}

interface Language {
    name: string;
    code: string;
    translations: number;
    percentage: number;
    updated: string;
}

interface Langs {
    languages: Language[];
}

interface Terms {
    terms: {
        parsed: number;
        added: number;
        deleted: number;
    };
}

export interface Contributors {
    contributors: Array<{
        name: string;
        email: string;
        permissions: Array<{
            project: {
                id: string;
                name: string;
            };
            // tslint:disable-next-line
            type: string;
            languages: string[];
        }>;
    }>;
}

const LANGS: ReadonlyMap<string, string[]> = new Map([
    ['ar', ['ar']],
    ['da', ['da_DK']],
    ['de', ['de_DE', 'de_CH']],
    ['es-ar', ['es_AR']],
    ['es', ['es_CL', 'es_CO', 'es_CR', 'es_GT', 'es_MX', 'es_PE', 'es_PR', 'es_ES', 'es_VE']],
    ['id', ['id_ID']],
    ['pl', ['pl_PL']],
    ['pt', ['pt_BR', 'pt_PT']],
    ['ta', ['ta_IN', 'ta_LK']],
    ['th', ['th']],
    ['ur', ['ur']],
    ['zh-CN', ['zh_CN']],
]);

async function getTranslations(): Promise<void> {
    await exec(`rm -f ${ROOT_DIR}/src/languages/*`);
    const languages = (await sendRequest<Langs>('/languages/list', {})).result.languages.filter(
        l => l.percentage > 0 && l.code !== 'en-us',
    );

    for (const lang of languages) {
        const url = (await sendRequest<{ url: string }>('/projects/export', {
            language: lang.code,
            type: 'mo',
        })).result.url;
        const langCodes = LANGS.get(lang.code);
        if (!langCodes) {
            throw new Error(`Language code not set in LANGS for ${lang.code}`);
        }
        const [firstMatch, ...codes] = langCodes;
        const fileBaseName = `${ROOT_DIR}/src/languages/academic-bloggers-toolkit-`;
        await exec(`curl ${url} --output ${fileBaseName}${firstMatch}.mo`);
        for (const code of codes) {
            await exec(`cp ${fileBaseName}${firstMatch}.mo ${fileBaseName}${code}.mo`);
        }
    }
}

async function updateTerms(): Promise<void> {
    const req = `
        curl -X POST https://api.poeditor.com/v2/projects/upload \
        -F api_token="${TOKEN}" \
        -F id="${PROJECT_ID}" \
        -F updating="terms" \
        -F file=@"${ROOT_DIR}/src/academic-bloggers-toolkit.pot"
    `;
    const response = await exec(req);
    const result: Terms = JSON.parse(response.stdout).result;
    console.log(
        `Parsed ${result.terms.parsed} terms\n`,
        `Added ${result.terms.added} terms\n`,
        `Deleted ${result.terms.deleted} terms\n`,
    );
}

async function updateTranslationStatus(): Promise<void> {
    interface LangWithContribs extends Language {
        contributors: string[];
    }

    const [contributors, languages] = await Promise.all([
        (await sendRequest<Contributors>('/contributors/list', {})).result.contributors.filter(
            c => c.permissions[0].type === 'contributor',
        ),
        (await sendRequest<Langs>('/languages/list', {})).result.languages
            .filter(l => l.code !== 'en-us')
            .reduce((map, lang) => {
                const l = {
                    ...lang,
                    contributors: [],
                };
                map.set(lang.code, l);
                return map;
            }, new Map<string, LangWithContribs>()),
    ]);

    for (const contrib of contributors) {
        for (const l of contrib.permissions[0].languages) {
            let lang = languages.get(l);
            if (!lang) continue;
            lang = {
                ...lang,
                contributors: [...lang.contributors, contrib.name],
            };
            languages.set(l, lang);
        }
    }

    // descending order, ascending alphabetical if equal
    const sortedLangs = Array.from(languages).sort(([, v1]: any, [, v2]: any) => {
        if (v1.percentage < v2.percentage) return 1;
        if (v1.percentage > v2.percentage) return -1;
        return v1.code < v2.code ? -1 : 1;
    });

    const readme = await readFile(`${ROOT_DIR}/README.md`, 'utf-8');

    const translationTable = stripIndents`
        Language | Contributors | % Complete
        -------- | ------------ | ----------
        ${sortedLangs
            .map((lang: [string, LangWithContribs]) => {
                return oneLine`
                    ${lang[1].name} \`${lang[0]}\` |
                    ${[...lang[1].contributors].sort().join(', ')} |
                    ![Progress](http://progressed.io/bar/${Math.round(lang[1].percentage)})
                `;
            })
            .join('\n')}
    `;

    const newReadme = readme.replace(
        /(<!-- TRANSLATION_STATUS_START -->\s*)([\s\S]+)(\n<!-- TRANSLATION_STATUS_END -->)/,
        `$1${translationTable}$3`,
    );

    await writeFile(`${ROOT_DIR}/README.md`, newReadme);
}

(async (): Promise<void> => {
    await updateTerms();
    await getTranslations();
    await updateTranslationStatus();
})();

async function sendRequest<T>(endpoint: string, data: object): Promise<API<T>> {
    return new Promise<API<T>>((resolve, reject): void => {
        const qs = stringify({
            api_token: TOKEN,
            id: PROJECT_ID,
            ...data,
        });
        const options = {
            hostname: 'api.poeditor.com',
            path: `/v2${endpoint}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(qs),
            },
        };
        const req = request(options, res => {
            const payload: Buffer[] = [];
            res.on('data', (chunk: Buffer) => payload.push(chunk)).on('end', () => {
                resolve(JSON.parse(Buffer.concat(payload).toString()));
            });
            res.on('error', err => reject(err));
        });
        req.on('error', err => reject(err));
        req.write(qs);
        req.end();
    });
}
