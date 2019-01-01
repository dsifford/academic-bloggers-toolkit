import { select } from '@wordpress/data';

import { SavedState } from './';
import { Actions } from './constants';
import { fetchCitationStyles } from './controls';

export function* getCitationStyles() {
    const styles = yield fetchCitationStyles();
    return {
        type: Actions.SET_CITATION_STYLES,
        styles,
    };
}

export function getReferences() {
    const { references } = getSavedState();
    return {
        type: Actions.SET_REFERENCES,
        references,
    };
}

export function getStyle() {
    const { style } = getSavedState();
    return {
        type: Actions.SET_STYLE,
        style,
    };
}

function getSavedState(): SavedState {
    const { abt_state } = select<{ abt_state: string }>(
        'core/editor',
    ).getCurrentPostAttribute('meta');
    return JSON.parse(abt_state);
}
