import 'babel-polyfill';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ReferenceList } from './components/ReferenceList';
import { Store } from './Store';
import { useStrict } from 'mobx';

useStrict(true);

import 'react-virtualized-select/styles.css';
import 'react-virtualized/styles.css';
import 'react-select/dist/react-select.min.css';

declare const ABT_Reflist_State: BackendGlobals.ABT_Reflist_State;
const store: Store = new Store(ABT_Reflist_State);

ReactDOM.render(
    <ReferenceList store={store} />,
    document.getElementById('abt-reflist')
);
