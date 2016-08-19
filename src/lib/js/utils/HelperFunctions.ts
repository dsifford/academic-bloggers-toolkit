import { localeMapper } from './Constants';

/**
 * Creates a "unique" ID value to be used for an ID field.
 * @return {string}              Unique ID.
 */
export function generateID(): string {
    return Math.round(Math.random() * Date.now()).toString(30);
}

/**
 * Takes an array of reference strings and makes the following replacements to each
 *   reference:
 *   - URLs => wrapped with an anchor tag (to make clickable).
 *   - DOIs => wrapped with an anchor tag (link to DOI.org resolver).
 * @param  {string} input Raw reference string.
 * @return {string}       Reference string with parsed links.
 */
export function parseReferenceURL(input: string): string {
    const url: RegExp = /((http:\/\/|https:\/\/|www.)(www.)?[^;\s<]+[0-9a-zA-Z\/])/g;
    const doi: RegExp = /doi:(\S+)\./g;
    let match: RegExpExecArray;
    const replacements: [string, string][] = [];

    // tslint:disable-next-line
    while ((match = url.exec(input)) !== null) {
        if (match[0].search(/^www./) > -1) {
            replacements.push([match[0], `<a href="http://${match[0]}" target="_blank">${match[0]}</a>`]);
        }
        else {
            replacements.push([match[0], `<a href="${match[0]}" target="_blank">${match[0]}</a>`]);
        }
    }

    // tslint:disable-next-line
    while ((match = doi.exec(input)) !== null) {
        replacements.push([match[1], `<a href="https://doi.org/${match[1]}" target="_blank">${match[1]}</a>`]);
    }

    replacements.forEach(r => input = input.replace(r[0], r[1]));

    return input;
}

/**
 * Responsible for parsing RIS or PubMed fields containing names into the correct
 *   shape for CSL.
 *
 * Shape of PubMed string   => Lastname FM
 * Shape of CrossRef string => Lastname, Firstname M
 *
 * @param  {string}     input  The raw, unformatted name.
 * @param  {'RIS'|'pubmed'}     source The source of the name field.
 * @return {CSL.Person}        The formatted CSL.Person object.
 */
export function processCSLName(input: string, source: 'RIS'|'pubmed'): CSL.Person {

    let family: string;
    let given: string;

    switch (source) {
        case 'RIS':
            let splitName = input.split(', ');
            if (splitName.length === 1) {
                return { literal: input };
            }
            family = splitName[0];
            given = splitName[1];
            break;
        case 'pubmed':
        default:
            family = input.split(' ')[0];
            given = input.split(' ')[1];
            break;
    }

    return { family, given };
}

/**
 * Takes a RIS or PubMed date string as input and returns a CSL.Date object.
 *
 * A RIS date string has the following shape: `YYYY/MM/DD/OtherInfo`
 * A PubMed date string has the following shape: `1975/12/01 00:00`
 *
 * @param  {string}   input  Date string.
 * @param  {'RIS'|'pubmed'}   source The source of the input.
 * @return {CSL.Date}        Formatted CSL.Date object.
 */
export function processCSLDate(input: string, source: 'RIS'|'pubmed'): CSL.Date {

    let date: CSL.Date = { 'date-parts': [[]] };
    if (input.length === 0) { return date; }

    switch (source) {
        case 'RIS':
            input.split('/').forEach((part: string, i: number) => {
                if (!part) { return; }
                if (i === 3 && part.search(/(winter|spring|summer|fall)/i) > -1) {
                    date.season = part;
                    return;
                }
                date['date-parts'][0][i] = part;
            });
            break;
        case 'pubmed':
        default:
            date['date-parts'][0] = input.substr(0, 10).split('/');
            break;
    }

    return date;
}

/**
 * Takes the raw response from pubmed and processes it into CSL.
 *
 * @note The following response fields were skipped:
 *   - articleids // skipped in favor of `uid`
 *   - attributes
 *   - doccontriblist
 *   - docdate
 *   - doctype
 *   - elocationid
 *   - epubdate
 *   - essn
 *   - history
 *   - locationlabel
 *   - nlmuniqueid
 *   - pmcrefcount
 *   - pubdate // skipped in favor of `sortpubdate`
 *   - pubstatus
 *   - pubtype
 *   - recordstatus
 *   - references
 *   - srccontriblist
 *   - srcdate
 *   - vernaculartitle
 *   - viewcount
 *
 * @param res  The pubmed api response
 * @return     CSL.Data[]
 */
export function processPubmedJSON(res: PubMed.SingleReference[]): CSL.Data[] {
    const payload: CSL.Data[] = [];

    res.forEach((ref: PubMed.SingleReference, i: number) => {

        const output: CSL.Data = {};
        output.id = `${i}`;
        output.type = 'article-journal';
        output.author = [];

        Object.keys(ref).forEach(key => {

            if (typeof ref[key] === 'string' && ref[key] === '') { return; }

            switch (key) {
                case 'authors':
                    ref[key].forEach(author => {
                        output.author.push(processCSLName(author.name, 'pubmed'));
                    });
                    break;
                case 'availablefromurl':
                    output.URL = ref[key];
                    break;
                case 'bookname':
                case 'booktitle':
                    output.title = ref[key];
                    break;
                case 'chapter':
                    output['chapter-number'] = ref[key];
                    break;
                case 'edition':
                    output.edition = ref[key];
                    break;
                case 'fulljournalname':
                    output['container-title'] = ref[key];
                    break;
                case 'issn':
                    output.ISSN = ref[key];
                    break;
                case 'issue':
                    output.issue = ref[key];
                    break;
                case 'lang':
                    output.language = localeMapper[ref[key][0]]
                        ? localeMapper[ref[key][0]]
                        : 'en-US';
                    break;
                case 'medium':
                    output.medium = ref[key];
                    break;
                case 'pages':
                    output.page = ref[key];
                    break;
                case 'publisherlocation':
                    output['publisher-place'] = ref[key];
                    break;
                case 'publishername':
                    output.publisher = ref[key];
                    break;
                case 'reportnumber':
                    output.number = ref[key];
                    break;
                case 'sortpubdate':
                    output.issued = processCSLDate(ref[key], 'pubmed');
                    break;
                case 'source':
                    output.journalAbbreviation = ref[key];
                    output['container-title-short'] = ref[key];
                    break;
                case 'title':
                    output.title = ref[key];
                    break;
                case 'uid':
                    output.PMID = ref[key];
                    break;
                case 'volume':
                    output.volume = ref[key];
                    break;
                default:
                    break;
            }
        });

        payload.push(output);
    });

    return payload;
}
