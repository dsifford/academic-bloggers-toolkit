import { State } from '../';

export function getDisplayOptions(state: State): State['displayOptions'] {
    return { ...state.displayOptions };
}

export * from './citations';
export * from './locale';
export * from './style';
