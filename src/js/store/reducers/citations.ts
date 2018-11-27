import { Reducer } from 'redux';

import { State } from 'store';
import { Actions } from 'store/constants';

type Data = State['citations'];

const citations: Reducer<Data> = (state = [], action): Data => {
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
