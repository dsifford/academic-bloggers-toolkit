
class InlineCitationModal {
  public outer: HTMLElement;
  public inner: HTMLElement;
  public mainRect: HTMLElement;
  public initialSize: {
    outer: number
    inner: number
  }

  constructor() {
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
    let outerModalID: string = top.document.querySelector('div.mce-floatpanel[aria-label="Inline Citation"]').id;
    let innerModalID: string = `${outerModalID}-body`;
    this.outer = top.document.getElementById(outerModalID);
    this.inner = top.document.getElementById(innerModalID);
    this.mainRect = document.getElementById('main-container');
  }

}


class InlineCitationWindow {

  private modal: InlineCitationModal = new InlineCitationModal;
  private editorDOM: HTMLDocument;
  public refList: HTMLOListElement|boolean;
  private smartBibRender: HTMLDivElement;

  constructor() {
    this.editorDOM = top.tinymce.activeEditor.dom.doc;

    let smartBib = this.editorDOM.getElementById('abt-smart-bib');
    this.refList = (smartBib as HTMLOListElement) || false;
    this.smartBibRender = (document.getElementById('smart-bib-render') as HTMLDivElement);

    if (this.refList) {
      let orderedList = document.createElement('OL');
      for (let i = 0; i < (this.refList as HTMLOListElement).childElementCount; i++) {
        let liContent = (this.refList as HTMLOListElement).children[i].innerHTML;
        let listItem = document.createElement('li');
        listItem.innerHTML = liContent;
        orderedList.appendChild(listItem);
      }
      this.smartBibRender.appendChild(orderedList);
    }

    this.modal.resize();

  }
}

new InlineCitationWindow;
