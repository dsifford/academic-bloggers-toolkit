import { Reducer } from '@wordpress/data';

import { State as Main } from '../';
import { Actions } from '../constants';

type State = Main['style'];

const INITIAL_STATE = { ...window.ABT_EDITOR.style };

const style: Reducer<State> = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case Actions.RECEIVE_STYLE:
            return action.style;
        default:
            return state;
    }
};

export default style;
