import * as parser from 'bibtex-parse-js';

export class TeXParser {

    public bibJSON: parser.BibJSON[];
    public unsupportedRefs = [];

    // tslint:disable:object-literal-sort-keys
    private months = {
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
    // tslint:enable:object-literal-sort-keys

    constructor(raw: string) {
        this.bibJSON = parser.toJSON(raw);
    }

    public parse(): CSL.Data[] {
        const payload = [];
        for (const citation of this.bibJSON) {
            const c: CSL.Data = {};
            const date = {
                month: '',
                year: '',
            };
            Object.keys(citation.entryTags).forEach(key => {
                const item = citation.entryTags;
                switch (key) {
                    case 'abstract':
                    case 'annote':
                    case 'edition':
                    case 'language':
                    case 'note':
                    case 'publisher':
                    case 'version':
                    case 'volume':
                        c[key] = item[key];
                        return;
                    case 'title':
                        c[key] = item[key].replace(/[{}]/g, '');
                        return;
                    case 'address':
                    case 'location':
                        c['publisher-place'] = item[key];
                        c['event-place'] = item[key];
                        return;
                    case 'author':
                    case 'editor':
                        c[key] = parsePeople(item[key].replace(/[{}"]/g, ''));
                        return;
                    case 'booktitle':
                        c['collection-title'] = item[key].replace(/[{}"]/g, '');
                        c['container-title'] = item[key].replace(/[{}"]/g, '');
                        return;
                    case 'chapter':
                        c['title'] = item[key];
                        return;
                    case 'doi':
                    case 'issn':
                    case 'isbn':
                    case 'pmcid':
                    case 'pmid':
                    case 'url':
                        c[key.toUpperCase()] = item[key];
                        return;
                    case 'institution':
                    case 'school':
                        c.publisher = item[key];
                        return;
                    case 'journal':
                        c['container-title'] = item[key];
                        return;
                    case 'keywords':
                        c.keyword = item[key];
                        return;
                    case 'month':
                        date[key] = this.months[item[key]];
                        return;
                    case 'year':
                        date[key] = item[key];
                        return;
                    case 'number':
                        c[key] = item[key];
                        c.issue = item[key];
                        return;
                    case 'pages':
                        c.page = item[key].replace(/(^[\d\w]+)(-{1,2})?([\d\w]+)?/, (_, p1, p2, p3) => {
                            if (!p2) return p1;
                            return `${p1}-${p3}`;
                        });
                        return;
                    case 'pagetotal':
                        c['number-of-pages'] = item[key];
                        return;
                    case 'series':
                        c['collection-title'] = item[key];
                        return;
                    case 'shorttitle':
                        c['title-short'] = item[key].replace(/[{}]/g, '');
                        return;
                    case 'volumes':
                        c['number-of-volumes'] = item[key];
                        return;
                    default:
                        return;
                }
            });
            c.type = this.parseType(citation.entryType);
            const dateParts: CSL.Date = {
                'date-parts': [[date.year, date.month]],
            };
            c.issued = dateParts;
            c['event-date'] = dateParts;
            payload.push(c);
        }
        return payload;
    }

    private parseType(t: string): CSL.CitationType {
        switch (t) {
            case 'article':
                return 'article-journal';
            case 'proceedings':
            case 'manual':
            case 'book':
                return 'book';
            case 'periodical':
                return 'article-magazine';
            case 'booklet':
                return 'pamphlet';
            case 'inbook':
            case 'incollection':
                return 'chapter';
            case 'inproceedings':
            case 'conference':
                return 'paper-conference';
            case 'mastersthesis':
            case 'phdthesis':
                return 'thesis';
            case 'techreport':
                return 'report';
            case 'patent':
                return 'patent';
            case 'electronic':
                return 'webpage';
            case 'standard':
                return 'legislation';
            case 'unpublished':
                return 'manuscript';
            default:
                return 'article';
        }
    }
}

export function parsePeople(raw: string): CSL.Person[] {
    const payload: CSL.Person[] = [];

    const people = raw.split(/ and (?![^{]*})/g);

    for (const person of people) {
        let family = '';
        let given = '';
        if (person[0] === '{' && person[person.length - 1] === '}') {
            payload.push({
                literal: person.substring(1, person.length - 1),
            });
            continue;
        }
        let nameparts = person.split(', ');
        if (nameparts.length === 1) {
            nameparts = person.split(' ');
            for (const [i, part] of nameparts.entries()) {
                if (i === (nameparts.length - 1)) {
                    family += part;
                    break;
                }
                if (i === 0) {
                    given += `${part}`;
                    continue;
                }
                if (part[0] === part[0].toLowerCase() || nameparts[i - 1][0] === nameparts[i - 1][0].toLowerCase()) {
                    family += `${part} `;
                    continue;
                }
                given += ` ${part[0]}.`;
            }
        }
        else if (nameparts.length === 2){
            family = nameparts[0];
            const givenBlock = nameparts[1].split(' ');
            for (const [i, part] of givenBlock.entries()) {
                if (i === 0) {
                    given += part;
                    continue;
                }
                given += ` ${part[0]}.`;
            }
        }
        payload.push({
            family,
            given,
        });
    }
    return payload;
}
