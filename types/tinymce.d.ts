// Internal, arguably useless type definitions for tinymce
// Project: https://github.com/tinymce/tinymce
// Definitions by: Derek P Sifford <https://github.com/dsifford>

declare module 'tinymce' {
    export interface Editor {
        id: string;
        initialized: boolean;
        dom: {
            createRng(): Range;
        };
        selection: {
            getBookmark(type?: 1, normalized?: boolean): { rng: Range };
            getContent(args: { format: 'html' | 'text' }): string;
            setContent(content: string, args?: { format: string }): string;
            setCursorLocation(node?: Node, offset?: number): void;
            moveToBookmark(bookmark: object): boolean;
        };
        undoManager: {
            /**
             * Clears the undo history
             */
            clear(): void;
        };
        windowManager: {
            alert(message: string, callback?: () => void, scope?: object): void;
        };
        addShortcut(keys: string, title: string, func: () => void): void;
        focus(): void;
        getBody(): HTMLBodyElement;
        getContent(args: { format: 'html' | 'text' }): string;
        getDoc(): HTMLDocument;
        insertContent(content: string): void;
        on(eventName: string, callback: (e: any) => void): void;
        once(eventName: string, callback: (e: any) => void): void;
        setContent(content: string, args?: object): string;
        /**
         * true = loading
         * false = not loading
         */
        setProgressState(state: boolean): void;
    }

    export interface TinyMCE {
        EditorManager: Editor;
        editors: Editor[] & { [editorId: string]: Editor };
        on(eventName: string, callback: () => void): void;
    }
}
