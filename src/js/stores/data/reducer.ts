import { Action, combineReducers } from '@wordpress/data';
import hash from 'string-hash';

import { clone } from 'utils/data';

import { State } from './';
import { Actions } from './constants';

const INITIAL_STATE = clone(window.ABT_EDITOR);

export function bibliography(
    state = INITIAL_STATE.bibliography,
    action: Action,
): State['bibliography'] {
    switch (action.type) {
        case Actions.SET_BIBLIOGRAPHY: {
            return { ...action.bibliography };
        }
        default:
            return state;
    }
}

export function references(
    state = INITIAL_STATE.references,
    action: Action,
): State['references'] {
    switch (action.type) {
        case Actions.ADD_REFERENCES: {
            const newItems = (<CSL.Data[]>action.data)
                .map(({ id, ...data }) => ({
                    ...data,
                    id:
                        data.DOI ||
                        data.ISBN ||
                        data.PMCID ||
                        data.PMID ||
                        `${hash(JSON.stringify(data))}`,
                }))
                .filter(
                    ({ id }) => state.findIndex(item => item.id === id) === -1,
                );
            return newItems.length > 0 ? [...state, ...newItems] : state;
        }
        case Actions.REMOVE_REFERENCES: {
            return state.filter(item => !action.itemIds.includes(item.id));
        }
        case Actions.UPDATE_REFERENCE: {
            const index = state.findIndex(({ id }) => id === action.data.id);
            return index === -1
                ? [...state, action.data]
                : [
                      ...state.slice(0, index),
                      action.data,
                      ...state.slice(index + 1),
                  ];
        }
        default:
            return state;
    }
}

export function style(
    state = INITIAL_STATE.style,
    action: Action,
): State['style'] {
    switch (action.type) {
        case Actions.RECEIVE_STYLE:
            return action.style;
        default:
            return state;
    }
}

export default combineReducers({
    bibliography,
    references,
    style,
});
