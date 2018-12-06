import { combineReducers } from '@wordpress/data';

import citations from './citations';
import style from './style';

export default combineReducers({
    citations,
    style,
});
