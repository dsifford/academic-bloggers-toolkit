import { showHide } from '../../utils/HelperFunctions.ts';
import Modal from '../../components/Modal.ts';

class ReferenceWindow {

  private modal: Modal = new Modal('Insert Formatted Reference');

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
    website: <HTMLDivElement>document.getElementById('manual-website'),
    book: <HTMLDivElement>document.getElementById('manual-book'),
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
      showHide(this.manualComponents[key], 'hide');
    }
    if (selection !== '' ) {
      showHide(this.manualComponents[selection], 'show');
    }
    this._adjustRequiredFields(selection);
    this.modal.resize();
  }

  private _toggleAddManually(): void {
    showHide(this.containers.pubmedContainer);
    showHide(this.containers.manualContainer);

    this.inputs.pmidInput.disabled = !this.inputs.pmidInput.disabled;
    this.inputs.includeLink.disabled = !this.inputs.includeLink.disabled;
    this.selections.manualCitationType.disabled = !this.selections.manualCitationType.disabled;

    // Make all fields not required
    if (this.selections.manualCitationType.disabled === true) {
      this._adjustRequiredFields('REQUIRE NONE');
    } else {
      this._adjustRequiredFields(this.selections.manualCitationType.value);
    }

    this.buttons.toggleAddManually.value =
      this.buttons.toggleAddManually.value === 'Add Reference Manually'
      ? 'Add Reference with PMID'
      : 'Add Reference Manually';

    this.modal.resize();
  }

  private _adjustRequiredFields(selection: string): void {

    for (let key in this.manualComponents) {

      let fields = document.querySelectorAll(`input[id^=${key}-][data-required]`);
      let required: boolean = key === selection ? true : false;

      for (let i = 0; i < fields.length; i++) {
        (document.getElementById(fields[i].id) as HTMLInputElement).required = required;
      }

    }

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
    let payload: Object = {};
    let authorList: Object = {};

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

      if (el.id.search(/^author-fname/) > -1 || el.id.search(/^author-lname/) > -1) {
        let capitalizedName = el.value[0].toUpperCase() + el.value.substr(1).toLowerCase();
        authorList[el.id] = capitalizedName;
        continue;
      }

      payload[el.id] = el.value;
    }

    // Prepare author data
    payload['authors'] = [];
    for (let i = 0; i < (Object.keys(authorList).length / 2); i++) {
      let author = {
        name: authorList[`author-fname-${i + 1}`] + ' ' + authorList[`author-lname-${i + 1}`]
      }
      payload['authors'].push(author);
    }

    wm.setParams({data: payload});
    wm.close();

  }

}

new ReferenceWindow;
