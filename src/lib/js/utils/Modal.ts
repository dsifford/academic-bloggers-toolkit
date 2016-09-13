export class Modal {

    title: string;
    outer: HTMLElement;
    mainRect: HTMLElement;

    constructor(title: string) {
        this.title = title;
        this.getModal();
    }

    public resize(): void {
        let height = this.mainRect.getBoundingClientRect().height + 35;
        const position = (window.innerHeight / 2) - (height / 2);
        this.outer.style.top = position < 0 ? '0px' : `${position}px`;
    };

    private getModal(): void {
        const outerModalID: string = top.document.querySelector(`div.mce-floatpanel[aria-label="${this.title}"]`).id;
        this.outer = top.document.getElementById(outerModalID);
        this.mainRect = document.getElementById('main-container');
        this.outer.style.transition = 'top 0.2s ease-out';
    }

}
