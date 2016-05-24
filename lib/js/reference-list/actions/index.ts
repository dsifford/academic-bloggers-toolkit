import {
    ADD_CITATION,
    REMOVE_CITATION,
    MOVE_CITATION,
    ADD_TO_SELECTION,
    CLEAR_SELECTION,
} from '../constants/ActionTypes';

export function addCitation(citation: CSL.Data) {
    return { type: ADD_CITATION, citation };
}

export function removeCitation() {
    return { type: REMOVE_CITATION };
}

export function moveCitation() {
    return { type: MOVE_CITATION };
}

export function addToSelection() {
    return { type: ADD_TO_SELECTION };
}

export function clearSelection() {
    return { type: CLEAR_SELECTION };
}
