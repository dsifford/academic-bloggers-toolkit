import { registerStore } from '@wordpress/data';

import dataStore from './data';
import uiStore from './ui';

registerStore(...dataStore);
registerStore(...uiStore);
