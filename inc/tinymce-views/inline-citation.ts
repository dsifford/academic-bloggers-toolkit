
class InlineCitationWindow {

  public editorContent: HTMLBodyElement;
  public refList: HTMLOListElement;

  constructor() {
    this.editorContent = top.tinymce.activeEditor.dom.doc.body;

    let test = this.editorContent.children
    for (let i = test.length - 1; i > 0; i--) {
      if (test[i].tagName === 'OL') {
        this.refList = (test[i] as HTMLOListElement);
        break;
      }
    }
    console.log(this.refList);

  }
}

new InlineCitationWindow;
