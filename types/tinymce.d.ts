// tslint:disable no-namespace

declare namespace TinyMCE {

    interface MCE {
        DOM: Object;
        EditorManager;
        PluginManager: PluginManager;
        EditorObservable;
        Env;
        WindowManager;
        dom: Object;
        editors: Editor[];
        activeEditor: Editor;
        add(editor: Editor): Editor;
        remove(e?: string): void;
    }

    interface Editor {
        id: string;
        buttons: Object;
        container: HTMLDivElement;
        contentDocument: HTMLDocument;
        contentWindow: Window;
        controlManager: Object;
        dom: {
            create(tag: string, attrs: { [attr: string]: string}, children?: string): HTMLElement;
            doc: Document;
            getStyle(element: HTMLElement, name: string, computed: boolean): string;
        };
        selection: {
            bookmarkManager: {
                getBookmark(type?: number, normalized?: boolean): Object;
                moveToBookmark(bookmark: Object): boolean
            }
            collapse(toStart: boolean): void;
            getBookmark(type?: number, normalized?: boolean): Object;
            getNode(): Node;
            getContent(args: { format: 'html'|'text' }): string;
            moveToBookmark(bookmark: Object): boolean;
            select(el: HTMLElement, content: boolean);
            setCursorLocation(a): void;
        };
        settings: {
            params;
        };
        target: Object;
        windowManager: WindowManager;
        wp: Object;
        addButton(buttonID: string, buttonObj: Object): void;
        addShortcut(keys: string, title: string, func: Function): void;
        getBody(): HTMLBodyElement;
        getContent(): string;
        setContent(content: string, args?: Object): string;
        insertContent(content: string): void;
        on(eventString: string, callback: Function): void;
        /** true = loading; false = not loading */
        setProgressState(state: boolean): void;
    }

    interface WindowManager {
        data?: Object;
        editor?: Editor;
        windows?;
        alert?(message: string, callback?: Function, scope?: Object): void;
        close?(): void;
        confirm?(message: string, callback?: Function, scope?: Object): void;
        onClose?(e): void;
        onOpen?(e): void;
        open?(window: WindowMangerObject): void;
        setParams?(paramObj): void;
        submit?(): () => void;
    }

    interface PluginManager {
        add(pluginName: string, callback: Function);
    }

    interface MenuItem {
        text: string;
        menu?: MenuItem[];
        onclick?: (e?: Event) => void;
        disabled?: boolean;
        id?: string;
    }

    interface WindowElement {
        type: string;
        name?: string;
        label?: string;
        value?: string;
        html?: string;
        tooltip?: string;
    }

    interface WindowMangerObject {
        title: string;
        width?: number;
        height?: number;
        body?: WindowElement[];
        url?: string;
        buttons?: Object;
        params?: Object;
        onclose?(e);
        onsubmit?(e);
    }
}
