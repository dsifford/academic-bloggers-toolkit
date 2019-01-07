declare module 'browser-sync-webpack-plugin';
declare module 'wp-pot';

declare module '*.scss' {
    const content: Record<string, string>;
    export = content;
}
