import { getJSONScriptData } from 'utils/dom';
import { SavedState } from './';
import { Actions } from './constants';
import { fetchCitationStyles } from './controls';

const JSON_STATE_ID = 'abt-editor-state';

export function* getCitationStyles() {
    const styles = yield fetchCitationStyles();
    return {
        type: Actions.SET_CITATION_STYLES,
        styles,
    };
}

export function getReferences() {
    const { references } = getJSONScriptData<SavedState>(JSON_STATE_ID);
    return {
        type: Actions.SET_REFERENCES,
        references,
    };
}

export function getStyle() {
    const { style } = getJSONScriptData<SavedState>(JSON_STATE_ID);
    return {
        type: Actions.SET_STYLE,
        style,
    };
}
