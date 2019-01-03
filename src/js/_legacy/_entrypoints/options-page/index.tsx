import { configure } from 'mobx';
import React from 'react';
import { render } from 'react-dom';

import StyleForm from './style-form';

import './style.scss?global';

configure({ enforceActions: 'observed' });

render(<StyleForm />, document.getElementById('style-form-root'));
