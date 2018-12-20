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

export function citations(
    state = INITIAL_STATE.citations,
    action: Action,
): State['citations'] {
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
    citations,
    style,
});
