import _ from 'lodash';

import { CSL_DATA_KEYS } from 'utils/constants';
import { ResponseError } from 'utils/error';

export async function get(doi: string): Promise<CSL.Data | ResponseError> {
    const response = await fetch(`https://doi.org/${encodeURIComponent(doi)}`, {
        headers: {
            accept: 'application/vnd.citationstyles.csl+json',
        },
    });
    if (!response.ok) {
        return new ResponseError(doi, response);
    }
    return _.pick(await response.json(), CSL_DATA_KEYS);
}

/**
 * Retrieves CSL.Data from CrossRef using DOI identifiers and resolves a tuple
 *   in the form of [validCSLData[], invalidDOIStrings[]].
 *
 * @param doiList - Array of DOI strings
 * @return Tuple in the form described above
 * @deprecated
 */
export async function deprecatedGetFromDOI(
    doiList: string[],
): Promise<[CSL.Data[], string[]]> {
    const payload = {
        data: new Set(),
        invalid: new Set(),
    };

    const headers = new Headers({
        Accept: 'application/vnd.citationstyles.csl+json',
    });

    for (const doi of doiList) {
        const url = `https://doi.org/${encodeURIComponent(doi)}`;
        const req = await fetch(url, { headers });
        if (!req.ok) {
            payload.invalid.add(doi);
            continue;
        }
        const res: CSL.Data = { ...(await req.json()), id: '0' };

        if (res['container-title-short']) {
            res.journalAbbreviation = res['container-title-short']![0];
        }

        payload.data.add(res);
    }

    // FIXME: Change this to something more maintainable
    return [[...payload.data], [...payload.invalid]];
}
