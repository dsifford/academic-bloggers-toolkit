import * as actions from 'store/actions';
import reducer from 'store/reducers';
import * as selectors from 'store/selectors';

import {
    BibFormat,
    HeadingLevel,
    LinkFormat,
    StyleKind,
} from 'store/constants';

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
