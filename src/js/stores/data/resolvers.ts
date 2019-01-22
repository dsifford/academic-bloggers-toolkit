import { Actions } from './constants';
import { fetchCitationStyles } from './controls';

export function* getCitationStyles() {
    const styles = yield fetchCitationStyles();
    return {
        type: Actions.SET_CITATION_STYLES,
        styles,
    };
}
