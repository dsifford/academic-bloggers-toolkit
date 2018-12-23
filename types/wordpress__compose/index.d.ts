// Type definitions for @wordpress/compose
// Project: https://github.com/WordPress/gutenberg/tree/master/packages/compose
// Definitions by: Derek P Sifford <https://github.com/dsifford>

import { flowRight } from 'lodash';
import { ComponentClass, FunctionComponent } from 'react';

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

export function withState<P = {}, S = {}>(
    initialState: S,
): (
    component: FunctionComponent<P & S & { setState: (state: S) => void }>,
) => ComponentClass<P, S>;

export { flowRight as compose };
