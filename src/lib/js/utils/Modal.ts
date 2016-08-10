export class Modal {

    public title: string;
    public outer: HTMLElement;
    public inner: HTMLElement;
    public mceReset: HTMLElement;
    public mainRect: HTMLElement;
    public initialSize: {
        outer: number
        inner: number
    };

    constructor(title: string) {
        this.title = title;
        this._getModal();
        this.initialSize = {
            inner: parseInt(this.inner.style.height.substr(0, this.inner.style.height.length - 2), 10),
            outer: parseInt(this.outer.style.height.substr(0, this.outer.style.height.length - 2), 10),
        };
    }

    public resize(): void {
        let height = this.mainRect.getBoundingClientRect().height;
        if (top.window.innerHeight < height + 100) {
            height = top.window.innerHeight - 112;
        }
        const position = `calc(50% - ${(height + 56) / 2}px)`;
        this.outer.style.height = height + 56 + 'px';
        this.outer.style.top = position;
    };

    private _getModal(): void {
        const outerModalID: string = top.document.querySelector(`div.mce-floatpanel[aria-label="${this.title}"]`).id;
        const innerModalID: string = `${outerModalID}-body`;
        this.outer = top.document.getElementById(outerModalID);
        this.inner = top.document.getElementById(innerModalID);
        this.mceReset = this.outer.children[0] as HTMLElement;
        this.mainRect = document.getElementById('main-container');
        this.mceReset.style.height = '100%';
        this.inner.style.height = '100%';
        this.inner.style.maxHeight = 'calc(100vh - 112px)';
        document.body.style.overflowY = 'auto';
    }

}
