import * as actions from './actions';
import { StyleKind } from './constants';
import controls from './controls';
import reducer from './reducer';
import * as resolvers from './resolvers';
import * as selectors from './selectors';

export interface Style {
    kind: StyleKind;
    value: string;
    label: string;
}

export interface StyleJSON {
    renamed: Record<string, string>;
    styles: Style[];
}

export interface State {
    references: CSL.Data[];
    style: Style;
    citationStyles: StyleJSON;
}

export default {
    actions,
    controls,
    reducer,
    resolvers,
    selectors,
};
