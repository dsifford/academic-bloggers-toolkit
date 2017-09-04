import * as parser from 'bibtex-parse-js';

import { generateID } from 'utils/helpers';

interface Months {
    [k: string]: string;
}

interface FieldMap {
    [k: string]: CSL.CitationType;
}

const bibtexTypeMap: FieldMap = {
    article: 'article-journal',
    book: 'book',
    booklet: 'pamphlet',
    conference: 'paper-conference',
    electronic: 'webpage',
    inbook: 'chapter',
    incollection: 'chapter',
    inproceedings: 'paper-conference',
    manual: 'book',
    mastersthesis: 'thesis',
    patent: 'patent',
    periodical: 'article-magazine',
    phdthesis: 'thesis',
    proceedings: 'book',
    standard: 'legislation',
    techreport: 'report',
    unpublished: 'manuscript',
};

const bibtexMonthMap: Months = {
    jan: '01',
    feb: '02',
    mar: '03',
    apr: '04',
    may: '05',
    jun: '06',
    jul: '07',
    aug: '08',
    sep: '09',
    oct: '10',
    nov: '11',
    dec: '12',
};

export class TeXParser {
    bibJSON: parser.BibJSON[];
    unsupportedRefs = [];

    private citationTypes = new Proxy(bibtexTypeMap, {
        get: (target, name): CSL.CitationType => {
            return target[name] || 'article';
        },
    });

    constructor(raw: string) {
        this.bibJSON = parser.toJSON(raw);
    }

    parse(): CSL.Data[] {
        return this.bibJSON.map(citation => {
            const item = citation.entryTags;
            // prettier-ignore
            const date: CSL.Date = {
                'date-parts': [
                    [
                        item.year || '',
                        item.month ? bibtexMonthMap[item.month] : '',
                    ],
                ],
            };
            return Object.keys(item).reduce(
                // tslint:disable-next-line cyclomatic-complexity
                (prev, key) => {
                    switch (key) {
                        case 'abstract':
                        case 'annote':
                        case 'edition':
                        case 'language':
                        case 'note':
                        case 'publisher':
                        case 'version':
                        case 'volume':
                            return {
                                ...prev,
                                [key]: item[key],
                            };
                        case 'title':
                        case 'chapter':
                            return {
                                ...prev,
                                title: item[key].replace(/[{}]/g, ''),
                            };
                        case 'address':
                        case 'location':
                            return {
                                ...prev,
                                'publisher-place': item[key],
                                'event-place': item[key],
                            };
                        case 'author':
                        case 'editor':
                            return {
                                ...prev,
                                [key]: parsePeople(item[key].replace(/[{}"]/g, '')),
                            };
                        case 'booktitle':
                            return {
                                ...prev,
                                'collection-title': item[key].replace(/[{}"]/g, ''),
                                'container-title': item[key].replace(/[{}"]/g, ''),
                            };
                        case 'doi':
                        case 'issn':
                        case 'isbn':
                        case 'pmcid':
                        case 'pmid':
                        case 'url':
                            return {
                                ...prev,
                                [key.toUpperCase()]: item[key],
                            };
                        case 'institution':
                        case 'school':
                            return {
                                ...prev,
                                publisher: item[key],
                            };
                        case 'journal':
                            return {
                                ...prev,
                                'container-title': item[key],
                            };
                        case 'keywords':
                            return {
                                ...prev,
                                keyword: item[key],
                            };
                        case 'number':
                            return {
                                ...prev,
                                number: item[key],
                                issue: item[key],
                            };
                        case 'pages':
                            return {
                                ...prev,
                                page: item[
                                    key
                                ].replace(/(^[\d\w]+)(-{1,2})?([\d\w]+)?/, (_, p1, p2, p3) => {
                                    if (!p2) return p1;
                                    return `${p1}-${p3}`;
                                }),
                            };
                        case 'pagetotal':
                            return {
                                ...prev,
                                'number-of-pages': item[key],
                            };
                        case 'series':
                            return {
                                ...prev,
                                'collection-title': item[key],
                            };
                        case 'shorttitle':
                            return {
                                ...prev,
                                'title-short': item[key].replace(/[{}]/g, ''),
                            };
                        case 'volumes':
                            return {
                                ...prev,
                                'number-of-volumes': item[key],
                            };
                        default:
                            return prev;
                    }
                },
                {
                    id: generateID(),
                    type: this.citationTypes[citation.entryType],
                    issued: date,
                    'event-date': date,
                },
            );
        });
    }
}

export function parsePeople(raw: string): CSL.Person[] {
    return raw.split(/ and (?![^{]*})/g).map(person => {
        if (person[0] === '{' && person[person.length - 1] === '}') {
            return {
                literal: person.slice(1, -1),
            };
        }
        let family = '';
        let given = '';
        let i = 0;
        let nameparts = person.split(', ');
        if (nameparts.length === 1) {
            nameparts = person.split(' ');
            for (const part of nameparts) {
                if (i === nameparts.length - 1) {
                    family += part;
                    i = 0;
                    break;
                }
                if (i === 0) {
                    given += `${part}`;
                    i++;
                    continue;
                }
                if (
                    part[0] === part[0].toLowerCase() ||
                    nameparts[i - 1][0] === nameparts[i - 1][0].toLowerCase()
                ) {
                    family += `${part} `;
                    i++;
                    continue;
                }
                given += ` ${part[0]}.`;
                i++;
            }
        } else {
            family = nameparts[0];
            const givenBlock = nameparts[1].split(' ');
            for (const part of givenBlock) {
                if (i === 0) {
                    given += part;
                    i++;
                    continue;
                }
                given += ` ${part[0]}.`;
                i++;
            }
        }
        return {
            family,
            given,
        };
    });
}
