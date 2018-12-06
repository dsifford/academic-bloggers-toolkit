import { Reducer } from '@wordpress/data';
import hash from 'string-hash';

import { State } from '../';
import { Actions } from '../constants';

type Data = State['citations'];

const INITIAL_STATE = [...window.ABT_EDITOR.citations];

const citations: Reducer<Data> = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case Actions.ADD_REFERENCE: {
            const { id: oldId, ...data }: CSL.Data = action.data;
            const id =
                data.DOI ||
                data.ISBN ||
                data.PMCID ||
                data.PMID ||
                `${hash(JSON.stringify(data))}`;
            if (state.findIndex(item => item.id === id) >= 0) {
                return state;
            }
            return [...state, { ...data, id }];
        }
        case Actions.DELETE_REFERENCE: {
            return state.filter(item => item.id !== action.id);
        }
        default:
            return state;
    }
};

export default citations;
