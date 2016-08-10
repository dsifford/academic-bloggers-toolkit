
/**
 * Retrieves CSL.Data from CrossRef using DOI identifiers and resolves a tuple
 *   in the form of [validCSLData[], invalidDOIStrings[]].
 *
 * @param  doiList Array of DOI strings
 * @return Promise tuple in the form described above
 */
export function getFromDOI(doiList: string[]): Promise<[CSL.Data[], string[]]> {
    return new Promise((resolve, reject) => {
        const promises: Promise<[CSL.Data, string]>[] = [];

        doiList.forEach(doi => {
            promises.push(
                new Promise<[CSL.Data, string]>((resolveInner, rejectInner) => { // tslint:disable-next-line
                    const url = `https://api.crossref.org/v1/works/${doi}/transform/application/vnd.citationstyles.csl+json`;
                    const req = new XMLHttpRequest();
                    req.open('GET', url, true);
                    req.onload = () => {
                        if (req.status !== 200) resolveInner([null, doi]);

                        const res: CSL.Data = JSON.parse(req.responseText);
                        res.id = '0';
                        resolveInner([res, null]);
                    };
                    req.onerror = () => rejectInner(new Error('Error: getFromDOI => Network Error.'));
                    req.send(null);
                })
            );
        });

        Promise.all(promises).then(data => {
            resolve([
                data.map(d => d[0]).filter(d => d),
                data.map(d => d[1]).filter(d => d),
            ]);
        }, (err: Error) => {
            reject(err);
        });
    });
}
