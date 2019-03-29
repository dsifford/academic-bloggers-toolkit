declare module 'browser-sync-webpack-plugin';
declare module 'rollup-plugin-commonjs';
declare module 'rollup-plugin-node-resolve';
declare module 'rollup-plugin-terser';

declare module '*.scss' {
    const content: Record<string, string>;
    export = content;
}

declare module 'tinymce' {
    export interface Editor {
        initialized: boolean;
        selection: {
            getBookmark(type?: 1, normalized?: boolean): { rng: Range };
            getContent(args: { format: 'html' | 'text' }): string;
            setContent(content: string, args?: { format: string }): string;
            setCursorLocation(node?: Node, offset?: number): void;
            moveToBookmark(bookmark: object): boolean;
        };
        windowManager: {
            alert(message: string, callback?: () => void, scope?: object): void;
        };
        addShortcut(keys: string, title: string, func: () => void): void;
        focus(): void;
        getBody(): HTMLBodyElement;
        getDoc(): HTMLDocument;
        insertContent(content: string): void;
        on(eventName: string, callback: (e: any) => void): void;
        /**
         * true = loading
         * false = not loading
         */
        setProgressState(state: boolean): void;
    }

    export interface TinyMCE {
        editors: Editor[] & { [editorId: string]: Editor };
    }
}
