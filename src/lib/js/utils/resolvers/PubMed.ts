import { parsePubmedJSON } from '../parsers/';

/**
 * Sends a string of text to PubMed and resolves PubMed.DataPMID[] for the query.
 * @param query - A search string (the same you would type into
 *   the search box on pubmed)
 * @return Promise that resolves to an array of PubMed Response
 */
export function pubmedQuery(query: string): Promise<PubMed.Response[]> {
    return new Promise<string>((resolve, reject) => {
        const req = new XMLHttpRequest();
        req.open(
            'GET',
            `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURI(
                query
            )}&retmode=json`
        );
        req.addEventListener('load', () => {
            if (req.status !== 200) {
                return reject(
                    new Error(
                        `${top.ABT_i18n.errors.prefix}: pubmedQuery => ${top
                            .ABT_i18n.errors.statusError}`
                    )
                );
            }

            const res = JSON.parse(req.responseText);

            if (res.error) {
                return reject(
                    new Error(
                        `${top.ABT_i18n.errors.prefix}: pubmedQuery => ${top
                            .ABT_i18n.errors.badRequest}`
                    )
                );
            }

            resolve(res.esearchresult.idlist.join());
        });
        req.addEventListener('error', () =>
            reject(
                new Error(
                    `${top.ABT_i18n.errors.prefix}: pubmedQuery => ${top
                        .ABT_i18n.errors.networkError}`
                )
            )
        );
        req.send(null);
    }).then(idList =>
        resolvePubmedData('PMID', idList).then(res => res.data).catch(e => {
            if (typeof e === 'string') {
                return [];
            }
            throw e;
        })
    );
}

export function getFromPubmed(
    kind: 'PMID' | 'PMCID',
    idList: string
): Promise<[CSL.Data[], string[]]> {
    return new Promise<[CSL.Data[], string[]]>(resolve => {
        resolvePubmedData(kind, idList)
            .then(res =>
                resolve([parsePubmedJSON(kind, res.data), res.invalid])
            )
            .catch(e => {
                if (typeof e === 'string') {
                    return [[], []];
                }
                throw e;
            });
    });
}

interface ResolvedData {
    data: PubMed.Response[];
    invalid: string[];
}

function resolvePubmedData(
    kind: 'PMID' | 'PMCID',
    idList: string
): Promise<ResolvedData> {
    const database = kind === 'PMID' ? 'pubmed' : 'pmc';
    return new Promise((resolve, reject) => {
        if (idList.length === 0) return reject('No ids to resolve');

        const req = new XMLHttpRequest();
        req.open(
            'GET',
            `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?tool=academic-bloggers-toolkit&email=dereksifford%40gmail.com&db=${database}&id=${idList}&version=2.0&retmode=json`
        );
        req.addEventListener('load', () => {
            if (req.status !== 200) {
                return reject(
                    new Error(
                        `${top.ABT_i18n.errors
                            .prefix}: resolvePubmedData => ${top.ABT_i18n.errors
                            .statusError}`
                    )
                );
            }

            const res = JSON.parse(req.responseText);
            const iterable: any = [];

            for (const i of Object.keys(res.result)) {
                if (i === 'uids') continue;
                if (res.result[i].error) {
                    res.result.uids = res.result.uids.filter(id => id !== i);
                    continue;
                }
                if (res.result[i].title) {
                    res.result[i].title = res.result[i].title.replace(
                        /(&amp;amp;)/g,
                        '&'
                    );
                }
                iterable.push(res.result[i]);
            }

            resolve({
                data: iterable,
                invalid: idList
                    .split(',')
                    .filter(i => res.result.uids.indexOf(i) === -1),
            });
        });
        req.addEventListener('error', () =>
            reject(
                new Error(
                    `${top.ABT_i18n.errors.prefix}: resolvePubmedData => ${top
                        .ABT_i18n.errors.networkError}`
                )
            )
        );
        req.send(null);
    });
}
