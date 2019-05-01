import { pickBy } from 'lodash';

import { isCslKey, isCslNumberKey, isCslStringKey } from 'utils/constants';
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
    return pickBy(await response.json(), (value, key) => {
        if (!isCslKey(key) || key === 'abstract') {
            return false;
        }
        if (isCslStringKey(key) && typeof value !== 'string') {
            return false;
        }
        if (isCslNumberKey(key) && typeof value !== 'number') {
            return false;
        }
        return true;
    }) as CSL.Data;
}
