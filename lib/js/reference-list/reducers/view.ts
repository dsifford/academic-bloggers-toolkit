import {
    ADD_TO_SELECTION,
    CLEAR_SELECTION,
    TOGGLE_LOADING,
} from '../constants/ActionTypes';
import { Map, List } from 'immutable';

type State = Immutable.Map<string, boolean|Immutable.List<number>>

const initialState: State = Map({
    loading: true,
    selected: List([]),
});

export function view(state: State = initialState, action): State {
    switch (action.type) {
        case ADD_TO_SELECTION:
        case CLEAR_SELECTION:
            return state.set('selected', List([]));
        case TOGGLE_LOADING:
            return state.set('loading', !state.get('loading'));
        default:
            return state;
    }
}
