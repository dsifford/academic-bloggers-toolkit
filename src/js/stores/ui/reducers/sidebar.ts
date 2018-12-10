import { Reducer } from '@wordpress/data';

import { State as GlobalState } from '../';
import { Actions } from '../constants';

type State = GlobalState['sidebar'];

const INITIAL_STATE: State = {
    selectedItems: [],
};

const sidebar: Reducer<State> = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case Actions.CLEAR_SELECTED_ITEMS: {
            return {
                ...state,
                selectedItems: [],
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
};

export default sidebar;
