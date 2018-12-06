import { Actions } from './constants';

export function toggleItemSelected(id: string) {
    return {
        type: Actions.TOGGLE_ITEM_SELECTED,
        id,
    };
}
