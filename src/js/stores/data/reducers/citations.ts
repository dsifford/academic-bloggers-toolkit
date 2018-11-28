import { Reducer } from 'redux';

import { State } from '../';
import { Actions } from '../constants';

type Data = State['citations'];

const citations: Reducer<Data> = (state = [], action) => {
    switch (action.type) {
        case Actions.ADD_REFERENCE:
            return [...state, action.data];
        case Actions.DELETE_REFERENCE:
            return state.filter(item => item.id !== action.id);
        default:
            return state;
    }
};

export default citations;
