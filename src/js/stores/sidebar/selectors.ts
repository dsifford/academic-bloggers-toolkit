import { State } from './';

export function getSelectedItems(state: State): State['selected'] {
    return [...state.selected];
}

// TODO: use createSelector here for getting specific derived selected items (e.g. cited, uncited, footnotes, etc...)
