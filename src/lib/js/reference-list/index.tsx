import 'babel-polyfill';
import { useStrict } from 'mobx';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ReferenceList } from './components/ReferenceList';
import { Store } from './Store';

useStrict(true);

import 'react-select/dist/react-select.min.css';
import 'react-virtualized-select/styles.css';
import 'react-virtualized/styles.css';

declare const ABT_Reflist_State: BackendGlobals.ABT_Reflist_State;
const store: Store = new Store(ABT_Reflist_State);

ReactDOM.render(
    <ReferenceList store={store} />,
    document.getElementById('abt-reflist__root')
);
