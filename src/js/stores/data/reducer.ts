import { Action, combineReducers } from '@wordpress/data';
import hash from 'string-hash';

import { getJSONScriptData } from 'utils/dom';

import { SavedState, State } from './';
import { Actions } from './constants';

const INITIAL_STATE: State = {
    citationStyles: {
        renamed: {},
        styles: [],
    },
    ...getJSONScriptData<SavedState>('abt-editor-state'),
};

export function citationStyles(
    state = INITIAL_STATE.citationStyles,
    action: Action,
): State['citationStyles'] {
    switch (action.type) {
        case Actions.SET_CITATION_STYLES: {
            return action.styles;
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
            const newItems = (action.data as CSL.Data[])
                .map(({ id, ...data }) => ({
                    ...data,
                    id: `${hash(JSON.stringify(data))}`,
                }))
                .filter(
                    ({ id }) => state.findIndex(item => item.id === id) === -1,
                );
            return newItems.length > 0 ? [...state, ...newItems] : state;
        }
        case Actions.REMOVE_REFERENCES: {
            return state.filter(({ id }) => !action.itemIds.includes(id));
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
        case Actions.SET_STYLE:
            return action.style;
        default:
            return state;
    }
}

export default combineReducers({
    citationStyles,
    references,
    style,
});
