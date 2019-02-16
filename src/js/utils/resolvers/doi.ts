import _ from 'lodash';

import { CSL_KEYS, CSL_NUMBER_KEYS, CSL_STRING_KEYS } from 'utils/constants';
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
    const data: any = _.pickBy<CSL.Data>(
        await response.json(),
        (value, key: any) => {
            if (CSL_KEYS.indexOf(key) === -1) {
                return false;
            }
            if (
                CSL_STRING_KEYS.indexOf(key) >= 0 &&
                typeof value !== 'string'
            ) {
                return false;
            }
            if (
                CSL_NUMBER_KEYS.indexOf(key) >= 0 &&
                typeof value !== 'number'
            ) {
                return false;
            }
            return key !== 'abstract';
        },
    );
    return data;
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

    return [[...payload.data], [...payload.invalid]];
}
