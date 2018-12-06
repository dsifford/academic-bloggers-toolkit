import { State } from '../';

export * from './citations';
export * from './style';

interface SerializedMeta {
    meta: {
        abt_state: string;
    };
}

export function getSerializedState(state: State): SerializedMeta {
    return {
        meta: {
            abt_state: JSON.stringify(state),
        },
    };
}
