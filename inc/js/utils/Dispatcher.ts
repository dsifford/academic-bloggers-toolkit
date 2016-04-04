import { AMA, APA } from './Parsers';
import './PrototypeFunctions';

export default class Dispatcher {
  public citationFormat: string;
  public includeLink: boolean;
  public attachInline: boolean;
  public manualCitationType: string;
  public PMIDquery: string;
  public editor: any;
  public smartBib: HTMLOListElement|boolean

  constructor(data: ReferenceFormData, editor: Object) {
    this.citationFormat = data.citationFormat;
    this.PMIDquery = data.pmidList !== ''
                   ? data.pmidList.replace(/\s/g, '')
                   : '';
    this.manualCitationType = data.manualData.type;
    this.includeLink = data.includeLink;
    this.attachInline = data.attachInline;
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

    // Reformat name to <last> <firstinitial><middleinitial>
    let authors: Author[] = data.manualData.authors.map((author: any) => {
      let name = this._prepareName(author);
      return { name };
    });

    let meta: JournalMeta|BookMeta|WebsiteMeta = data.manualData.meta[type];

    let title: string = meta.title.toTitleCase();
    let source: string = meta.source;
    let pubdate: string = meta.pubdate;
    let lastauthor: string = data.manualData.authors.length > 0
      ? this._prepareName(data.manualData.authors[data.manualData.authors.length - 1])
      : '';

    let volume: string;
    let issue: string;
    let pages: string;

    let url: string;
    let accessdate: string;
    let updated: string;

    let location: string;
    let chapter: string;
    let edition: string;

    switch (type) {
      case 'journal':
        volume = (meta as JournalMeta).volume;
        issue = (meta as JournalMeta).issue;
        pages = (meta as JournalMeta).pages;
        break;
      case 'website':
        url = (meta as WebsiteMeta).url;
        accessdate = (meta as WebsiteMeta).accessed;
        updated = (meta as WebsiteMeta).updated;
        break;
      case 'book':
        pages = (meta as BookMeta).pages;
        location = (meta as BookMeta).location;
        chapter = (meta as BookMeta).chapter;
        edition = (meta as BookMeta).edition;
        break;
    }

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

  private _prepareName(author: Author): string {
    return( author.lastname[0].toUpperCase() +
      author.lastname.substring(1, author.lastname.length) + ' ' +
      author.firstname[0].toUpperCase() + author.middleinitial.toUpperCase()
    )
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
      let beforeLength: number = (this.smartBib as HTMLOListElement).children.length + 1;
      for (let key in (payload as string[])) {
        let listItem = (this.editor.dom.doc as HTMLDocument).createElement('LI');
        listItem.innerHTML = payload[key];
        (this.smartBib as HTMLOListElement).appendChild(listItem);
      }
      if (this.attachInline) {
        let afterLength: number = (this.smartBib as HTMLOListElement).children.length;
        this.editor.insertContent(`[cite num="${beforeLength}${afterLength > beforeLength ? '-' + afterLength : ''}"]`);
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
