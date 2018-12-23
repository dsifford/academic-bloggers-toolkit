// Type definitions for @wordpress/element
// Definitions by: Derek P Sifford <dereksifford@gmail.com>

import * as R from 'react';

declare global {
    namespace React {
        export const RawHTML: R.ComponentType<{ children: string }>;
    }
}

export = React;
