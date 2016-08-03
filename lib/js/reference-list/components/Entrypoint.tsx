import 'babel-polyfill'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ReferenceList } from './ReferenceList';
import { Store } from '../Store';
declare const ABT_Reflist_State;

const store: Store = new Store(ABT_Reflist_State);

ReactDOM.render(
    <ReferenceList store={store} />,
    document.getElementById('abt-reflist')
);
