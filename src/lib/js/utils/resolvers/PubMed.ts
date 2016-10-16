import { processPubmedJSON } from '../HelperFunctions';

/**
 * Sends a string of text to PubMed and gets a list of PMIDs for the query.
 *   Depending on the state of `bypassJSONFormatter`, the result is either sent
 *   through `getFromPMID` and `procssJSON` or just to `getFromPMID`.
 * @param {string}     query    A search string (the same you would type into
 *   the search box on pubmed)
 * @param {boolean}    bypassJSONFormatter A boolean (default = false) which
 *   decides whether or not to send the response to be processed as CSL.
 * @return {Promise<PubMed.SingleReference[]>}
 */
export function pubmedQuery(query: string, bypassJSONFormatter: boolean = false): Promise<PubMed.SingleReference[]> {
    return new Promise<[string, boolean]>((resolve, reject) => {
        const req = new XMLHttpRequest();
        req.open('GET', `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURI(query)}&retmode=json`); // tslint:disable-line
        req.addEventListener('load', () => {

            if (req.status !== 200) {
                reject(new Error(`${top.ABT_i18n.errors.prefix}: pubmedQuery => ${top.ABT_i18n.errors.statusError}`));
                return;
            }

            const res = JSON.parse(req.responseText);

            if (res.error) {
                reject(new Error(`${top.ABT_i18n.errors.prefix}: pubmedQuery => ${top.ABT_i18n.errors.badRequest}`));
                return;
            }

            resolve([res.esearchresult.idlist.join(), bypassJSONFormatter]);
        });
        req.addEventListener('error', () => reject(
            new Error(`${top.ABT_i18n.errors.prefix}: pubmedQuery => ${top.ABT_i18n.errors.networkError}`)
        ));
        req.send(null);
    })
    .then(data => getFromPMID(data[0], data[1]));
}

/**
 * Takes a comma-separated list of PMIDs as input and returns metadata for each
 *   paper requested.
 * @param {string}     PMIDlist A comma-separated list of PMIDs
 * @param {boolean}    bypassJSONFormatter A boolean (default = false) which
 *   decides whether or not to send the response to be processed as CSL.
 * @return {Promise<PubMed.SingleReference[]|[CSL.Data[], string[]]>}
 */
export function getFromPMID(
    PMIDlist: string,
    bypassJSONFormatter: boolean = false
): Promise<PubMed.SingleReference[]|[CSL.Data[], string[]]> {
    return new Promise((resolve, reject) => {
        if (PMIDlist.length === 0) {
            resolve([]);
            return;
        }
        const req = new XMLHttpRequest();
        req.open('GET', `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${PMIDlist}&version=2.0&retmode=json`); // tslint:disable-line
        req.addEventListener('load', () => {

            if (req.status !== 200) {
                reject(new Error(`${top.ABT_i18n.errors.prefix}: getFromPMID => ${top.ABT_i18n.errors.statusError}`));
                return;
            }

            const res = JSON.parse(req.responseText);
            const iterable: PubMed.SingleReference[] = [];

            for (const i of Object.keys(res.result)) {
                if (i === 'uids') continue;
                if (res.result[i].error) {
                    res.result.uids = res.result.uids.filter(id => id !== i);
                    continue;
                }
                if (res.result[i].title) {
                    res.result[i].title = res.result[i].title.replace(/(&amp;amp;)/g, '&');
                }
                iterable.push(res.result[i]);
            }

            if (bypassJSONFormatter) {
                resolve(iterable);
                return;
            }

            resolve([
                processPubmedJSON(iterable),
                PMIDlist.split(',').filter(i => res.result.uids.indexOf(i) === -1),
            ]);
        });
        req.addEventListener('error', () => reject(
            new Error(`${top.ABT_i18n.errors.prefix}: getFromPMID => ${top.ABT_i18n.errors.networkError}`)
        ));
        req.send(null);
    });
}
