/**
 * Retrieves CSL.Data from CrossRef using DOI identifiers and resolves a tuple
 *   in the form of [validCSLData[], invalidDOIStrings[]].
 *
 * @param doiList - Array of DOI strings
 * @return Tuple in the form described above
 */
export async function getFromDOI(
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
