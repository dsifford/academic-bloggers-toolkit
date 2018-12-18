import { Action, combineReducers } from '@wordpress/data';

import { IdentifierKind } from 'utils/constants';

import { State } from './';
import { Actions } from './constants';

const ARD_INITIAL_STATE: State['addReferenceDialog'] = {
    identifierKind: IdentifierKind.DOI,
};

export function addReferenceDialog(
    state = ARD_INITIAL_STATE,
    action: Action,
): State['addReferenceDialog'] {
    switch (action.type) {
        case Actions.SET_IDENTIFIER_KIND: {
            return {
                ...state,
                identifierKind: action.kind,
            };
        }
        default:
            return state;
    }
}

const SIDEBAR_INITIAL_STATE: State['sidebar'] = {
    selectedItems: [],
    sortMode: 'title',
    sortOrder: 'asc',
};

export function sidebar(
    state = SIDEBAR_INITIAL_STATE,
    action: Action,
): State['sidebar'] {
    switch (action.type) {
        case Actions.CLEAR_SELECTED_ITEMS: {
            return {
                ...state,
                selectedItems: [],
            };
        }
        case Actions.SET_SIDEBAR_SORT_MODE: {
            return {
                ...state,
                sortMode: action.mode,
            };
        }
        case Actions.SET_SIDEBAR_SORT_ORDER: {
            return {
                ...state,
                sortOrder: action.order,
            };
        }
        case Actions.TOGGLE_ITEM_SELECTED: {
            return {
                ...state,
                selectedItems: state.selectedItems.includes(action.id)
                    ? state.selectedItems.filter(id => id !== action.id)
                    : [...state.selectedItems, action.id],
            };
        }
        default:
            return state;
    }
}

export default combineReducers({
    addReferenceDialog,
    sidebar,
});
