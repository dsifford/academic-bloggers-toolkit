import { configure } from 'mobx';
import React from 'react';

import TinyMCEDriver from '_legacy/drivers/tinymce';
import ReferenceList from '_legacy/reference-list';
import Store from '_legacy/stores/data';
import logger from '_legacy/utils/logger';
import render from '_legacy/utils/render';

import './reference-list.scss';

configure({ enforceActions: 'observed' });

window.Rollbar = logger;
const store: Store = new Store(window.ABT.state);

render(
    <ReferenceList store={store} editor={TinyMCEDriver} />,
    'abt-reflist__root',
);
