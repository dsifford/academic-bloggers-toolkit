import { useStrict } from 'mobx';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import 'react-select/dist/react-select.min.css';
import 'react-virtualized-select/styles.css';
import 'react-virtualized/styles.css';

import logger from 'utils/logger';
import ReferenceList from './components/reference-list';
import Store from './store';

(window as any)['Rollbar'] = logger;

useStrict(true);

declare const ABT_Reflist_State: BackendGlobals.ABT_Reflist_State;
const store: Store = new Store(ABT_Reflist_State);

ReactDOM.render(
    <ReferenceList store={store} editor={import('drivers/tinymce').then(mod => mod.default)} />,
    document.getElementById('abt-reflist__root'),
);
