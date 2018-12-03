import { Reducer } from '@wordpress/data';

import { State as Main } from '../';
import { Actions, StyleKind } from '../constants';

type State = Main['style'];

const INITIAL: State = {
    kind: StyleKind.PREDEFINED,
    label: 'American Medical Association',
    value: 'american-medical-association',
};

const style: Reducer<State> = (state = INITIAL, action) => {
    switch (action.type) {
        case Actions.SET_STYLE:
            return action.style;
        default:
            return state;
    }
};

export default style;
