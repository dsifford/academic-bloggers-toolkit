// tslint:disable:no-unused-expression
import domReady from '@wordpress/dom-ready';
import Tooltip from 'tooltip.js';

import { getJSONScriptData } from 'utils/dom';
import { CitationElement, FootnoteElement } from 'utils/element';

import 'css/frontend.scss?global';

const TOOLTIP_TEMPLATE = `
    <div class="tooltip" role="tooltip">
        <div class="tooltip-arrow abt-tooltip__callout"></div>
        <div class="tooltip-inner abt-tooltip"></div>
    </div>
`;

function getBibliographyItems() {
    try {
        // Block editor citations
        const bib = document.createElement('div');
        bib.innerHTML = getJSONScriptData<string>('abt-bibliography-json');
        return [...bib.querySelectorAll('li')].reduce<Record<string, string>>(
            (obj, item) => {
                return {
                    ...obj,
                    [item.id]: item.innerHTML,
                };
            },
            {},
        );
    } catch {
        // Legacy citations
        const bib =
            document.querySelector<HTMLDivElement>(
                '#abt-bibliography > .abt-bibliography__container',
            ) || document.querySelector<HTMLDivElement>('#abt-bibliography');
        return bib
            ? [...bib.children].reduce<Record<string, string>>(
                  (obj, item) => ({ ...obj, [item.id]: item.innerHTML }),
                  {},
              )
            : undefined;
    }
}

const getCitations = () =>
    document.querySelectorAll<HTMLSpanElement>(CitationElement.selector);

const getFootnotes = () =>
    document.querySelectorAll<HTMLSpanElement>(FootnoteElement.selector);

domReady(() => {
    const bibliography = getBibliographyItems();
    if (bibliography) {
        for (const citation of getCitations()) {
            const content = CitationElement.getItems(citation)
                .map(id => bibliography[id])
                .join('');
            if (content) {
                const child = citation.firstElementChild;
                new Tooltip(child instanceof HTMLElement ? child : citation, {
                    boundariesElement: 'viewport',
                    html: true,
                    offset: '5',
                    placement: 'top-start',
                    template: TOOLTIP_TEMPLATE,
                    title: content,
                });
            }
        }
    }
    for (const footnote of getFootnotes()) {
        const child = footnote.firstElementChild;
        new Tooltip(child instanceof HTMLElement ? child : footnote, {
            boundariesElement: 'viewport',
            html: true,
            offset: '5',
            placement: 'top-start',
            template: TOOLTIP_TEMPLATE,
            title: footnote.dataset.note,
        });
    }
});
