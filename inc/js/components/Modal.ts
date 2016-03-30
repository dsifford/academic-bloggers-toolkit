export default class Modal {

  public title: string
  public outer: HTMLElement
  public inner: HTMLElement
  public mainRect: HTMLElement
  public initialSize: {
    outer: number
    inner: number
  }

  constructor(title: string) {
    this.title = title;
    this._getModal();
    this.initialSize = {
      outer: parseInt(this.outer.style.height.substr(0, this.outer.style.height.length - 2)),
      inner: parseInt(this.inner.style.height.substr(0, this.inner.style.height.length - 2)),
    }
  }

  public resize(): void {
    let height = this.mainRect.getBoundingClientRect().height;
    let position = `calc(50% - ${(height + 66) / 2}px)`;
    this.outer.style.height = height + 66 + 'px';
    this.inner.style.height = height + 30 + 'px';
    this.outer.style.top = position;
  };

  private _getModal(): void {
    let outerModalID: string = top.document.querySelector(`div.mce-floatpanel[aria-label="${this.title}"]`).id;
    let innerModalID: string = `${outerModalID}-body`;
    this.outer = top.document.getElementById(outerModalID);
    this.inner = top.document.getElementById(innerModalID);
    this.mainRect = document.getElementById('main-container');
  }

}
