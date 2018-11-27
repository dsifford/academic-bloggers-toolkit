import { Reducer } from 'redux';

import { State as Main } from 'store';
import { Actions, BibFormat, HeadingLevel, LinkFormat } from 'store/constants';

type State = Main['displayOptions'];

const INITIAL: State = {
    bib_heading: '',
    bib_heading_level: HeadingLevel.H3,
    bibliography: BibFormat.FIXED,
    links: LinkFormat.ALWAYS,
};

const displayOptions: Reducer<State> = (state = INITIAL, action): State => {
    switch (action.type) {
        case Actions.SET_DISPLAY_OPTIONS:
            return action.displayOptions;
        default:
            return state;
    }
};

export default displayOptions;
