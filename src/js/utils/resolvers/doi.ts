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
