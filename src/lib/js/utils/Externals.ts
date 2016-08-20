import { processPubmedJSON } from './HelperFunctions';

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
 * @param {boolean}    bypassJSONFormatter A boolean (default = false) which
 *   decides whether or not to send the response to be processed as CSL.
 * @return {Promise<PubMed.SingleReference[]|[CSL.Data[], string[]]>}
 */
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
                processPubmedJSON(iterable),
                PMIDlist.split(',').filter(i => res.result.uids.indexOf(i) === -1),
            ]);

        };
        req.onerror = () => reject(new Error('Error: getFromPMID => Network Error.'));
        req.send(null);
    });
}

/**
 * Retrieves CSL.Data from CrossRef using DOI identifiers and resolves a tuple
 *   in the form of [validCSLData[], invalidDOIStrings[]].
 *
 * @param  doiList Array of DOI strings
 * @return Promise tuple in the form described above
 */
export function getFromDOI(doiList: string[]): Promise<[CSL.Data[], string[]]> {
    return new Promise((resolve, reject) => {
        const promises: Promise<[CSL.Data, string]>[] = [];

        doiList.forEach(doi => {
            promises.push(
                new Promise<[CSL.Data, string]>((resolveInner, rejectInner) => { // tslint:disable-next-line
                    const url = `https://api.crossref.org/v1/works/${doi}/transform/application/vnd.citationstyles.csl+json`;
                    const req = new XMLHttpRequest();
                    req.open('GET', url, true);
                    req.onload = () => {
                        if (req.status !== 200) resolveInner([null, doi]);

                        const res: CSL.Data = JSON.parse(req.responseText);
                        res.id = '0';
                        resolveInner([res, null]);
                    };
                    req.onerror = () => rejectInner(new Error('Error: getFromDOI => Network Error.'));
                    req.send(null);
                })
            );
        });

        Promise.all(promises).then(data => {
            resolve([
                data.map(d => d[0]).filter(d => d),
                data.map(d => d[1]).filter(d => d),
            ]);
        }, (err: Error) => {
            reject(err);
        });
    });
}
