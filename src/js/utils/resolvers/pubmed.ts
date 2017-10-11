import { EUtilsError, toCSL } from 'astrocite-eutils';

/**
 * Sends a string of text to PubMed and resolves PubMed.DataPMID[] for the query.
 * @param query - A search string (the same you would type into
 *   the search box on pubmed)
 * @return Promise that resolves to an array of PubMed Response
 */
export async function pubmedQuery(query: string): Promise<CSL.Data[]> {
    const req = await fetch(
        `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURI(
            query,
        )}&retmode=json`,
    );
    if (!req.ok) throw new Error(req.statusText);
    const res = await req.json();

    if (res.error) {
        throw new Error(
            `${top.ABT.i18n.errors.prefix}: pubmedQuery => ${top.ABT.i18n.errors.badRequest}`,
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
        return [data, invalid.map(i => (i.apiError ? i.message : `${i.uid}: ${i.message}`))];
    } catch (e) {
        if (typeof e === 'string') return [[], []];
        throw e;
    }
}

interface ResolvedData {
    data: CSL.Data[];
    invalid: EUtilsError[];
}

async function resolvePubmedData(kind: 'PMID' | 'PMCID', idList: string): Promise<ResolvedData> {
    if (idList.length === 0) throw 'No ids to resolve';
    const database = kind === 'PMID' ? 'pubmed' : 'pmc';
    const req = await fetch(
        `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?tool=academic-bloggers-toolkit&email=dereksifford%40gmail.com&db=${database}&id=${idList}&version=2.0&retmode=json`,
    );
    if (!req.ok) throw new Error(req.statusText);
    const res = await req.json();
    const parsed = toCSL(res);
    const invalid = <EUtilsError[]>parsed.filter(entry => entry instanceof Error);
    const data = <CSL.Data[]>parsed.filter(entry => entry instanceof Error === false);
    return {
        data,
        invalid,
    };
}
