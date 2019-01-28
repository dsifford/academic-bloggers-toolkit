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

export const name = 'abt/ui';

export const config = {
    actions,
    reducer,
    selectors,
};

export default [name, config] as [string, typeof config];
