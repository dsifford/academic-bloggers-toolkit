/**
 * Parses and formats the bibliography links according to the user's chosen
 *   link format.
 * @param  {string} html                    HTML string of a single reference
 * @param  {ABT.LinkStyle} linkStyle        Selected link style
 * @param  {'PMID'|'DOI'|'PMCID'|'URL'} id  Identifier for linking out
 * @return {string}  HTML string with formatted links
 */
export function formatReferenceLinks(
    html: string,
    linkStyle: ABT.LinkStyle,
    id?: { kind: 'PMID'|'DOI'|'PMCID'|'URL', value: string },
): string {

    if (linkStyle === 'never') return html;

    const url: RegExp = /((http:\/\/(?:www\.)?|https:\/\/(?:www\.)?)|www\.)([^;\s<]+[0-9a-zA-Z\/])/g;
    const doi: RegExp = /doi:(\S+)\./g;

    const linkedHtml = html
        .replace(/(&lt;|&amp;|&gt;|&quot;)/g, (match) => {
            switch (match) {
                case '&lt;':
                    return '<';
                case '&gt;':
                    return '>';
                case '&amp;':
                    return '&';
                case '&quot;':
                default:
                    return '"';
            }
        })
        .replace(url, (_match, _p1, p2 = 'http://', p3) => `<a href="${p2}${p3}" target="_blank">${p2}${p3}</a>`)
        .replace(doi, 'doi: <a href="https://dx.doi.org/$1" target="_blank">$1</a>');

    if (!id) return linkedHtml;

    switch (linkStyle) {
        case 'always': {
            switch (id.kind) {
                case 'PMID': {
                    return linkedHtml +
                        `<span class="abt-url"> ` +
                            `[<a href="https://www.ncbi.nlm.nih.gov/pubmed/${id.value}" target="_blank">PubMed</a>]` +
                        `</span>`;
                }
                case 'DOI': {
                    return linkedHtml +
                        `<span class="abt-url"> ` +
                            `[<a href="https://dx.doi.org/${id.value}" target="_blank">Source</a>]` +
                        `</span>`;
                }
                case 'PMCID': {
                    return linkedHtml +
                        `<span class="abt-url"> ` + // tslint:disable-next-line
                            `[<a href="https://www.ncbi.nlm.nih.gov/pmc/articles/${id.value}" target="_blank">PMC</a>]` +
                        `</span>`;
                }
                case 'URL':
                default: {
                    return linkedHtml +
                        `<span class="abt-url"> ` +
                            `[<a href="${id.value}" target="_blank">Source</a>]` +
                        `</span>`;
                }
            }
        }
        case 'always-full-surround': {
            switch (id.kind) {
                case 'PMID': {
                    return `<a href="https://www.ncbi.nlm.nih.gov/pubmed/${id.value}" target="_blank">${html}</a>`;
                }
                case 'DOI': {
                    return `<a href="https://dx.doi.org/${id.value}" target="_blank">${html}</a>`;
                }
                case 'PMCID': {
                    return `<a href="https://www.ncbi.nlm.nih.gov/pmc/articles/${id.value}" target="_blank">${html}</a>`; // tslint:disable-line
                }
                case 'URL':
                default: {
                    return `<a href="${id.value}" target="_blank">${html}</a>`;
                }
            }
        }
        case 'urls':
        default: {
            return linkedHtml;
        }
    }
}
