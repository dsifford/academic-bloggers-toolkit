// tslint:disable no-namespace
declare namespace TinyMCE {
    interface Editor {
        id: string;
        initialized: boolean;
        dom: {
            createRng(): Range;
        };
        selection: {
            getBookmark(type: 1, normalized?: boolean): { rng: Range };
            /** Don't use */
            getBookmark(
                type: 2,
                normalized?: boolean,
            ): { start: number[]; end?: number[] };
            /** Don't use */
            getBookmark(
                type: 3,
                normalized?: boolean,
            ): { start: string; end: string };
            /** Don't use */
            getBookmark(type?: number, normalized?: boolean): { id: string };
            getContent(args: { format: 'html' | 'text' }): string;
            setContent(content: string, args?: { format: string }): string;
            moveToBookmark(bookmark: object): boolean;
            /** Is the the current selection completely empty? */
            isCollapsed(): boolean;
        };
        undoManager: {
            /** Clears the undo history */
            clear(): void;
        };
        windowManager: WindowManager;
        addShortcut(keys: string, title: string, func: () => void): void;
        focus(): void;
        getBody(): HTMLBodyElement;
        getContent(args: { format: 'html' | 'text' }): string;
        getDoc(): HTMLDocument;
        insertContent(content: string): void;
        on(eventName: string, callback: (e: any) => void): void;
        once(eventName: string, callback: (e: any) => void): void;
        setContent(content: string, args?: object): string;
        /** true = loading; false = not loading */
        setProgressState(state: boolean): void;
    }

    interface MCE {
        EditorManager: Editor;
        editors: Editor[] & { [editorId: string]: Editor };
        on(eventName: string, callback: () => void): void;
    }

    interface WindowManager {
        alert(message: string, callback?: () => void, scope?: object): void;
    }
}
