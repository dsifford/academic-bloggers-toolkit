// tslint:disable: no-typeof-undefined
export default function devtool(): any {
    if (process.env.NODE_ENV !== 'production') {
        return require('mobx-react-devtools').default;
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
