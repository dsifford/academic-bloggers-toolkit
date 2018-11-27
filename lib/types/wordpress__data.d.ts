// Type definitions for @wordpress/data
// Definitions by: Derek P Sifford <dereksifford@gmail.com>
// tslint:disable:no-reserved-keywords

declare module '@wordpress/data' {
    import { ComponentType } from 'react';
    import { combineReducers, Reducer, Store } from 'redux';

    interface StoreRegObj<S> {
        reducer: Reducer<S>;
        actions: {
            [k: string]: (...args: any) => { type: string; [k: string]: any };
        };
        selectors?: {
            [k: string]: (state: S, ...args: any) => any;
        };
        resolvers?: {
            [k: string]: <T>(state: S, ...args: any) => IterableIterator<T>;
        };
    }

    type Selector<T> = (key: string) => T;
    type Dispatcher<T> = (key: string) => T;

    export { combineReducers } from 'redux';
    export function dispatch<T>(key: string): T;
    export function registerStore<S = {}>(
        namespace: string,
        options: StoreRegObj<S>,
    ): Store<S>;
    export function select<T>(key: string): T;
    export function subscribe(func: () => void): () => void;

    export function withDispatch<P, DP, T = any>(
        mapDispatchToProps: (dispatch: Dispatcher<T>, ownProps: P) => DP,
    ): (component: ComponentType<P & DP>) => ComponentType<P>;

    export function withSelect<P, DP, T = any>(
        mapDispatchToProps: (dispatch: Selector<T>, ownProps: P) => DP,
    ): (component: ComponentType<P & DP>) => ComponentType<P>;
}
