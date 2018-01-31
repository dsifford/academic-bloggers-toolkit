// tslint:disable: no-stateless-class
import { oneLineTrim } from 'common-tags';
import { decode } from 'he';

interface IDType {
    kind: 'PMID' | 'DOI' | 'PMCID' | 'URL';
    value: string;
}

/**
 * Parses and formats the bibliography links according to the user's chosen
 * link format
 * @param html      - HTML string of a single reference
 * @param style - Selected link style
 * @param id        - Identifier for linking out
 * @returns HTML string with formatted links
 */
export function formatReferenceLinks(
    html: string,
    style: ABT.LinkStyle,
    id?: IDType,
): string {
    if (style === 'never') {
        return html;
    }

    const url: RegExp = /((?:https?:\/\/(?:www\.)?)|(?:www\.))([^;\s<]+[0-9a-zA-Z\/])/g;
    const doi: RegExp = /10\.[0-9]{4,}(?:\.[a-z0-9.]+)?\/\S+[^. ]/gi;
    const matches: Set<string> = new Set();

    const linkedHtml = decode(html)
        .replace(url, (_match, p1, p2) => {
            const u = p1 === 'www.' ? `http://${p2}` : `${p1}${p2}`;
            matches.add(u);
            return `<a href="${u}" target="_blank" rel="noopener noreferrer">${u}</a>`;
        })
        .replace(doi, match => {
            matches.add('DOI');
            return `<a href="https://dx.doi.org/${match}" target="_blank" rel="noopener noreferrer">${match}</a>`;
        });

    if (!id) {
        return linkedHtml;
    }

    switch (style) {
        case 'always':
            if (
                (id.kind === 'DOI' && matches.has('DOI')) ||
                (id.kind === 'URL' && matches.has(id.value))
            ) {
                return linkedHtml;
            }
            return LinkStyle.always(linkedHtml, id);
        case 'always-full-surround':
            return LinkStyle.fullSurround(html, id);
        case 'urls':
        default:
            return linkedHtml;
    }
}

class LinkStyle {
    static always(html: string, id: IDType): string {
        switch (id.kind) {
            case 'PMID': {
                return oneLineTrim`
                    ${html}${' '}
                    <span class="abt-url">
                        [<a href="https://www.ncbi.nlm.nih.gov/pubmed/${
                            id.value
                        }" target="_blank" rel="noopener noreferrer">PubMed</a>]
                    </span>
                `;
            }
            case 'DOI': {
                return oneLineTrim`
                    ${html}${' '}
                    <span class="abt-url">
                        [<a href="https://dx.doi.org/${
                            id.value
                        }" target="_blank" rel="noopener noreferrer">Source</a>]
                    </span>
                `;
            }
            case 'PMCID': {
                return oneLineTrim`
                    ${html}${' '}
                    <span class="abt-url">
                        [<a href="https://www.ncbi.nlm.nih.gov/pmc/articles/${
                            id.value
                        }" target="_blank" rel="noopener noreferrer">PMC</a>]
                    </span>
                `;
            }
            case 'URL':
            default: {
                const sourceText = id.value.toLocaleLowerCase().endsWith('.pdf')
                    ? 'PDF'
                    : top.ABT.i18n.misc.source;
                return oneLineTrim`
                    ${html}${' '}
                    <span class="abt-url">
                        [<a href="${
                            id.value
                        }" target="_blank" rel="noopener noreferrer">
                            ${sourceText}
                        </a>]
                    </span>
                `;
            }
        }
    }
    static fullSurround(html: string, id: IDType): string {
        switch (id.kind) {
            case 'PMID': {
                return oneLineTrim`
                    <a href="https://www.ncbi.nlm.nih.gov/pubmed/${
                        id.value
                    }" target="_blank" rel="noopener noreferrer">
                        ${html}
                    </a>`;
            }
            case 'DOI': {
                return oneLineTrim`
                    <a href="https://dx.doi.org/${
                        id.value
                    }" target="_blank" rel="noopener noreferrer">
                        ${html}
                    </a>`;
            }
            case 'PMCID': {
                return oneLineTrim`
                    <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/${
                        id.value
                    }" target="_blank" rel="noopener noreferrer">
                        ${html}
                    </a>`;
            }
            default: {
                return oneLineTrim`
                    <a href="${
                        id.value
                    }" target="_blank" rel="noopener noreferrer">
                        ${html}
                    </a>`;
            }
        }
    }
}
