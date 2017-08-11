// tslint:disable: no-typeof-undefined
export default function devtool() {
    if (process.env.NODE_ENV === 'development') {
        return require('mobx-react-devtools').default;
    }
    return () => null;
}

export function configureDevtool(options: {
    logEnabled?: boolean;
    updatesEnabled?: boolean;
    graphEnabled?: boolean;
    logFilter?(p: any): boolean;
}): void {
    if (process.env.NODE_ENV === 'development') {
        const cdt = require('mobx-react-devtools').configureDevtool;
        cdt(options);
    }
}
