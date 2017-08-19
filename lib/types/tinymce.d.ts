// tslint:disable no-namespace
declare namespace TinyMCE {
    interface Editor {
        id: string;
        initialized: boolean;
        windowManager: WindowManager;
        dom: {
            create<T extends HTMLElement>(
                tag: string,
                attrs: { [attr: string]: string },
                children?: string,
            ): T;
        };
        selection: {
            getBookmark(type?: number, normalized?: boolean): { id: string };
            getContent(args: { format: 'html' | 'text' }): string;
            setContent(content: string, args?: { format: string }): string;
            moveToBookmark(bookmark: object): boolean;
            /** Is the the current selection completely empty? */
            isCollapsed(): boolean;
        };
        addShortcut(keys: string, title: string, func: () => void): void;
        getBody(): HTMLBodyElement;
        getDoc(): HTMLDocument;
        setContent(content: string, args?: object): string;
        insertContent(content: string): void;
        on(eventString: string, callback: (e: any) => void): void;
        /** true = loading; false = not loading */
        setProgressState(state: boolean): void;
    }

    interface MCE {
        editors: Editor[] & { [editorId: string]: Editor };
    }

    interface WindowManager {
        alert(message: string, callback?: () => void, scope?: object): void;
    }
}
