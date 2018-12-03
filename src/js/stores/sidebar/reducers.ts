import { combineReducers, Reducer } from '@wordpress/data';

import { State } from '.';
import { Actions } from './constants';

const selected: Reducer<State['selected']> = (state = [], action) => {
    switch (action.type) {
        case Actions.TOGGLE_SELECTED:
            return state.includes(action.id)
                ? state.filter(id => id !== action.id)
                : [...state, action.id];
        default:
            return state;
    }
};

export default combineReducers({ selected });
