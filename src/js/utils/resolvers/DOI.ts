/**
 * Retrieves CSL.Data from CrossRef using DOI identifiers and resolves a tuple
 *   in the form of [validCSLData[], invalidDOIStrings[]].
 *
 * @param doiList - Array of DOI strings
 * @return Tuple in the form described above
 */
export function getFromDOI(doiList: string[]): Promise<[CSL.Data[], string[]]> {
    return new Promise((resolve, reject) => {
        const promises: Array<Promise<CSL.Data | string>> = [];
        doiList.forEach(doi =>
            promises.push(
                getDOIAgency(doi).then(resolveDOI).catch(e => {
                    if (typeof e === 'string') {
                        return e;
                    }
                    throw e;
                })
            )
        );
        Promise.all(promises).then(
            data => {
                let csl: CSL.Data[] = [];
                let errs: string[] = [];
                for (const i of data) {
                    if (typeof i === 'string') {
                        errs = [...errs, i];
                    } else {
                        csl = [...csl, i];
                    }
                }
                resolve([csl, errs]);
            },
            (err: Error) => {
                reject(err);
            }
        );
    });
}

interface AgencyResponse {
    agency: 'crossref' | 'datacite' | 'medra';
    doi: string;
}

/**
 * Takes a DOI string as input and resolves the DOI agency
 * @param doi - DOI string
 * @return Promise with AgencyResponse interface
 */
function getDOIAgency(doi: string): Promise<AgencyResponse> {
    return new Promise<AgencyResponse>((resolve, reject) => {
        const url = `https://api.crossref.org/works/${doi}/agency`;
        const req = new XMLHttpRequest();
        req.open('GET', url);
        req.addEventListener('load', () => {
            if (req.status !== 200) {
                reject(doi);
                return;
            }
            const res = JSON.parse(req.responseText);
            resolve({ agency: res.message.agency.id, doi });
        });
        req.addEventListener('error', () =>
            reject(
                new Error(
                    `${top.ABT_i18n.errors.prefix}: getDOIAgency => ${top
                        .ABT_i18n.errors.networkError}`
                )
            )
        );
        req.send(null);
    });
}

/**
 * Takes a DOI agency and DOI string as input and resolves it to CSL using the respective API
 * @param data.agency - A valid DOI agency
 * @param data.doi    - DOI string
 * @return Promise which resolves to a tuple of valid CSL.Data and invalid DOIs
 */
function resolveDOI({ agency, doi }: AgencyResponse): Promise<CSL.Data> {
    return new Promise<CSL.Data>((resolve, reject) => {
        const req = new XMLHttpRequest();
        const headers: Array<[string, string]> = [];
        let url: string;
        switch (agency) {
            case 'crossref':
                url = `https://api.crossref.org/v1/works/${doi}/transform/application/vnd.citationstyles.csl+json`;
                break;
            case 'datacite':
                url = `https://data.datacite.org/application/vnd.citationstyles.csl+json/${doi}`;
                break;
            case 'medra':
                url = `https://data.medra.org/${doi}`;
                headers.push([
                    'accept',
                    'application/vnd.citationstyles.csl+json;q=1.0',
                ]);
                break;
            default:
                reject(doi);
                return;
        }
        req.open('GET', url);
        headers.forEach(h => req.setRequestHeader(h[0], h[1]));
        req.addEventListener('load', () => {
            if (req.status !== 200) return reject(doi);

            const res: CSL.Data = { ...JSON.parse(req.responseText), id: '0' };

            if (res['short-container-title']) {
                res['journalAbbreviation'] = res['short-container-title'][0];
            }

            resolve(res);
        });
        req.addEventListener('error', () =>
            reject(
                new Error(
                    `${top.ABT_i18n.errors.prefix}: resolveDOI => ${top.ABT_i18n
                        .errors.networkError}`
                )
            )
        );
        req.send(null);
    });
}
