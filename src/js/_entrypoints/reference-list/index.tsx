import { configure } from 'mobx';
import React from 'react';
import './reference-list.scss';

import ReferenceList from 'reference-list';
import Store from 'stores/data';
import logger from 'utils/logger';
import render from 'utils/render';

import TinyMCEDriver from 'drivers/tinymce';

configure({ enforceActions: 'observed' });

window.Rollbar = logger;
const store: Store = new Store(window.ABT.state);

render(
    <ReferenceList store={store} editor={TinyMCEDriver} />,
    'abt-reflist__root',
);
