import { select } from '@wordpress/data';

import { Actions } from './constants';
import { apiFetch, fetchCitationStyles } from './controls';

export function* getCitationStyles() {
    const styles = yield fetchCitationStyles();
    return {
        type: Actions.SET_CITATION_STYLES,
        styles,
    };
}

export function* getReferences() {
    const { references } = yield getSavedState();
    return {
        type: Actions.SET_REFERENCES,
        references,
    };
}

export function* getStyle() {
    const { style } = yield getSavedState();
    return {
        type: Actions.SET_STYLE,
        style,
    };
}

function* getSavedState(): IterableIterator<any> {
    const id = select<number>('core/editor').getCurrentPostId();
    const { meta } = yield apiFetch(`/wp/v2/posts/${id}`);
    return JSON.parse(meta.abt_state);
}
