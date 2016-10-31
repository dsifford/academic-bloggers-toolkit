// tslint:disable:export-name

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
        doiList.forEach(doi => promises.push(getDOIAgency(doi).then(resolveDOI)));
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

/**
 * Takes a DOI string as input and resolves the DOI agency
 * @param  {string}  doi DOI string
 * @return {Promise<{agency: 'crossref'|'datacite'|'medra', doi: string}>}
 */
function getDOIAgency(doi: string): Promise<{agency: 'crossref'|'datacite'|'medra', doi: string}> {
    return new Promise<{agency: 'crossref'|'datacite'|'medra', doi: string}>((resolve, reject) => {
        const url = `https://api.crossref.org/works/${doi}/agency`;
        const req = new XMLHttpRequest();
        req.open('GET', url);
        req.addEventListener('load', () => {
            if (req.status !== 200) {
                resolve({ agency: null, doi });
                return;
            }
            const res: CrossRef.Agency = JSON.parse(req.responseText);
            resolve({ agency: res.message.agency.id, doi });
        });
        req.addEventListener('error', () => reject(
            new Error(`${top.ABT_i18n.errors.prefix}: getDOIAgency => ${top.ABT_i18n.errors.networkError}`)
        ));
        req.send(null);
    });
}

/**
 * Takes a DOI agency and DOI string as input and resolves it to CSL using the respective API
 * @param  {'crossref'|'datacite'|'medra'} data.agency  A valid DOI agency
 * @param  {string} data.doi  DOI string
 * @return {Promise}  Promise which resolves to a tuple of valid CSL.Data and invalid DOIs
 */
function resolveDOI(data: {
    agency: ('crossref'|'datacite'|'medra') & string,
    doi: string,
}): Promise<[CSL.Data, string]> {
    return new Promise<[CSL.Data, string]>((resolve, reject) => {
        const req = new XMLHttpRequest();
        const headers: [string, string][] = [];
        let url: string;
        switch (data.agency) {
            case 'crossref':
                url = `https://api.crossref.org/v1/works/${data.doi}/transform/application/vnd.citationstyles.csl+json`;
                break;
            case 'datacite':
                url = `https://data.datacite.org/application/vnd.citationstyles.csl+json/${data.doi}`;
                break;
            case 'medra':
                url = `http://data.medra.org/${data.doi}`;
                headers.push(['accept', 'application/vnd.citationstyles.csl+json;q=1.0']);
                break;
            default:
                resolve([null, data.doi]);
                return;
        }
        req.open('GET', url);
        headers.forEach(h => req.setRequestHeader(h[0], h[1]));
        req.addEventListener('load', () => {
            if (req.status !== 200) {
                resolve([null, data.doi]);
                return;
            }
            const res: CSL.Data = JSON.parse(req.responseText);
            res.id = '0';
            resolve([res, null]);
        });
        req.addEventListener('error', () => reject(
            new Error(`${top.ABT_i18n.errors.prefix}: resolveDOI => ${top.ABT_i18n.errors.networkError}`)
        ));
        req.send(null);
    });
}
