// tslint:disable no-console
import * as fs from 'fs';
import { request } from 'https';
import * as path from 'path';

const oldData = require('../src/vendor/citation-styles.json');

interface GithubFiles {
    object: {
        entries: Array<{
            name: string;
            object: {
                text: string;
            };
        }>;
    };
}

interface StyleResponse {
    data: {
        independent: GithubFiles;
        dependent: GithubFiles;
    };
}

interface StyleObj {
    id: string;
    label: string;
    value: string;
}

async function getData(): Promise<StyleResponse> {
    const query = `
        query {
            independent: repository(owner: "citation-style-language", name: "styles") {
                object(expression: "master:") {
                    ... on Tree {
                        entries {
                            name
                            object {
                                ... on Blob {
                                    text
                                }
                            }
                        }
                    }
                }
            }
            dependent: repository(owner: "citation-style-language", name: "styles") {
                object(expression: "master:dependent") {
                    ... on Tree {
                        entries {
                            name
                            object {
                                ... on Blob {
                                    text
                                }
                            }
                        }
                    }
                }
            }
        }
    `;
    return new Promise<StyleResponse>((resolve, reject) => {
        const options = {
            hostname: 'api.github.com',
            path: '/graphql',
            method: 'POST',
            headers: {
                Authorization: `bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
                'User-Agent': 'dsifford/academic-bloggers-toolkit',
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
        req.write(JSON.stringify({ query }));
        req.end();
    });
}

function parseStyleObj(obj: StyleResponse): StyleObj[] {
    return [...obj.data.independent.object.entries, ...obj.data.dependent.object.entries]
        .reduce((prev, file) => {
            if (file.name.endsWith('.csl')) {
                return [...prev, { ...file, name: file.name.replace(/\.csl$/, '') }];
            }
            return prev;
        }, [])
        .sort((a, b) => {
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }
            return 0;
        })
        .map(style => {
            const label = style.object.text.match(/<title>(.+)<\/title>/)![1].replace(
                /&amp;/g,
                '&',
            );
            if (!label) {
                throw new Error(`Can't locate label for ${style.name}`);
            }
            const independentParent = style.object.text.match(
                /<link\s+href="https?:\/\/www.zotero.org\/styles\/(.+?)"\s+rel="independent-parent"/,
            );
            const value =
                independentParent && independentParent[1] ? independentParent[1] : style.name;
            return {
                id: style.name,
                label,
                value,
            };
        });
}

function getNewStyles(before: StyleObj[], after: StyleObj[]): string[] {
    const newlyAddedStyles = new Set<string>();
    const beforeLabels = new Set(before.map(s => s.label));
    for (const style of after) {
        if (beforeLabels.has(style.label)) {
            continue;
        }
        newlyAddedStyles.add(style.label);
    }
    return Array.from(newlyAddedStyles);
}

async function main() {
    let newData: StyleObj[];
    try {
        newData = await getData().then(parseStyleObj);
    } catch (e) {
        console.error(e);
        return process.exit(1);
    }
    const newStyles = getNewStyles(oldData, newData);
    console.log('================ New Styles Added ================');
    console.log(newStyles.join('\n'));
    fs.writeFileSync(
        path.resolve(__dirname, '../src/vendor/', 'citation-styles.json'),
        JSON.stringify(newData, null, 4),
    );
}

main();
