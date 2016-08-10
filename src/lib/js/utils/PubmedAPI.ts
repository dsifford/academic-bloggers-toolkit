import * as processor from './CSLFieldProcessors';
import { localeConversions } from './Constants';

/**
 * Sends a string of text to PubMed and gets a list of PMIDs for the query.
 *   Depending on the state of `bypassJSONFormatter`, the result is either sent
 *   through `getFromPMID` and `procssJSON` or just to `getFromPMID`.
 * @param {string}     query    A search string (the same you would type into
 *   the search box on pubmed)
 * @param {Function}   callback Callback function (passed into `getFromPMID`).
 * @param {boolean}    bypassJSONFormatter A boolean (default = false) which
 *   decides whether or not to send the response to be processed as CSL.
 */
 /* TODO: Redocument this */
export function PubmedQuery(query: string, bypassJSONFormatter: boolean = false): Promise<PubMed.SingleReference[]> {
    return new Promise<[string, boolean]>((resolve, reject) => {
        const req = new XMLHttpRequest();
        req.open('GET', `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURI(query)}&retmode=json`); // tslint:disable-line
        req.onload = () => {

            if (req.status !== 200)
                reject(new Error('Error: PubmedQuery => Pubmed returned a non-200 status code.'));

            const res = JSON.parse(req.responseText);

            if (res.error)
                reject(new Error('Error: PubmedQuery => Request not valid.'));

            resolve([res.esearchresult.idlist.join(), bypassJSONFormatter]);
        };
        req.onerror = () => reject(new Error('Error: PubmedQuery => Network Error.'));
        req.send(null);
    })
    .then(data => getFromPMID(data[0], data[1]));
}

/**
 * Takes a comma-separated list of PMIDs as input and returns metadata for each
 *   paper requested.
 * @param {string}     PMIDlist A comma-separated list of PMIDs
 * @param {Function}   callback Callback function
 * @param {boolean}    bypassJSONFormatter A boolean (default = false) which
 *   decides whether or not to send the response to be processed as CSL.
 */

/* TODO: Redocument this */
export function getFromPMID(
    PMIDlist: string,
    bypassJSONFormatter: boolean = false
): Promise<PubMed.SingleReference[]|[CSL.Data[], string[]]> {
    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest();
        req.open('GET', `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${PMIDlist}&version=2.0&retmode=json`); // tslint:disable-line
        req.onload = () => {

            if (req.status !== 200)
                reject(new Error('Error: getFromPMID => PubMed returned a non-200 status code.'));

            const res = JSON.parse(req.responseText);
            const iterable: PubMed.SingleReference[] = [];

            for (const i of Object.keys(res.result)) {
                if (i === 'uids') continue;
                if (res.result[i].title)
                    res.result[i].title = res.result[i].title.replace(/(&amp;amp;)/g, '&');
                iterable.push(res.result[i]);
            }

            if (bypassJSONFormatter) resolve(iterable);

            resolve([
                processJSON(iterable),
                PMIDlist.split(',').filter(i => res.result.uids.indexOf(i) === -1),
            ]);

        };
        req.onerror = () => reject(new Error('Error: getFromPMID => Network Error.'));
        req.send(null);
    });
}

/**
 * Takes the raw response from pubmed and processes it into CSL.
 *
 * @note The following response fields were skipped:
 *   - articleids       // skipped in favor of `uid`
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
 *   - pubdate          // skipped in favor of `sortpubdate`
 *   - pubstatus
 *   - pubtype        TODO: fix this - figure out what types pubmed has
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
function processJSON(res: PubMed.SingleReference[]): CSL.Data[] {
    const payload: CSL.Data[] = [];

    res.forEach((ref: PubMed.SingleReference, i: number) => {

        const output: CSL.Data = {};
        output.id = `${i}`;
        output.type = 'article-journal'; /** TODO: Figure out all the supported types */
        output.author = [];

        Object.keys(ref).forEach(key => {

            if (typeof ref[key] === 'string' && ref[key] === '') { return; }

            switch (key) {
                case 'authors':
                    ref[key].forEach(author => {
                        output.author.push(processor.processName(author.name, 'pubmed'));
                    });
                    break;
                case 'availablefromurl':
                    output.URL = ref[key];
                    break;
                case 'bookname': /** TODO: Not sure what the difference is here? */
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
                    output.language = localeConversions[ref[key][0]]
                        ? localeConversions[ref[key][0]]
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
                case 'pubtype':
                    /** TODO: Figure out all the type names that pubmed offers */
                    break;
                case 'reportnumber':
                    output.number = ref[key]; /** NOTE: This may be incorrect. */
                    break;
                case 'sortpubdate':
                    output.issued = processor.processDate(ref[key], 'pubmed');
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
