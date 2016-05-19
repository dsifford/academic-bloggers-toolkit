import * as types from '../constants/ActionTypes';

export const addRef = (ref) => ({ type: types.ADD_REF, ref, });
export const deleteRef = (ref) => ({ type: types.DELETE_REF, ref, });
export const moveRef = (ref) => ({ type: types.MOVE_REF, ref, });
export const selectRef = (ref) => ({ type: types.SELECT_REF, ref, });
export const clearSelection = () => ({ type: types.CLEAR_SELECTION, });
