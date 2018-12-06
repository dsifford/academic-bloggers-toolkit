import { State } from './';

export function getSelectedItems(state: State): string[] {
    return [...state.sidebar.selectedItems];
}
