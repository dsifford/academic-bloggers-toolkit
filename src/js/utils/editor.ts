import { Format, Value } from '@wordpress/rich-text';
import uuid from 'uuid/v4';

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

export function getNeighboringFormats(type: string, val: Value): Format[] {
    const { start = 0, end = val.formats.length } = val;
    let formats = getNeighbors('left', start, val, type);
    formats = getNeighbors('left', start - 1, val, type, formats);
    formats = getNeighbors('right', end, val, type, formats);
    formats = getNeighbors('right', end + 1, val, type, formats);
    return formats;
}

export function createCitationHtml(items: string[]): string {
    const citation = document.createElement('span');
    citation.className = 'abt-citation';
    citation.dataset.id = uuid();
    citation.dataset.items = JSON.stringify(items);
    citation.contentEditable = 'false';
    return citation.outerHTML;
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
