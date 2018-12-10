import { combineReducers } from '@wordpress/data';

import addReferenceDialog from './add-reference-dialog';
import sidebar from './sidebar';

export default combineReducers({ addReferenceDialog, sidebar });
