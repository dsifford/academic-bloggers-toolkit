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
    shortTitle?: string;
}

export interface StyleJSON {
    renamed: Record<string, string>;
    styles: Style[];
}

export interface SavedState {
    references: CSL.Data[];
    style: Style;
}

export interface State extends SavedState {
    citationStyles: StyleJSON;
}

export const name = 'abt/data';

export const config = {
    actions,
    controls,
    reducer,
    resolvers,
    selectors,
};

export default [name, config] as [string, typeof config];
