import { State } from '..';

export function getStyle(state: State): State['style'] {
    return { ...state.style };
}
