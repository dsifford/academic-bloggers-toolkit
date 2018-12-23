import { dispatch, select } from '@wordpress/data';

// prettier-ignore
declare module '@wordpress/data' {
    export function dispatch(key: 'abt/data'): typeof import('stores/data/actions');
    export function dispatch(key: 'abt/ui'): typeof import('stores/ui/actions');

    export function select<T extends typeof import('stores/data/selectors'), U extends keyof T>(key: 'abt/data'): {
        [k in U]: (...args: any[]) => T[k] extends (...args: any[]) => infer V ? V : never;
    };

    export function select<T extends typeof import('stores/ui/selectors'), U extends keyof T>(key: 'abt/ui'): {
        [k in U]: (...args: any[]) => T[k] extends (...args: any[]) => infer V ? V : never;
    };
}
