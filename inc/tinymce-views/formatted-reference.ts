interface Window {
  tinymce: any
}

interface HTMLElement {
  showHide(option?: 'show' | 'hide'): string
  hide(): void
  show(): void
}
HTMLElement.prototype.showHide = function(option?: 'show' | 'hide'): string {
  switch(option) {
    case 'show':
      this.style.display = '';
      break;
    case 'hide':
      this.style.display = 'none';
      break;
    default:
      this.style.display = this.style.display == 'none' ? '' : 'none';
  }
  return this.style.display;
}

class Modal {
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
    this.outer.style.height = height + 66 + 'px';
    this.inner.style.height = height + 30 + 'px';
  };

  private _getModal(): void {
    let outerModalID: string = top.document.querySelector('div.mce-floatpanel[aria-label="Insert Formatted Reference"]').id;
    let innerModalID: string = `${outerModalID}-body`;
    this.outer = top.document.getElementById(outerModalID);
    this.inner = top.document.getElementById(innerModalID);
    this.mainRect = document.getElementById('main-container');
  }

}



class ReferenceWindow {

  private modal: Modal = new Modal;

  public buttons = {
    toggleAddManually: <HTMLInputElement>document.getElementById('add-manually'),
    addAuthor: <HTMLInputElement>document.getElementById('add-author'),
  }

  public containers = {
    mainContainer: <HTMLDivElement>document.getElementById('main-container'),
    pubmedContainer: <HTMLDivElement>document.getElementById('pubmed-container'),
    manualContainer: <HTMLDivElement>document.getElementById('manual-container'),
  }

  public form: HTMLFormElement = <HTMLFormElement>document.getElementById('main-form');

  public tables = {
    authorTable: <HTMLTableElement>document.getElementById('author-table'),
  }

  public inputs = {
    pmidInput: <HTMLInputElement>document.getElementById('pmid-input'),
    includeLink: <HTMLInputElement>document.getElementById('include-link'),
  }

  public manualComponents = {
    journal: <HTMLDivElement>document.getElementById('manual-journal'),
    blog: <HTMLDivElement>document.getElementById('manual-blog'),
    website: <HTMLDivElement>document.getElementById('manual-website'),
  }

  public selections = {
    manualCitationType: <HTMLSelectElement>document.getElementById('manual-type-selection'),
  }

  constructor() {

    this.modal.resize();
    this._addAuthorRow();

    this.buttons.toggleAddManually.addEventListener('click', this._toggleAddManually.bind(this));
    this.buttons.addAuthor.addEventListener('click', this._addAuthorRow.bind(this));
    this.selections.manualCitationType.addEventListener('change', this._manualCitationChange.bind(this));
    this.form.addEventListener('submit', this._submitForm.bind(this));
  }

  private _manualCitationChange(e: Event): void {
    let selection = this.selections.manualCitationType.value;
    for (let key in this.manualComponents) {
      if (key == selection || key == '') { continue; }
      this.manualComponents[key].showHide('hide');
    }
    if (selection !== '' ) {
      this.manualComponents[selection].showHide('show');
    }
    this.modal.resize();
  }

  private _toggleAddManually(): void {
    this.containers.pubmedContainer.showHide();
    this.containers.manualContainer.showHide();

    this.inputs.pmidInput.disabled = !this.inputs.pmidInput.disabled;
    this.inputs.includeLink.disabled = !this.inputs.includeLink.disabled;
    this.selections.manualCitationType.disabled = !this.selections.manualCitationType.disabled;

    this.modal.resize();
  }

  private _addAuthorRow(): void {
    let newRow = this.tables.authorTable.insertRow();
    newRow.insertCell().appendChild(
      document.createTextNode('First Name')
    );

    let rowNum: number = this.tables.authorTable.rows.length;

    let firstNameInput = document.createElement('input');
    firstNameInput.type = 'text';
    firstNameInput.id = `author-fname-${rowNum}`;
    newRow.insertCell().appendChild(firstNameInput);

    newRow.insertCell().appendChild(
      document.createTextNode('Last Name')
    );

    let lastNameInput = document.createElement('input');
    lastNameInput.type = 'text';
    lastNameInput.id = `author-lname-${rowNum}`;
    newRow.insertCell().appendChild(lastNameInput);

    let removeRowButton = document.createElement('input');
    removeRowButton.type = 'button';
    removeRowButton.className = 'btn';
    removeRowButton.value = 'x';
    removeRowButton.addEventListener('click', (e: Event) => {
      let row = e.srcElement.parentElement.parentElement;
      row.remove();
      this.modal.resize();
    });
    newRow.insertCell().appendChild(removeRowButton);

    this.modal.resize();

  }

  private _submitForm(e: Event) {
    e.preventDefault();

    let wm = top.tinymce.activeEditor.windowManager;
    let formElement: HTMLFormElement = <HTMLFormElement>e.srcElement;
    let payload = {};
    let skippedFields: string[] = []

    for (let i = 0; i < formElement.length; i++) {
      let el = <HTMLInputElement>formElement[i];
      if(el.type == 'button'
      || el.type == 'submit'
      || el.value == ''
      || el.disabled ) { continue; }

      if (el.type == 'checkbox') {
        payload[el.id] = el.checked;
        continue;
      }

      payload[el.id] = el.value;
    }

    console.log(payload)

    wm.setParams({data: payload});
    wm.close();

  }

}

new ReferenceWindow;
