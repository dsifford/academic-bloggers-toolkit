import uuid from 'uuid/v4';

import { createSelector } from 'utils/dom';

const OBJECT_REPLACEMENT_CHARACTER = '\ufffc';

interface ABTElement {
    readonly className: string;
    readonly legacyClassNames: ReadonlyArray<string>;
    readonly selector: string;
    create(...args: any): string;
}

@staticImplements<ABTElement>()
export abstract class CitationElement {
    static readonly className = 'abt-citation';
    static readonly legacyClassNames: ReadonlyArray<string> = [
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
        citation.innerText = OBJECT_REPLACEMENT_CHARACTER;
        return citation.outerHTML;
    }

    static getItems(el: HTMLElement): string[] {
        return JSON.parse(el.dataset.items || el.dataset.reflist || '[]');
    }
}

@staticImplements<ABTElement>()
export abstract class FootnoteElement {
    static readonly className = 'abt-footnote';
    static readonly legacyClassNames: ReadonlyArray<string> = [
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
        footnote.innerText = OBJECT_REPLACEMENT_CHARACTER;
        return footnote.outerHTML;
    }

    static createMarker(index: number, marker = ''): string {
        const markers = ['*', '†', '‡', '§', '¶', '#'];
        return index >= 0
            ? FootnoteElement.createMarker(
                  index - markers.length,
                  marker + markers[index % markers.length],
              )
            : `<sup>${marker}</sup>`;
    }
}

// helper for strict types of static properties
function staticImplements<T>() {
    return (_cons: T) => void 0;
}
