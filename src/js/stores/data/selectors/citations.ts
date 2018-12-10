import { select } from '@wordpress/data';
import { Citation } from 'citeproc';
import _ from 'lodash';

import { State } from '../';

export function getItems(state: State, kind?: 'cited' | 'uncited'): CSL.Data[] {
    switch (kind) {
        case 'cited':
            return getCitedItems(state);
        case 'uncited':
            return getUncitedItems(state);
        default:
            return [...state.citations];
    }
}

export function getCitedItems(state: State): CSL.Data[] {
    const doc = document.createElement('div');
    doc.innerHTML = select<string>('core/editor').getEditedPostContent();
    return [...doc.querySelectorAll<HTMLElement>('.abt-citation')]
        .flatMap(
            item =>
                <string[]>(
                    JSON.parse(
                        item.dataset.items || item.dataset.reflist || '[]',
                    )
                ),
        )
        .filter((val, i, arr) => arr.indexOf(val) === i)
        .reduce(
            (arr, id) => {
                const found = state.citations.find(csl => csl.id === id);
                return found ? [...arr, { ...found }] : arr;
            },
            <CSL.Data[]>[],
        );
}

export function getCitationsByIndex(state: State): Citation[] {
    const doc = document.createElement('div');
    doc.innerHTML = select<string>('core/editor').getEditedPostContent();
    const citations = [...doc.querySelectorAll<HTMLElement>('.abt-citation')];
    return citations.map((item, index) => {
        const citationID = item.dataset.id!;
        const citationItems = (<string[]>(
            JSON.parse(item.dataset.items || item.dataset.reflist || '[]')
        )).map(id => ({
            id,
            item: state.citations.find(csl => csl.id === id),
        }));
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

export function getItemById(state: State, id: string): CSL.Data | void {
    return state.citations.find(item => item.id === id);
}

export function getUncitedItems(state: State): CSL.Data[] {
    return _.differenceWith(
        [...state.citations],
        getCitedItems(state),
        (left, right) => left.id === right.id,
    );
}
