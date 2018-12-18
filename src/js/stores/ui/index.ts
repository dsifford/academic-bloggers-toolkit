import { IdentifierKind } from 'utils/constants';

import * as actions from './actions';
import reducer from './reducer';
import * as selectors from './selectors';

export interface State {
    sidebar: {
        selectedItems: string[];
        sortMode: 'date' | 'publication' | 'title';
        sortOrder: 'asc' | 'desc';
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
