declare var tinymce, tinyMCE, AU_locationInfo

namespace Parsers {

  export class MainParser {

    public citationFormat: string;
    public static includeLink: boolean;
    public static manualCitationType: string;
    public PMIDquery: string;
    public editor: any;

    constructor(data: ReferenceFormData, editor: Object) {
      this.citationFormat = data['citation-format'];
      this.PMIDquery = data['pmid-input'] !== '' && data['pmid-input'] !== undefined
                     ? data['pmid-input'].replace(/\s/g, '')
                     : '';
      MainParser.manualCitationType = data['manual-type-selection'];
      MainParser.includeLink = data['include-link'];
      this.editor = editor;
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
      let type = MainParser.manualCitationType;

      let authors: Author[] = data.authors;
      let title: string = data[`${type}-title`].toTitleCase();
      let source: string = data[`${type}-source`];
      let pubdate: string = data[`${type}-date`] ? data[`${type}-date`] : '';
      let volume: string = data[`${type}-volume`] ? data[`${type}-volume`] : '';
      let issue: string = data[`${type}-issue`] ? data[`${type}-issue`] : '';
      let pages: string = data[`${type}-pages`] ? data[`${type}-pages`] : '';
      let lastauthor: string = data.authors[data.authors.length - 1].name;
      let url: string = data[`${type}-url`] ? data[`${type}-url`] : '';
      let accessdate: string = data[`${type}-accessed`] ? data[`${type}-accessed`] : '';

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
      }

      let payload: string[]|Error;
      switch (this.citationFormat) {
        case 'ama':
          let AMA = new Parsers.AMA;
          payload = AMA.parse([cleanedData]);
          break;
        case 'apa':
          let APA = new Parsers.APA;
          payload = APA.parse([cleanedData]);
          break;
        default:
          this.editor.windowManager.alert('An error occurred while trying to parse the citation');
          this.editor.setProgressState(0);
          return;
      }

      console.log(`OUTPUT:`);
      console.log(cleanedData);
      return;
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
          let AMA = new Parsers.AMA;
          payload = AMA.parse(res.result);
          break;
        case 'apa':
          let APA = new Parsers.APA;
          payload = APA.parse(res.result);
          break;
        default:
          this.editor.windowManager.alert('An error occurred while trying to parse the citation');
          this.editor.setProgressState(0);
          return;
      }

      if ((payload as Error).name === 'Error') {
        this.editor.windowManager.alert((payload as Error).message);
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

}
