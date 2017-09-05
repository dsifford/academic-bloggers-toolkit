// tslint:disable no-console
import { execSync } from 'child_process';
import { request } from 'https';
import * as path from 'path';
import { stringify } from 'querystring';

const TOKEN = process.env.PO_EDITOR_TOKEN;
const PROJECT_ID = 68585;

if (!TOKEN) {
    console.error('API token not found in environment');
    process.exit(1);
}

const LANGS: ReadonlyMap<string, string[]> = new Map([
    ['ar', ['ar']],
    ['zh-CN', ['zh_CN']],
    ['de', ['de_DE', 'de_CH']],
    ['pl', ['pl_PL']],
    ['pt', ['pt_BR', 'pt_PT']],
    [
        'es-ar',
        ['es_AR', 'es_CL', 'es_CO', 'es_CR', 'es_GT', 'es_MX', 'es_PE', 'es_PR', 'es_ES', 'es_VE'],
    ],
]);

(async () => {
    execSync(`rm -f ${path.resolve(__dirname, '../../src/languages/*')}`);
    const data = await getData<API<Langs>>('/languages/list', {});
    const langs = data.result.languages.filter(l => l.percentage > 0 && l.code !== 'en-us');
    const languageReqs: Array<Promise<{}>> = [];

    for (const l of langs) {
        languageReqs.push(
            getData<API<{ url: string }>>('/projects/export', {
                language: l.code,
                type: 'mo',
            }).then(lang => {
                return new Promise(res => {
                    const langcodes = LANGS.get(l.code);
                    if (!langcodes) {
                        throw new Error(`Language code not set in LANGS for ${l.code}`);
                    }
                    const [firstMatch, ...codes] = langcodes;
                    const fileBaseName = path.resolve(
                        __dirname,
                        '../../src/languages/academic-bloggers-toolkit-',
                    );
                    execSync(`curl ${lang.result.url} --output ${fileBaseName}${firstMatch}.mo`);
                    for (const code of codes) {
                        execSync(`cp ${fileBaseName}${firstMatch}.mo ${fileBaseName}${code}.mo`);
                    }
                    res();
                });
            }),
        );
    }
    await Promise.all(languageReqs);
})();

interface API<T> {
    response: {
        status: string;
        code: string;
        message: string;
    };
    result: T;
}

interface Langs {
    languages: Array<{
        name: string;
        code: string;
        translations: number;
        percentage: number;
        updated: string;
    }>;
}

async function getData<T>(endpoint: string, data: object): Promise<T> {
    return new Promise<T>((resolve, reject) => {
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
