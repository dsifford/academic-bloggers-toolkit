import AsyncLoad from '_legacy/utils/async-load';
import React from 'react';

export default function devtool(props: any): any {
    if (process.env.NODE_ENV !== 'production') {
        return (
            <AsyncLoad
                component={import('mobx-react-devtools').then(
                    mod => mod.default,
                )}
                {...props}
            />
        );
    }
    return (): null => null;
}

export function configureDevtool(options: {
    graphEnabled?: boolean;
    logEnabled?: boolean;
    updatesEnabled?: boolean;
    logFilter?(p: any): boolean;
}): void {
    if (process.env.NODE_ENV !== 'production') {
        const cdt = require('mobx-react-devtools').configureDevtool;
        cdt(options);
    }
}
