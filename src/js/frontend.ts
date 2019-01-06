// tslint:disable:no-unused-expression
import domReady from '@wordpress/dom-ready';
import Tooltip from 'tooltip.js';

import 'css/frontend.scss?global';

const TOOLTIP_TEMPLATE = `
    <div class="tooltip" role="tooltip">
        <div class="tooltip-arrow abt-tooltip__callout"></div>
        <div class="tooltip-inner abt-tooltip"></div>
    </div>
`;

function getBibliographyMap() {
    const bibJson = document.querySelector(
        'script[type="application/json"]#abt-bibliography-json',
    );
    if (!bibJson) {
        return;
    }
    const bib = document.createElement('div');
    bib.innerHTML = JSON.parse(bibJson.innerHTML);
    return [...bib.querySelectorAll('li')].reduce(
        (obj, item) => {
            return {
                ...obj,
                [item.id]: item.innerHTML,
            };
        },
        {} as Record<string, string>,
    );
}

function getItems(bib: Record<string, string>, items: string = '[]'): string {
    try {
        return JSON.parse(items)
            .map((id: string) => bib[id] || '')
            .join('');
    } catch {
        return '';
    }
}

const getCitations = () =>
    document.querySelectorAll<HTMLSpanElement>('.abt-citation');

const getFootnotes = () =>
    document.querySelectorAll<HTMLSpanElement>('.abt-footnote');

domReady(() => {
    const bibliography = getBibliographyMap();
    if (bibliography) {
        for (const citation of getCitations()) {
            const content = getItems(bibliography, citation.dataset.items);
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
