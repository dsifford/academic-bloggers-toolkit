/**
 * Retrieves CSL.Data from CrossRef using DOI identifiers and resolves a tuple
 *   in the form of [validCSLData[], invalidDOIStrings[]].
 *
 * @param doiList - Array of DOI strings
 * @return Tuple in the form described above
 */
export async function getFromDOI(doiList: string[]): Promise<[CSL.Data[], string[]]> {
    let promises: Array<Promise<CSL.Data | string>> = [];
    let csl: CSL.Data[] = [];
    let errs: string[] = [];

    for (const doi of doiList) {
        promises = [
            ...promises,
            getDOIAgency(doi).then(resolveDOI).catch(e => {
                if (typeof e === 'string') return e;
                throw e;
            }),
        ];
    }

    const data = await Promise.all(promises);
    for (const i of data) {
        if (typeof i === 'string') {
            errs = [...errs, i];
        } else {
            csl = [...csl, i];
        }
    }

    return [csl, errs];
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
async function getDOIAgency(doi: string): Promise<AgencyResponse> {
    const req = await fetch(`https://api.crossref.org/works/${doi}/agency`);
    if (!req.ok) throw doi;
    const res = await req.json();
    return { agency: res.message.agency.id, doi };
}

/**
 * Takes a DOI agency and DOI string as input and resolves it to CSL using the respective API
 * @param data.agency - A valid DOI agency
 * @param data.doi    - DOI string
 * @return Promise which resolves to a tuple of valid CSL.Data and invalid DOIs
 */
async function resolveDOI({ agency, doi }: AgencyResponse): Promise<CSL.Data> {
    let url: string;
    const headers = new Headers();
    switch (agency) {
        case 'crossref':
            url = `https://api.crossref.org/v1/works/${doi}/transform/application/vnd.citationstyles.csl+json`;
            break;
        case 'datacite':
            url = `https://data.datacite.org/application/vnd.citationstyles.csl+json/${doi}`;
            break;
        case 'medra':
            url = `https://data.medra.org/${doi}`;
            headers.append('accept', 'application/vnd.citationstyles.csl+json;q=1.0');
            break;
        default:
            throw doi;
    }
    const req = await fetch(url, { headers });
    if (!req.ok) throw doi;
    const res: CSL.Data = { ...await req.json(), id: '0' };

    if (res['short-container-title']) {
        res['journalAbbreviation'] = res['short-container-title']![0];
    }

    return res;
}
