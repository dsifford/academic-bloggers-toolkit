import { useStrict } from 'mobx';
import * as React from 'react';
import './reference-list.scss';

import ReferenceList from 'reference-list';
import Store from 'stores/data';
import logger from 'utils/logger';
import render from 'utils/render';

useStrict(true);
window.Rollbar = logger;
const store: Store = new Store(window.ABT.state);

render(
    <ReferenceList
        store={store}
        editor={import('drivers/tinymce').then(mod => mod.default)}
    />,
    'abt-reflist__root',
);
