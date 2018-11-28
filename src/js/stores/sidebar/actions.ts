import { Actions } from './constants';

export function toggleSelected(id: string) {
    return {
        type: Actions.TOGGLE_SELECTED,
        id,
    };
}
