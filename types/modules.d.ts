declare module 'browser-sync-webpack-plugin';

declare module '*.scss' {
    const content: Record<string, string>;
    export = content;
}
