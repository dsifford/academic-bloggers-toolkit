import { select } from '@wordpress/data';
import { Format, Value } from '@wordpress/rich-text';
import { Bibliography } from 'citeproc';
import uuid from 'uuid/v4';

export function createCitationHtml(items: string[]): string {
    const citation = document.createElement('span');
    citation.className = 'abt-citation';
    citation.dataset.id = uuid();
    citation.dataset.items = JSON.stringify(items);
    citation.contentEditable = 'false';
    return citation.outerHTML;
}

export function getEditorDOM(): HTMLDivElement {
    const doc = document.createElement('div');
    doc.innerHTML = select<string>('core/editor').getEditedPostContent();
    return doc;
}

export function getNeighboringFormats(type: string, val: Value): Format[] {
    const { start = 0, end = val.formats.length } = val;
    let formats = getNeighbors('left', start, val, type);
    formats = getNeighbors('left', start - 1, val, type, formats);
    formats = getNeighbors('right', end, val, type, formats);
    formats = getNeighbors('right', end + 1, val, type, formats);
    return formats;
}

export function mergeItems(items: string[], dataItems?: string): string {
    let existingItems: string[] = [];
    try {
        existingItems = JSON.parse(dataItems || '[]');
    } catch {}
    return JSON.stringify(
        [...existingItems, ...items].filter(
            (item, index, arr) => arr.indexOf(item) === index,
        ),
    );
}

export function removeItems(doc: HTMLElement, itemIds: string[]): string[] {
    let toDelete = [...itemIds];
    const elements = doc.querySelectorAll<HTMLSpanElement>('.abt-citation');
    for (const el of elements) {
        let existingIds: string[] = JSON.parse(el.dataset.items || '[]');
        toDelete = toDelete.filter(id => !existingIds.includes(id));
        existingIds = existingIds.filter(id => !itemIds.includes(id));
        if (existingIds.length === 0 && el.parentNode) {
            el.parentNode.removeChild(el);
        } else {
            el.dataset.items = JSON.stringify(existingIds);
        }
    }
    return toDelete;
}

export function parseBibliographyHTML(bibliography: Bibliography): string {
    const container = document.createElement('div');
    return bibliography[1]
        .map(html => {
            container.innerHTML = html;
            const child = container.firstElementChild;
            const li = document.createElement('li');
            if (child) {
                li.innerHTML = child.innerHTML;
                [...child.attributes]
                    .map(attr => attr.name)
                    .forEach(name =>
                        li.setAttribute(name, child.getAttribute(name)!),
                    );
                return li.outerHTML;
            }
            return '';
        })
        .join('\n');
}

//
// Internal Helpers
//

function getNeighbors(
    dir: 'left' | 'right',
    idx: number,
    val: Value,
    type: string,
    neighbors: Format[] = [],
): Format[] {
    const dirval = dir === 'left' ? -1 : 1;
    if (!val.formats[idx]) {
        return neighbors;
    }
    const format = val.formats[idx].find(item => item.type === type);
    return format
        ? getNeighbors(
              dir,
              idx + dirval,
              val,
              type,
              neighbors.includes(format) ? neighbors : [...neighbors, format],
          )
        : neighbors;
}
