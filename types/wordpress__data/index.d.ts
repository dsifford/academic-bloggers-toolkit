// Type definitions for @wordpress/data
// Project: https://github.com/WordPress/gutenberg/tree/master/packages/data
// Definitions by: Derek P Sifford <https://github.com/dsifford>

import { ComponentType } from 'react';
import { AnyAction, combineReducers, Reducer, Store } from 'redux';

export { AnyAction as Action, combineReducers, Reducer } from 'redux';

export type Controls = Record<string, (action: AnyAction) => Promise<any>>;

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
        [k: string]: (...args: any) => IterableIterator<any> | any;
    };
}

export function dispatch<T>(key: string): Record<string, (...args: any[]) => T>;

export function select<T>(key: string): Record<string, (...args: any[]) => T>;

export function withDispatch<DP, P = {}, IP = {}>(
    mapDispatchToProps: (
        disp: typeof dispatch,
        ownProps: P & IP,
        registry: { select: typeof select },
    ) => DP,
): (component: ComponentType<P & IP & DP>) => ComponentType<P>;

export function withSelect<SP, P = {}>(
    mapSelectToProps: (sel: typeof select, ownProps: P) => SP,
): (component: ComponentType<P & SP>) => ComponentType<P>;

export function registerStore<S = {}>(
    namespace: string,
    options: StoreRegObj<S>,
): Store<S>;

export function subscribe(func: () => void): () => void;
