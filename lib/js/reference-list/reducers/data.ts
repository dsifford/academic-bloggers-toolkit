import {
    ADD_CITATION,
    REMOVE_CITATION,
    MOVE_CITATION,
} from '../constants/ActionTypes';
import { Map, List } from 'immutable';

type State = Immutable.Map<string, (Immutable.Map<string, {}>|Immutable.List<string>)>;

const initialState = Immutable.fromJS({
    citations: {},
    citationIds: {},
});

export function data(state: State = initialState, action): State {
    switch (action.type) {
        case ADD_CITATION:
            return state.withMutations(map => {
                map
                .setIn(['citations', action.citation.id], action.citation)
                .updateIn(['citationIDs'], arr => arr.push(action.citation.id));
            });
        case REMOVE_CITATION:
            return state.withMutations(map => {
                map
                .deleteIn(['citations', action.citationID])
                .updateIn(['citationIDs'], arr => arr.filter(id => id !== action.citationID));
            });
        case MOVE_CITATION:
        default:
            return state;
    }
}
