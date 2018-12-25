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

export function getBibliography(state: State): State['bibliography'] {
    return clone(state.bibliography);
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

export function getItemById(state: State, id: string): CSL.Data | undefined {
    return clone(state.references.find(item => item.id === id));
}

export function getSerializedState(state: State): SerializedMeta {
    return {
        meta: {
            abt_state: JSON.stringify(state),
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
