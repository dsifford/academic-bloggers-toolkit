import { render } from '@wordpress/element';

import StyleForm from './style-form';

import './style.scss?global';

render(<StyleForm />, document.getElementById('style-form-root'));
