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
    const meta = select<Maybe<{ abt_state?: string }>>(
        'core/editor',
    ).getCurrentPostAttribute('meta');
    if (!meta || !meta.abt_state) {
        throw new Error('Unable to retrieve registered post meta for ABT');
    }
    return JSON.parse(meta.abt_state);
}
