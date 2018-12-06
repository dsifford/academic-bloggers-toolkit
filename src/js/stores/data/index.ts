import * as actions from './actions';
import { StyleKind } from './constants';
import controls from './controls';
import reducer from './reducers';
import * as selectors from './selectors';

interface Style {
    kind: StyleKind;
    value: string;
    label: string;
}

export interface State {
    citations: CSL.Data[];
    style: Style;
}

export default {
    actions,
    controls,
    reducer,
    selectors,
};
