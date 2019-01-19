import { select } from '@wordpress/data';

import { SavedState, Style } from './';
import { Actions } from './constants';
import { fetchCitationStyles } from './controls';

declare const ABT: Maybe<{
    options: {
        style: Style;
    };
}>;

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
    const meta = select<Maybe<{ _abt_state?: string }>>(
        'core/editor',
    ).getCurrentPostAttribute('meta');
    if (!meta || !meta._abt_state) {
        if (!ABT) {
            throw new Error('Could not resolve default citation style.');
        }
        return {
            references: [],
            style: ABT.options.style,
        };
    }
    return JSON.parse(meta._abt_state);
}
