import { parsePubmedJSON } from '../parsers/';

/**
 * Sends a string of text to PubMed and resolves PubMed.DataPMID[] for the query.
 * @param query - A search string (the same you would type into
 *   the search box on pubmed)
 * @return Promise that resolves to an array of PubMed Response
 */
export async function pubmedQuery(query: string): Promise<PubMed.Response[]> {
    const req = await fetch(
        `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURI(
            query,
        )}&retmode=json`,
    );
    if (!req.ok) throw new Error(req.statusText);
    const res = await req.json();

    if (res.error) {
        throw new Error(
            `${top.ABT_i18n.errors.prefix}: pubmedQuery => ${top.ABT_i18n.errors.badRequest}`,
        );
    }

    try {
        const pubmed = await resolvePubmedData('PMID', res.esearchresult.idlist.join());
        return pubmed.data;
    } catch (e) {
        if (typeof e === 'string') return [];
        throw e;
    }
}

export async function getFromPubmed(
    kind: 'PMID' | 'PMCID',
    idList: string,
): Promise<[CSL.Data[], string[]]> {
    try {
        const { data, invalid }: ResolvedData = await resolvePubmedData(kind, idList);
        return [parsePubmedJSON(kind, data), invalid];
    } catch (e) {
        if (typeof e === 'string') return [[], []];
        throw e;
    }
}

interface ResolvedData {
    data: PubMed.Response[];
    invalid: string[];
}

async function resolvePubmedData(kind: 'PMID' | 'PMCID', idList: string): Promise<ResolvedData> {
    if (idList.length === 0) throw 'No ids to resolve';
    const database = kind === 'PMID' ? 'pubmed' : 'pmc';
    const req = await fetch(
        `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?tool=academic-bloggers-toolkit&email=dereksifford%40gmail.com&db=${database}&id=${idList}&version=2.0&retmode=json`,
    );
    if (!req.ok) throw new Error(req.statusText);
    const res = await req.json();
    const iterable: any = [];

    for (const i of Object.keys(res.result)) {
        if (i === 'uids') continue;
        if (res.result[i].error) {
            res.result.uids = res.result.uids.filter((id: string) => id !== i);
            continue;
        }
        if (res.result[i].title) {
            res.result[i].title = res.result[i].title.replace(/(&amp;amp;)/g, '&');
        }
        iterable.push(res.result[i]);
    }

    return {
        data: iterable,
        invalid: idList.split(',').filter(i => !res.result.uids.includes(i)),
    };
}
