import * as actions from './actions';
import { BibFormat, HeadingLevel, LinkFormat, StyleKind } from './constants';
import reducer from './reducers';
import * as selectors from './selectors';

interface DisplayOptions {
    bib_heading: string;
    bib_heading_level: HeadingLevel;
    bibliography: BibFormat;
    links: LinkFormat;
}

interface Style {
    kind: StyleKind;
    value: string;
    label: string;
}

export interface State {
    citations: CSL.Data[];
    displayOptions: DisplayOptions;
    locale: string;
    style: Style;
}

export default {
    actions,
    reducer,
    selectors,
};
