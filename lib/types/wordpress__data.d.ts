// Type definitions for @wordpress/data
// Definitions by: Derek P Sifford <dereksifford@gmail.com>
// tslint:disable:no-reserved-keywords

declare module '@wordpress/data' {
    import { ComponentType } from 'react';
    import { AnyAction, combineReducers, Reducer, Store } from 'redux';

    export { AnyAction as Action, combineReducers, Reducer } from 'redux';

    export interface Controls {
        [k: string]: (action: AnyAction) => Promise<any>;
    }

    interface StoreRegObj<T> {
        reducer: Reducer<T>;
        actions: {
            [k: string]: (...args: any) => AnyAction | IterableIterator<any>;
        };
        controls?: Controls;
        selectors?: {
            [k: string]: (state: T, ...args: any) => any;
        };
        resolvers?: {
            [k: string]: (...args: any) => IterableIterator<T>;
        };
    }

    // prettier-ignore
    export function dispatch<T>(key: string): Record<string, (...args: any[]) => T>;

    // prettier-ignore
    export function select<T>(key: string): Record<string, (...args: any[]) => T>;

    export function withDispatch<P, DP>(
        mapDispatchToProps: (disp: typeof dispatch, ownProps: P) => DP,
    ): (component: ComponentType<P & DP>) => ComponentType<P>;

    export function withSelect<P, DP>(
        mapDispatchToProps: (sel: typeof select, ownProps: P) => DP,
    ): (component: ComponentType<P & DP>) => ComponentType<P>;

    export function registerStore<S = {}>(
        namespace: string,
        options: StoreRegObj<S>,
    ): Store<S>;

    export function subscribe(func: () => void): () => void;
}
