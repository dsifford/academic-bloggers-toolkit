import { processPubmedJSON } from '../HelperFunctions';

/**
 * Sends a string of text to PubMed and resolves PubMed.DataPMID[] for the query.
 * @param {string}     query    A search string (the same you would type into
 *   the search box on pubmed)
 * @return {Promise<PubMed.DataPMID[]>}
 */
export function pubmedQuery(query: string): Promise<PubMed.DataPMID[]> {
    return new Promise<string>((resolve, reject) => {
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

            resolve(res.esearchresult.idlist.join());
        });
        req.addEventListener('error', () => reject(
            new Error(`${top.ABT_i18n.errors.prefix}: pubmedQuery => ${top.ABT_i18n.errors.networkError}`)
        ));
        req.send(null);
    })
    .then(idList => resolvePubmedData('PMID', idList)
    .then(res => res.data));
}

function resolvePubmedData(
    kind: 'PMID'|'PMCID',
    idList: string,
): Promise<{data: PubMed.DataPMID[]|PubMed.DataPMCID[], invalid: string[]}> {
    const database = kind === 'PMID' ? 'pubmed' : 'pmc';
    return new Promise((resolve, reject) => {
        if (idList.length === 0) return resolve([]);

        const req = new XMLHttpRequest();
        req.open('GET', `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?tool=academic-bloggers-toolkit&email=dereksifford%40gmail.com&db=${database}&id=${idList}&version=2.0&retmode=json`); // tslint:disable-line
        req.addEventListener('load', () => {

            if (req.status !== 200) {
                reject(
                    new Error(`${top.ABT_i18n.errors.prefix}: resolvePubmedData => ${top.ABT_i18n.errors.statusError}`)
                );
                return;
            }

            const res = JSON.parse(req.responseText);
            const iterable = [];

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

            return resolve({
                data: iterable,
                invalid: idList.split(',').filter(i => res.result.uids.indexOf(i) === -1),
            });
        });
        req.addEventListener('error', () => reject(
            new Error(`${top.ABT_i18n.errors.prefix}: resolvePubmedData => ${top.ABT_i18n.errors.networkError}`)
        ));
        req.send(null);
    });
}

export function getFromPubmed(kind: 'PMID'|'PMCID', idList: string): Promise<[CSL.Data[], string[]]> {
    return new Promise<[CSL.Data[], string[]]>(resolve => {
        resolvePubmedData(kind, idList)
        .then(res => {
            if (res.data.length === 0) return resolve([[], []]);
            return resolve([
                processPubmedJSON(kind, res.data),
                res.invalid,
            ]);
        });
    });
}
