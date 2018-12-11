import { IdentifierKind } from 'utils/constants';

import * as actions from './actions';
import reducer from './reducer';
import * as selectors from './selectors';

export interface State {
    sidebar: {
        selectedItems: string[];
    };
    addReferenceDialog: {
        identifierKind: IdentifierKind;
    };
}

export default {
    actions,
    reducer,
    selectors,
};
