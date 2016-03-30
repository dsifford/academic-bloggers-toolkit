import { AMA, APA } from './Parsers';


export default class Dispatcher {
  public citationFormat: string;
  public includeLink: boolean;
  public manualCitationType: string;
  public PMIDquery: string;
  public editor: any;
  public smartBib: HTMLOListElement|boolean

  constructor(data: ReferenceFormData, editor: Object) {
    this.citationFormat = data['citation-format'];
    this.PMIDquery = data['pmid-input'] !== '' && data['pmid-input'] !== undefined
                   ? data['pmid-input'].replace(/\s/g, '')
                   : '';
    this.manualCitationType = data['manual-type-selection'];
    this.includeLink = data['include-link'];
    this.editor = editor;
    let smartBib = <HTMLOListElement>(this.editor.dom.doc as HTMLDocument)
                      .getElementById('abt-smart-bib') as HTMLOListElement;
    this.smartBib = smartBib || false;
  }

  public fromPMID(): void {
    let requestURL = `http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${this.PMIDquery}&version=2.0&retmode=json`;
    let request = new XMLHttpRequest();
    request.open('GET', requestURL, true);
    request.addEventListener('load', this._parsePMID.bind(this));
    request.send(null);
  }

  public fromManualInput(data: ReferenceFormData): void {
    let cleanedData: ReferenceObj;
    let type = this.manualCitationType;

    // Reformat name to Last Name, First Initial
    let authors: Author[] = data.authors.map((author: Author) => {
      let name =
        `${author.name.split(' ')[1]} ${author.name.split(' ')[0][0]}`;
      return {name};
    })

    let title: string = data[`${type}-title`].toTitleCase();
    let source: string = data[`${type}-source`];
    let pubdate: string = data[`${type}-date`] || '';
    let volume: string = data[`${type}-volume`] || '';
    let issue: string = data[`${type}-issue`] || '';
    let pages: string = data[`${type}-pages`] || '';
    let lastauthor: string = data.authors.length > 0
      ? data.authors[data.authors.length - 1].name
      : '';
    let url: string = data[`${type}-url`] || '';
    let accessdate: string = data[`${type}-accessed`] || '';
    let updated: string = data[`${type}-updated`] || '';
    let location: string = data[`${type}-location`] || '';
    let chapter: string = data[`${type}-chapter`] || '';
    let edition: string = data[`${type}-edition`] || '';


    cleanedData = {
      authors,
      title,
      source,
      pubdate,
      volume,
      issue,
      pages,
      lastauthor,
      url,
      accessdate,
      updated,
      location,
      chapter,
      edition,
    }

    let payload: string[]|Error;
    switch (this.citationFormat) {
      case 'ama':
        let ama = new AMA(this.includeLink, this.manualCitationType);
        payload = ama.parse([cleanedData]);
        break;
      case 'apa':
        let apa = new APA(this.includeLink, this.manualCitationType);;
        payload = apa.parse([cleanedData]);
        break;
      default:
        this.editor.windowManager.alert('An error occurred while trying to parse the citation');
        this.editor.setProgressState(0);
        return;
    }

    this._deliverContent(payload);

  }


  private _parsePMID(e: Event): void {
    let req = <XMLHttpRequest>e.target;

    // Handle bad request
    if (req.readyState !== 4 || req.status !== 200) {
      this.editor.windowManager.alert('Your request could not be processed. Please try again.');
      this.editor.setProgressState(0);
      return;
    }

    let res = JSON.parse(req.responseText);

    // Handle response errors
    if (res.error) {
      let badPMID = res.error.match(/uid (\S+)/)[1];
      let badIndex = this.PMIDquery.split(',').indexOf(badPMID);
      this.editor.windowManager.alert(
        `PMID "${badPMID}" at index #${badIndex + 1} failed to process. Double check your list!`
      );
    }

    let payload: string[]|Error;
    switch (this.citationFormat) {
      case 'ama':
        let ama = new AMA(this.includeLink, this.citationFormat);
        payload = ama.parse(res.result);
        break;
      case 'apa':
        let apa = new APA(this.includeLink, this.citationFormat);
        payload = apa.parse(res.result);
        break;
      default:
        this.editor.windowManager.alert('An error occurred while trying to parse the citation');
        this.editor.setProgressState(0);
        return;
    }

    this._deliverContent(payload);

  }

  private _deliverContent(payload: string[]|Error): void {
    if ((payload as Error).name === 'Error') {
      this.editor.windowManager.alert((payload as Error).message);
      this.editor.setProgressState(0);
      return;
    }

    if (this.smartBib) {
      for (let key in (payload as string[])) {
        let listItem = (this.editor.dom.doc as HTMLDocument).createElement('LI');
        listItem.innerHTML = payload[key];
        (this.smartBib as HTMLOListElement).appendChild(listItem);
      }
      this.editor.setProgressState(0);
      return;
    }

    if ((payload as string[]).length === 1) {
      this.editor.insertContent((payload as string[]).join());
      this.editor.setProgressState(0);
      return;
    }

    let orderedList: string =
      '<ol>' + (payload as string[]).map((ref: string) => `<li>${ref}</li>`).join('') + '</ol>';

    this.editor.insertContent(orderedList);
    this.editor.setProgressState(0);
  }
}
