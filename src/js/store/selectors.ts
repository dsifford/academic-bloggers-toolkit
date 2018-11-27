import { State } from 'store';

export function getLocale(state: State): string {
    return state.locale;
}

export function getDisplayOptions(state: State): State['displayOptions'] {
    return { ...state.displayOptions };
}

export function getStyle(state: State): State['style'] {
    return { ...state.style };
}

// TODO
export function getCitationsByIndex(): Citeproc.CitationByIndex {
    return [];
}
