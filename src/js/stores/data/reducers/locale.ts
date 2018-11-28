import { Reducer } from 'redux';

import { Actions } from '../constants';

const locale: Reducer<string> = (state = 'en_US', action) => {
    switch (action.type) {
        case Actions.SET_LOCALE:
            return action.locale;
        default:
            return state;
    }
};

export default locale;
