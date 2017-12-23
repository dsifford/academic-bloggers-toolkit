import { useStrict } from 'mobx';
import * as React from 'react';
import 'react-select/dist/react-select.css';
import './reference-list-global.scss';

import Store from 'stores/data';
import logger from 'utils/logger';
import render from 'utils/render';
import ReferenceList from './components/reference-list';

useStrict(true);
window.Rollbar = logger;
const store: Store = new Store(window.ABT.state);

render(
    <ReferenceList
        store={store}
        editor={import('drivers/tinymce').then(mod => mod.default)}
    />,
    '#abt-reflist__root',
);
