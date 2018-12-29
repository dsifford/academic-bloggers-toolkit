import * as actions from './actions';
import { StyleKind } from './constants';
import controls from './controls';
import reducer from './reducer';
import * as selectors from './selectors';

export interface Style {
    kind: StyleKind;
    value: string;
    label: string;
}

export interface State {
    references: CSL.Data[];
    style: Style;
}

export default {
    actions,
    controls,
    reducer,
    selectors,
};
