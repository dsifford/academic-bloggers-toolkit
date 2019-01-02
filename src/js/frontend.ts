// tslint:disable:no-unused-expression
import domReady from '@wordpress/dom-ready';
import Tooltip from 'tooltip.js';

import 'css/frontend.scss?global';

declare global {
    interface Window {
        ABT_FRONTEND?: {
            bibliography?: string;
        };
    }
}

const TOOLTIP_TEMPLATE = `
    <div class="tooltip" role="tooltip">
        <div class="tooltip-arrow abt-tooltip__callout"></div>
        <div class="tooltip-inner abt-tooltip"></div>
    </div>
`;

function getBibItems() {
    if (!window.ABT_FRONTEND || !window.ABT_FRONTEND.bibliography) {
        return;
    }
    const bib = document.createElement('div');
    bib.innerHTML = window.ABT_FRONTEND.bibliography;

    let items: Record<string, string> = {};
    for (const item of bib.querySelectorAll('li')) {
        items = {
            ...items,
            [item.id]: item.innerHTML,
        };
    }
    return items;
}

function getItems(bibItems: Record<string, string>, items?: string): string {
    if (!items) {
        return '';
    }
    try {
        const itemJSON: string[] = JSON.parse(items);
        return itemJSON.map(id => bibItems[id] || '').join('');
    } catch {
        return '';
    }
}

const getCitations = () =>
    document.querySelectorAll<HTMLSpanElement>('.abt-citation');

domReady(() => {
    const bibItems = getBibItems();
    if (!bibItems) {
        return;
    }

    for (const citation of getCitations()) {
        const content = getItems(bibItems, citation.dataset.items);
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
});
