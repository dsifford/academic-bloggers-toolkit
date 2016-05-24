import { combineReducers } from 'redux';
import { data } from './data';
import { view } from './view';

export const app = combineReducers({
    data,
    view,
});
