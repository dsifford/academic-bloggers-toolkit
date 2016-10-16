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

        doiList.forEach(doi => {
            promises.push(
                getDOIAgency(doi)
                .then(data => {
                    switch (data.agency) {
                        case 'crossref':
                            return resolveCrossRef(data.doi);
                        case 'datacite':
                            return resolveDataCite(data.doi);
                        case 'medra':
                            return resolveMedra(data.doi);
                        default:
                            return;
                    }
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

function getDOIAgency(doi: string): Promise<{agency: 'crossref'|'datacite'|'medra', doi: string}> {
    return new Promise<{agency: 'crossref'|'datacite'|'medra', doi: string}>((resolve, reject) => {
        const url = `http://api.crossref.org/works/${doi}/agency`;
        const req = new XMLHttpRequest();
        req.open('GET', url);
        req.addEventListener('load', () => {
            if (req.status !== 200) {
                reject(new Error(`${top.ABT_i18n.errors.prefix}: getDOIAgency => ${top.ABT_i18n.errors.statusError}`));
                return;
            }
            const res: CrossRef.Agency = JSON.parse(req.responseText);
            resolve({agency: res.message.agency.id, doi });
        });
        req.addEventListener('error', () => reject(
            new Error(`${top.ABT_i18n.errors.prefix}: getDOIAgency => ${top.ABT_i18n.errors.networkError}`)
        ));
        req.send(null);
    });
}

function resolveCrossRef(doi: string): Promise<[CSL.Data, string]> {
    return new Promise<[CSL.Data, string]>((resolve, reject) => {
        const url = `https://api.crossref.org/v1/works/${doi}/transform/application/vnd.citationstyles.csl+json`;
        const req = new XMLHttpRequest();
        req.open('GET', url);
        req.addEventListener('load', () => {
            if (req.status !== 200) {
                resolve([null, doi]);
                return;
            }
            const res: CSL.Data = JSON.parse(req.responseText);
            res.id = '0';
            resolve([res, null]);
        });
        req.addEventListener('error', () => reject(
            new Error(`${top.ABT_i18n.errors.prefix}: resolveCrossRef => ${top.ABT_i18n.errors.networkError}`)
        ));
        req.send(null);
    });
}

function resolveDataCite(doi: string): Promise<[CSL.Data, string]> {
    return new Promise<[CSL.Data, string]>((resolve, reject) => {
        const url = `http://data.datacite.org/application/vnd.citationstyles.csl+json/${doi}`;
        const req = new XMLHttpRequest();
        req.open('GET', url);
        req.addEventListener('load', () => {
            if (req.status !== 200) {
                resolve([null, doi]);
                return;
            }
            const res: CSL.Data = JSON.parse(req.responseText);
            res.id = '0';
            resolve([res, null]);
        });
        req.addEventListener('error', () => reject(
            new Error(`${top.ABT_i18n.errors.prefix}: resolveDataCite => ${top.ABT_i18n.errors.networkError}`)
        ));
        req.send(null);
    });
}

function resolveMedra(doi: string): Promise<[CSL.Data, string]> {
    return new Promise<[CSL.Data, string]>((resolve, reject) => {
        const req = new XMLHttpRequest();
        const data = `action=get_medra_doi&doi=${encodeURIComponent(doi)}`;
        req.open('POST', (<any>top).ajaxurl);
        req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        req.addEventListener('load', () => {
            if (req.status !== 200) {
                resolve([null, doi]);
                return;
            }
            const res: CSL.Data = JSON.parse(req.responseText);
            res.id = '0';
            resolve([res, null]);
        });
        req.addEventListener('error', () => reject(
            new Error(`${top.ABT_i18n.errors.prefix}: resolveMedra => ${top.ABT_i18n.errors.networkError}`)
        ));
        req.send(data);
    });
}
