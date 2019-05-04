import { Format, Value } from '@wordpress/rich-text';
import { get } from 'lodash';

export function* iterate(
    { formats = [] }: Value,
    formatType?: string,
): IterableIterator<Format> {
    for (const fmts of formats) {
        if (!fmts) {
            continue;
        }
        for (const fmt of fmts) {
            if (formatType && fmt.type !== formatType) {
                continue;
            }
            yield fmt;
        }
    }
}

export function mergeItems(items: string[], dataItems?: string): string {
    let existingItems: string[] = [];
    try {
        existingItems = JSON.parse(dataItems || '[]');
    } catch {
        // revert back to an empty array if an error occurs.
    }
    return JSON.stringify(
        [...existingItems, ...items].filter(
            (item, index, arr) => arr.indexOf(item) === index,
        ),
    );
}

export function getNeighbors(type: string, val: Value): Format[] {
    const { start = 0, end = val.formats.length } = val;
    let formats = neighbors('left', start, val, type);
    formats = neighbors('left', start - 1, val, type, formats);
    formats = neighbors('right', end, val, type, formats);
    formats = neighbors('right', end + 1, val, type, formats);
    return formats;
}

//
// Internal Helpers
//

function neighbors(
    dir: 'left' | 'right',
    idx: number,
    val: Value,
    type: string,
    located: Format[] = [],
): Format[] {
    const dirval = dir === 'left' ? -1 : 1;
    const formats: Format[] = get(val, ['formats', idx], []);
    const format = formats.find(item => item.type === type);
    return format
        ? neighbors(
              dir,
              idx + dirval,
              val,
              type,
              located.includes(format) ? located : [...located, format],
          )
        : located;
}
