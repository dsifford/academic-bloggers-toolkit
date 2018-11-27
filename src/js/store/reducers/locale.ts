import { Reducer } from 'redux';

const locale: Reducer<string> = (state = 'en_US', action): string => {
    switch (action.type) {
        case 'SET_LOCALE':
            return action.locale;
        default:
            return state;
    }
};

export default locale;
