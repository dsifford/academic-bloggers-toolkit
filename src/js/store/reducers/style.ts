import { Reducer } from 'redux';

import { State as Main } from 'store';
import { Actions, StyleKind } from 'store/constants';

type State = Main['style'];

const INITIAL: State = {
    kind: StyleKind.PREDEFINED,
    label: 'American Medical Association',
    value: 'american-medical-association',
};

const style: Reducer<State> = (state = INITIAL, action): State => {
    switch (action.type) {
        case Actions.SET_STYLE:
            return action.style;
        default:
            return state;
    }
};

export default style;
