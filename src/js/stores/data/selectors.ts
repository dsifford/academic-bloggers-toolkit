import { Citation } from 'citeproc';
import lodash, { differenceWith, get, orderBy, partial } from 'lodash';

import { clone, firstTruthyValue } from 'utils/data';
import { getEditorDOM } from 'utils/editor';
import { CitationElement, FootnoteElement } from 'utils/element';

import { State } from './';

export function getCitationStyles(state: State): State['citationStyles'] {
    return clone(state.citationStyles);
}

export function getStyle(state: State): State['style'] {
    return clone(state.style);
}

export function getCitationsByIndex(state: State): Citation[] {
    const doc = getEditorDOM(true);
    const citations = [
        ...doc.querySelectorAll<HTMLElement>(CitationElement.selector),
    ];
    return citations.map((el, index) => {
        const citationID = el.id;
        const citationItems = CitationElement.getItems(el).reduce(
            (arr, id) => {
                const item = getItemById(state, id);
                return item !== undefined ? [...arr, { id, item }] : arr;
            },
            [] as Citation['citationItems'],
        );
        return {
            citationID,
            citationItems,
            properties: {
                index,
                noteIndex: 0,
            },
        };
    });
}

export function getCitedItems(state: State): CSL.Data[] {
    const doc = getEditorDOM(true);
    return lodash([
        ...doc.querySelectorAll<HTMLElement>(CitationElement.selector),
    ])
        .flatMap(CitationElement.getItems)
        .uniq()
        .map(partial(getItemById, state))
        .compact()
        .value();
}

export function getFootnotes() {
    const doc = getEditorDOM();
    const container = document.createElement('div');
    const marker = document.createElement('div');
    const content = document.createElement('div');
    marker.className = 'abt-footnotes-item__marker';
    content.className = 'abt-footnotes-item__content';
    container.appendChild(marker);
    container.appendChild(content);
    return [...doc.querySelectorAll<HTMLElement>(FootnoteElement.selector)].map(
        footnote => {
            marker.innerHTML = footnote.innerHTML;
            content.textContent = footnote.dataset.note || '';
            return {
                id: `${footnote.id}-ref`,
                content: container.innerHTML,
            };
        },
    );
}

export function getItems(state: State, kind?: 'cited' | 'uncited'): CSL.Data[] {
    switch (kind) {
        case 'cited':
            return getCitedItems(state);
        case 'uncited':
            return getUncitedItems(state);
        default:
            return clone(state.references);
    }
}

export function getSortedItems(
    state: State,
    mode: 'date' | 'publication' | 'title' = 'title',
    order: 'asc' | 'desc' = 'asc',
    kind?: 'cited' | 'uncited',
): CSL.Data[] {
    return orderBy(
        getItems(state, kind),
        item => {
            switch (mode) {
                case 'date': {
                    const [year, month = 0, day = 1]: number[] = get(
                        item.issued,
                        '[date-parts][0]',
                        [-5000],
                    );
                    return new Date(year, month, day).toJSON();
                }
                case 'publication':
                    return firstTruthyValue(
                        item,
                        [
                            'journalAbbreviation',
                            'container-title-short',
                            'container-title',
                            'publisher',
                        ],
                        '~',
                    );
                case 'title':
                default:
                    return item.title || '~';
            }
        },
        order,
    );
}

export function getItemById(state: State, id: string): CSL.Data | undefined {
    return clone(state.references.find(item => item.id === id));
}

export function getSerializedState({ references, style }: State) {
    return {
        meta: {
            // eslint-disable-next-line @typescript-eslint/camelcase
            _abt_state: JSON.stringify({ references, style }),
        },
    };
}

export function getUncitedItems(state: State): CSL.Data[] {
    return differenceWith(
        state.references,
        getCitedItems(state),
        (left, right) => left.id === right.id,
    );
}
