declare module 'browser-sync-webpack-plugin';
declare module 'rollup-plugin-commonjs';
declare module 'rollup-plugin-node-resolve';
declare module 'rollup-plugin-terser';

declare module '*.scss' {
    const content: Record<string, string>;
    export = content;
}
