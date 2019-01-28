import { IdentifierKind } from 'utils/constants';

import { Actions } from './constants';

export function clearSelectedItems() {
    return {
        type: Actions.CLEAR_SELECTED_ITEMS,
    };
}

export function setIdentifierKind(kind: IdentifierKind) {
    return {
        type: Actions.SET_IDENTIFIER_KIND,
        kind,
    };
}

export function setSidebarSortMode(mode: 'date' | 'publication' | 'title') {
    return {
        type: Actions.SET_SIDEBAR_SORT_MODE,
        mode,
    };
}

export function setSidebarSortOrder(order: 'asc' | 'desc') {
    return {
        type: Actions.SET_SIDEBAR_SORT_ORDER,
        order,
    };
}

export function toggleItemSelected(id: string) {
    return {
        type: Actions.TOGGLE_ITEM_SELECTED,
        id,
    };
}
