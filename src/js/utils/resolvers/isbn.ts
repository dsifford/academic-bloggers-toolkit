import { addQueryArgs } from '@wordpress/url';
import { toCSL } from 'astrocite-googlebooks';

import { ResponseError } from 'utils/error';

export async function get(
    ISBN: string,
    isChapter = false,
): Promise<CSL.Data | ResponseError> {
    const response = await fetch(
        addQueryArgs('https://www.googleapis.com/books/v1/volumes', {
            q: `isbn:${ISBN.replace(/-/g, '')}`,
        }),
    );
    if (!response.ok) {
        return new ResponseError(ISBN, response);
    }
    const data = toCSL(await response.json(), isChapter);
    if (data.length === 0) {
        return new ResponseError(ISBN, response);
    }
    return data[0];
}
