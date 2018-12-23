declare module 'browser-sync-webpack-plugin';
declare module 'rollbar-sourcemap-webpack-plugin';
declare module 'rollbar/dist/rollbar.umd';
declare module 'wp-pot';

declare module '*.scss' {
    const content: Record<string, string>;
    export = content;
}
