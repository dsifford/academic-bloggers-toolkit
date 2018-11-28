import { combineReducers } from '@wordpress/data';

import citations from './citations';
import displayOptions from './display-options';
import locale from './locale';
import style from './style';

export default combineReducers({
    citations,
    displayOptions,
    locale,
    style,
});
