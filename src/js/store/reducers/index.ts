import { combineReducers } from '@wordpress/data';

import citations from 'store/reducers/citations';
import displayOptions from 'store/reducers/display-options';
import locale from 'store/reducers/locale';
import style from 'store/reducers/style';

export default combineReducers({
    citations,
    displayOptions,
    locale,
    style,
});
