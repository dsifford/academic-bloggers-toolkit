import uuid from 'uuid/v4';

import { ZERO_WIDTH_SPACE } from 'utils/constants';
import { createSelector } from 'utils/dom';

interface ABTElement {
    readonly className: string;
    readonly legacyClassNames: readonly string[];
    readonly selector: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    create(...args: any): string;
}

@staticImplements<ABTElement>()
export abstract class CitationElement {
    static readonly className = 'abt-citation';
    static readonly legacyClassNames: readonly string[] = [
        CitationElement.className,
        'abt_cite',
    ];
    static readonly selector = createSelector(
        ...CitationElement.legacyClassNames.map(cls => ({
            classNames: [cls],
            attributes: {
                id: true,
            },
        })),
    );

    static create(items: string[]): string {
        const citation = document.createElement('span');
        citation.className = CitationElement.className;
        citation.id = uuid();
        citation.dataset.items = JSON.stringify(items);
        citation.contentEditable = 'false';
        return citation.outerHTML;
    }

    static getItems(el: HTMLElement): string[] {
        return JSON.parse(el.dataset.items || el.dataset.reflist || '[]');
    }
}

@staticImplements<ABTElement>()
export abstract class FootnoteElement {
    static readonly className = 'abt-footnote';
    static readonly legacyClassNames: readonly string[] = [
        FootnoteElement.className,
    ];
    static readonly selector = createSelector(
        ...FootnoteElement.legacyClassNames.map(cls => ({
            classNames: [cls],
            attributes: {
                id: true,
            },
        })),
    );

    static create(note: string): string {
        const footnote = document.createElement('span');
        footnote.className = FootnoteElement.className;
        footnote.id = uuid();
        footnote.dataset.note = note;
        footnote.contentEditable = 'false';
        return footnote.outerHTML;
    }

    static createMarker(index: number, marker = ''): string {
        const markers = ['*', '†', '‡', '§', '¶', '#'];
        return index >= 0
            ? FootnoteElement.createMarker(
                  index - markers.length,
                  marker + markers[index % markers.length],
              )
            : `<sup>${ZERO_WIDTH_SPACE}${marker}${ZERO_WIDTH_SPACE}</sup>`;
    }
}

// helper for strict types of static properties
function staticImplements<T>() {
    return (_cons: T) => void 0;
}
