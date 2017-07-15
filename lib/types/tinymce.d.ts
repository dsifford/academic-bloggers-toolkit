// tslint:disable no-namespace

declare namespace TinyMCE {
    interface MCE {
        DOM: object;
        EditorManager: any;
        PluginManager: PluginManager;
        // EditorObservable;
        // Env;
        // WindowManager;
        dom: object;
        editors: Editor[] & { [editorId: string]: Editor };
        activeEditor: Editor;
        add(editor: Editor): Editor;
        remove(e?: string): void;
    }

    interface Editor {
        id: string;
        buttons: object;
        container: HTMLDivElement;
        contentDocument: HTMLDocument;
        contentWindow: Window;
        controlManager: object;
        initialized: boolean;
        target: object;
        windowManager: WindowManager;
        wp: object;
        dom: {
            doc: Document;
            create<T extends HTMLElement>(
                tag: string,
                attrs: { [attr: string]: string },
                children?: string
            ): T;
            getStyle(element: HTMLElement, name: string, computed: boolean): string;
        };
        selection: {
            bookmarkManager: {
                getBookmark(type?: number, normalized?: boolean): object; // tslint:disable-line
                moveToBookmark(bookmark: object): boolean;
            };
            collapse(toStart: boolean): void;
            getBookmark(type?: number, normalized?: boolean): object; // tslint:disable-line
            getNode(): Node;
            getContent(args: { format: 'html' | 'text' }): string;
            setContent(content: string, args?: { format: string }): string;
            moveToBookmark(bookmark: object): boolean;
            // select(el: HTMLElement, content: boolean);
            // setCursorLocation(a): void;
        };
        // settings: {
        //     params: any;
        // };
        addButton(buttonID: string, buttonObj: object): void;
        addShortcut(keys: string, title: string, func: () => void): void;
        getBody(): HTMLBodyElement;
        getDoc(): HTMLDocument;
        getContent(): string;
        setContent(content: string, args?: object): string;
        insertContent(content: string): void;
        on(eventString: string, callback: () => void): void;
        /** true = loading; false = not loading */
        setProgressState(state: boolean): void;
    }

    interface EditorManager {
        get(editorId: string): TinyMCE.Editor;
    }

    interface WindowManager {
        data?: {
            [k: string]: any;
        };
        editor?: Editor;
        windows: any;
        alert(message: string, callback?: () => void, scope?: object): void;
        close(): void;
        confirm(message: string, callback?: () => void, scope?: object): void;
        onClose(e: Event): void;
        onOpen(e: Event): void;
        open(window: WindowMangerObject): void;
        setParams(paramObj: object): void;
        submit(): () => void;
    }

    interface PluginManager {
        add(pluginName: string, callback: (editor: Editor) => void): void;
    }

    interface MenuItem {
        text: string;
        menu?: MenuItem[];
        onclick?: (e?: Event) => void;
        disabled?: boolean;
        id?: string;
    }

    interface WindowElement {
        type: string; // tslint:disable-line
        name?: string;
        label?: string;
        value?: string;
        html?: string;
        tooltip?: string;
    }

    interface MCEEventTarget extends EventTarget {
        params: {
            [k: string]: any;
        };
        data: {
            [k: string]: any;
        };
    }

    interface MCEEvent extends Event {
        target: MCEEventTarget;
    }

    interface WindowMangerObject {
        title: string;
        width?: number;
        height?: number;
        body?: WindowElement[];
        url?: string;
        buttons?: object;
        params?: object;
        onclose?(e: MCEEvent): void;
        onsubmit?(e: MCEEvent): void;
    }
}
