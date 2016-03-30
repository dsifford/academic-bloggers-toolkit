import Modal from '../../components/Modal.ts';

class InlineCitationWindow {

  private modal: Modal = new Modal('Inline Citation');
  private editorDOM: HTMLDocument;
  public refList: HTMLOListElement|boolean;
  private smartBibRender: HTMLDivElement;

  constructor() {
    this.editorDOM = top.tinyMCE.activeEditor.dom.doc;

    let smartBib = this.editorDOM.getElementById('abt-smart-bib');
    this.refList = (smartBib as HTMLOListElement) || false;
    this.smartBibRender = document.getElementById('smart-bib-render') as HTMLDivElement;

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
