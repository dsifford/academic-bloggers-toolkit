import { Format, Value } from '@wordpress/rich-text';

export function* iterate(
    value: Value,
    formatType?: string,
): IterableIterator<Format> {
    for (const formats of value.formats) {
        if (!formats) {
            continue;
        }
        for (const format of formats) {
            if (formatType && format.type !== formatType) {
                continue;
            }
            yield format;
        }
    }
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
    if (val.formats && val.formats[idx]) {
        const format = val.formats[idx]!.find(item => item.type === type);
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
    return located;
}
