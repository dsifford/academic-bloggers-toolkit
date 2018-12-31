// Type definitions for @wordpress/compose
// Project: https://github.com/WordPress/gutenberg/tree/master/packages/compose
// Definitions by: Derek P Sifford <https://github.com/dsifford>

import { flowRight } from 'lodash';
import { ComponentClass, FC } from 'react';

// export {
//     default as createHigherOrderComponent,
// } from './create-higher-order-component';
// export { default as ifCondition } from './if-condition';
// export { default as pure } from './pure';
// export { default as remountOnPropChange } from './remount-on-prop-change';
// export { default as withGlobalEvents } from './with-global-events';
// export { default as withInstanceId } from './with-instance-id';
// export { default as withSafeTimeout } from './with-safe-timeout';
// export { default as withState } from './with-state';

export namespace withState {
    type SetStateFunc<S, K extends keyof S, P> = (
        prevState: Readonly<S>,
        props: Readonly<P>,
    ) => Pick<S, K> | S | null;
    export type Props<S, OP = {}> = S & {
        setState<K extends keyof S>(
            state: SetStateFunc<S, K, OP> | ReturnType<SetStateFunc<S, K, OP>>,
        ): void;
    };
}

export function withState<S = {}, OP = {}>(
    initialState: S,
): (component: FC<OP & withState.Props<S, OP>>) => ComponentClass<OP, S>;

export { flowRight as compose };
