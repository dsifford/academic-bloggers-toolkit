import { Reducer } from '@wordpress/data';

import { IdentifierKind } from 'utils/constants';

import { State as GlobalState } from '../';
import { Actions } from '../constants';

type State = GlobalState['addReferenceDialog'];

const INITIAL_STATE: State = {
    identifierKind: IdentifierKind.DOI,
};

const identifierKind: Reducer<State> = (state = INITIAL_STATE, action) => {
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
};

export default identifierKind;
