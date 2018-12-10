import { State } from './';

export function getIdentifierKind(state: State) {
    return state.addReferenceDialog.identifierKind;
}

export function getSelectedItems(state: State): string[] {
    return [...state.sidebar.selectedItems];
}
