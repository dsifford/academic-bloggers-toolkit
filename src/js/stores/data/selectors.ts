import { Citation } from 'citeproc';
import _ from 'lodash';

import { clone } from 'utils/data';
import { editorCitation, getEditorDOM } from 'utils/editor';

import { State } from './';

interface SerializedMeta {
    meta: {
        abt_state: string;
    };
}

export function getCitationsByIndex(state: State): Citation[] {
    const doc = getEditorDOM();
    const citations = [...doc.querySelectorAll<HTMLElement>('.abt-citation')];
    return citations.map((el, index) => {
        const citationID = el.id;
        const citationItems = editorCitation.getItems(el).reduce(
            (arr, id) => {
                const item = getItemById(state, id);
                return item !== undefined ? [...arr, { id, item }] : arr;
            },
            <Citation['citationItems']>[],
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
    const doc = getEditorDOM();
    return _([...doc.querySelectorAll<HTMLElement>('.abt-citation')])
        .flatMap(editorCitation.getItems)
        .uniq()
        .map(_.partial(getItemById, state))
        .compact()
        .value();
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
    return _.orderBy(
        getItems(state, kind),
        item => {
            switch (mode) {
                case 'date':
                    const [year, month = 0, day = 1]: number[] = _.get(
                        item.issued,
                        '[date-parts][0]',
                        [-5000],
                    );
                    return new Date(year, month, day).toJSON();
                case 'publication':
                    return (
                        item.journalAbbreviation ||
                        item['container-title-short'] ||
                        item['container-title'] ||
                        item.publisher ||
                        '~'
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

export function getSerializedState({
    references,
    style,
}: State): SerializedMeta {
    return {
        meta: {
            abt_state: JSON.stringify({ references, style }),
        },
    };
}

export function getStyle(state: State): State['style'] {
    return clone(state.style);
}

export function getUncitedItems(state: State): CSL.Data[] {
    return clone(
        _.differenceWith(
            [...state.references],
            getCitedItems(state),
            (left, right) => left.id === right.id,
        ),
    );
}
