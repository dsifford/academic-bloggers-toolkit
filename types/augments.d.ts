import { dispatch, select } from '@wordpress/data';

// prettier-ignore
declare module '@wordpress/data' {
    export function dispatch(key: 'abt/data'): typeof import('stores/data/actions');
    export function dispatch(key: 'abt/ui'): typeof import('stores/ui/actions');

    export function select<T extends typeof import('stores/data/selectors'), U extends keyof T>(key: 'abt/data'): {
        [k in U]: T[k] extends (firstArg: any, ...args: infer V) => infer W ? (...args: V) => W : never;
    };

    export function select<T extends typeof import('stores/ui/selectors'), U extends keyof T>(key: 'abt/ui'): {
        [k in U]: T[k] extends (firstArg: any, ...args: infer V) => infer W ? (...args: V) => W : never;
    };
}
