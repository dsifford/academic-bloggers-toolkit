// tslint:disable:no-default-export no-typeof-undefined
export default function devtool() {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
        return require('mobx-react-devtools').default;
    }
    return () => null;
}

export function configureDevtool(options: {
    logEnabled?: boolean;
    updatesEnabled?: boolean;
    graphEnabled?: boolean;
    logFilter?: (p: any) => boolean;
}): void {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
        const cdt = require('mobx-react-devtools').configureDevtool;
        cdt(options);
    }
}
