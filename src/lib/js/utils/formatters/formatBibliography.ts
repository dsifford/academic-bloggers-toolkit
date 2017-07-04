import { ObservableMap } from 'mobx';
import { formatReferenceLinks } from './formatReferenceLinks';

/**
 * Wrapper function for citeproc.makeBibliography that takes the output and
 *   inlines CSS classes that are appropriate for the style (according to the
 *   generated bibmeta).
 *
 * @param {'always'|'urls'|'never'} links   Link format
 * @param {Citeproc.Bibliography} rawBib    Raw output from citeproc.makeBibliography()
 * @return {ABT.Bibliography}
 */
export function formatBibliography(
    rawBib: Citeproc.Bibliography,
    links: ABT.LinkStyle,
    CSL: ObservableMap<CSL.Data>
): ABT.Bibliography {
    const [bibmeta, bibHTML] = rawBib;
    const temp = document.createElement('div');

    const payload: { id: string; html: string }[] = bibHTML.map((html, i) => {
        if (/CSL STYLE ERROR/.test(html)) {
            return { html, id: bibmeta.entry_ids[i][0] };
        }

        temp.innerHTML = html;

        /**
         * The outermost <div> element -> (class="csl-entry")
         */
        const el = <HTMLDivElement>temp.firstElementChild;
        const item: CSL.Data = CSL.get(bibmeta.entry_ids[i][0]);

        if (bibmeta.hangingindent) {
            el.classList.add('hanging-indent');
        }

        if (bibmeta.entryspacing > 1) {
            el.style.lineHeight = `${bibmeta.entryspacing}`;
        }

        if (bibmeta.linespacing > 1) {
            el.style.margin = `${bibmeta.linespacing - 1}em auto`;
        }

        switch (bibmeta['second-field-align']) {
            case 'margin':
                el.classList.add('margin');
                break;
            case 'flush':
                el.classList.add('flush');
                break;
            default:
                break;
        }

        const innerEl = el.querySelector('.csl-right-inline') || el;
        const innerHTML = innerEl.innerHTML;
        switch (true) {
            case item.PMID !== undefined &&
                !new RegExp(item.PMID).test(innerHTML): {
                innerEl.innerHTML = formatReferenceLinks(innerHTML, links, {
                    kind: 'PMID',
                    value: item.PMID,
                });
                break;
            }
            case item.DOI !== undefined &&
                !new RegExp(item.DOI).test(innerHTML): {
                innerEl.innerHTML = formatReferenceLinks(innerHTML, links, {
                    kind: 'DOI',
                    value: item.DOI,
                });
                break;
            }
            case item.PMCID !== undefined &&
                !new RegExp(item.PMCID).test(innerHTML): {
                innerEl.innerHTML = formatReferenceLinks(innerHTML, links, {
                    kind: 'PMCID',
                    value: item.PMCID,
                });
                break;
            }
            case item.URL !== undefined &&
                !new RegExp(item.URL).test(innerHTML) &&
                !/https?:\/\/(?:www\.)?(?:dx\.)?doi.org\//.test(item.URL): {
                // tslint:disable-line
                innerEl.innerHTML = formatReferenceLinks(innerHTML, links, {
                    kind: 'URL',
                    value: item.URL,
                });
                break;
            }
            default: {
                innerEl.innerHTML = formatReferenceLinks(innerHTML, links);
                break;
            }
        }

        return { html: temp.innerHTML, id: bibmeta.entry_ids[i][0] };
    });
    temp.remove();
    return payload;
}
