import { addQueryArgs } from '@wordpress/url';
import { toCSL } from 'astrocite-eutils';

import { ResponseError } from 'utils/error';

export async function get(
    id: string,
    db: 'pubmed' | 'pmc',
): Promise<CSL.Data | ResponseError> {
    const response = await fetch(
        addQueryArgs(
            'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi',
            {
                id,
                db,
                tool: 'academic-bloggers-toolkit',
                email: 'dereksifford@gmail.com',
                version: '2.0',
                retmode: 'json',
            },
        ),
    );
    if (!response.ok) {
        return new ResponseError(id, response);
    }
    const data = toCSL(await response.json())[0];
    return data instanceof Error ? new ResponseError(id, response) : data;
}
