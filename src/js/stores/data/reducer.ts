import { Action, combineReducers } from '@wordpress/data';
import hash from 'string-hash';

import clone from 'utils/clone';

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
        case Actions.ADD_REFERENCE: {
            const { id: oldId, ...data }: CSL.Data = action.data;
            const id =
                data.DOI ||
                data.ISBN ||
                data.PMCID ||
                data.PMID ||
                `${hash(JSON.stringify(data))}`;
            if (state.findIndex(item => item.id === id) >= 0) {
                return state;
            }
            return [...state, { ...data, id }];
        }
        case Actions.DELETE_REFERENCE: {
            return state.filter(item => item.id !== action.id);
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
