import { addQueryArgs } from '@wordpress/url';
import { EUtilsError, toCSL } from 'astrocite-eutils';
import { oneLineTrim } from 'common-tags';

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
    // FIXME: Fix in astrocite
    return data instanceof Error
        ? new ResponseError(id, response)
        : <CSL.Data>{
              ...data,
              URL:
                  db === 'pubmed'
                      ? `https://www.ncbi.nlm.nih.gov/pubmed/${id}`
                      : `https://www.ncbi.nlm.nih.gov/pmc/articles/${id}`,
          };
}

/**
 * Sends a string of text to PubMed and resolves PubMed.DataPMID[] for the query.
 * @param query - A search string (the same you would type into
 *   the search box on pubmed)
 * @return Promise that resolves to an array of PubMed Response
 * @deprecated
 */
export async function deprecatedPubmedQuery(
    query: string,
): Promise<CSL.Data[]> {
    const req = await fetch(
        oneLineTrim`
            https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi
                ?db=pubmed
                &term=${encodeURIComponent(query)}
                &retmode=json
        `,
    );
    if (!req.ok) {
        throw new Error(req.statusText);
    }
    const res = await req.json();

    if (res.error) {
        throw new Error(
            `${top.ABT.i18n.errors.prefix}: pubmedQuery => ${
                top.ABT.i18n.errors.bad_request
            }`,
        );
    }

    try {
        const pubmed = await resolvePubmedData(
            'PMID',
            res.esearchresult.idlist.join(),
        );
        return pubmed.data;
    } catch (e) {
        if (typeof e === 'string') {
            return [];
        }
        throw e;
    }
}

/**
 * @deprecated
 */
export async function deprecatedGetFromPubmed(
    kind: 'PMID' | 'PMCID',
    idList: string,
): Promise<[CSL.Data[], string[]]> {
    try {
        const { data, invalid }: ResolvedData = await resolvePubmedData(
            kind,
            idList,
        );
        return [
            data,
            invalid.map(i =>
                i.apiError ? i.message : `${i.uid}: ${i.message}`,
            ),
        ];
    } catch (e) {
        if (typeof e === 'string') {
            return [[], []];
        }
        throw e;
    }
}

interface ResolvedData {
    data: CSL.Data[];
    invalid: EUtilsError[];
}

/**
 * @deprecated
 */
async function resolvePubmedData(
    kind: 'PMID' | 'PMCID',
    idList: string,
): Promise<ResolvedData> {
    if (idList.length === 0) {
        // tslint:disable-next-line:no-string-throw
        throw 'No ids to resolve';
    }
    const database = kind === 'PMID' ? 'pubmed' : 'pmc';
    const req = await fetch(
        oneLineTrim`
            https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi
                ?tool=academic-bloggers-toolkit
                &email=${encodeURIComponent('dereksifford@gmail.com')}
                &db=${database}
                &id=${encodeURIComponent(idList)}
                &version=2.0
                &retmode=json
        `,
    );
    if (!req.ok) {
        throw new Error(req.statusText);
    }
    const res = await req.json();
    const parsed = toCSL(res);
    const invalid = <EUtilsError[]>(
        parsed.filter(entry => entry instanceof Error)
    );
    const data = <CSL.Data[]>(
        parsed.filter(entry => entry instanceof Error === false)
    );
    return {
        data,
        invalid,
    };
}
