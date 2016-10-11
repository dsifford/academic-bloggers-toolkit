export class Modal {

    title: string;
    outer: HTMLElement;
    inner: HTMLElement;
    mainRect: HTMLElement;

    constructor(title: string) {
        this.title = title;
        this.getModal();
    }

    public resize(): void {
        const dims = this.mainRect.getBoundingClientRect();
        const height = dims.height + 35;
        const width = this.mainRect.scrollWidth;
        const position = (window.innerHeight / 2) - (height / 2);
        this.outer.style.width = `${width}px`;
        this.mainRect.style.width = `${width}px`;
        this.inner.style.width = `${width}px`;
        this.outer.style.top = position < 0 ? '0px' : `${position}px`;
        this.outer.style.left = `calc(${top.document.body.clientWidth / 2}px - ${width / 2}px)`;
    };

    private getModal(): void {
        const outerModalID: string = top.document.querySelector(`div.mce-floatpanel[aria-label="${this.title}"]`).id;
        this.outer = top.document.getElementById(outerModalID);
        this.inner = top.document.getElementById(`${outerModalID}-body`);
        this.mainRect = document.getElementById('main-container');
        this.outer.style.transition = 'top 0.2s ease-out';
    }

}
