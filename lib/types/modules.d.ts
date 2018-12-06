declare module 'browser-sync-webpack-plugin';
declare module 'rollbar-sourcemap-webpack-plugin';
declare module 'rollbar/dist/rollbar.umd';
declare module 'wp-pot';

declare module '*.scss' {
    const content: {
        [identifier: string]: any;
    };
    export = content;
}

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
