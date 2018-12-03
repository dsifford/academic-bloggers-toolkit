declare module 'browser-sync-webpack-plugin';
declare module 'wp-pot';
declare module 'rollbar-sourcemap-webpack-plugin';
declare module 'rollbar/dist/rollbar.umd';
declare module '*.scss' {
    const content: {
        [identifier: string]: any;
    };
    export = content;
}
