/// <reference path="../main-parser.ts"/>

namespace Parsers {

  export class AMA {

    public parse(data: ReferencePayload): string[]|Error {
      let pmidArray: string[]|boolean = data.uids || false;

      if (pmidArray) {
        return this._fromPMID(data, (pmidArray as string[]));
      }

      return this._fromManual(data);
    }

    private _fromPMID(data: ReferencePayload, pmidArray: string[]): string[]|Error {
      let output: string[]|Error;
      try {
        output = pmidArray.map((PMID: string): string => {
          let ref: ReferenceObj = data[PMID];
          let year: string = ref.pubdate.substr(0, 4);
          let link  = MainParser.includeLink === true
                    ? ` PMID: <a href="http://www.ncbi.nlm.nih.gov/pubmed/${PMID}" target="_blank">${PMID}</a>`
                    : '';

          let authors: string|Error = this._parseAuthors(ref.authors);
          if ((authors as Error).name === 'Error') {
            throw authors;
          }

          return `${authors} ${ref.title} <em>${ref.source}.</em> ${year}; ` +
                 `${ref.volume === undefined || ref.volume === '' ? '' : ref.volume}` +
                 `${ref.issue === undefined || ref.issue === '' ? '' : '('+ref.issue+')'}:` +
                 `${ref.pages}.${link}`;
        });
      } catch(e) {
        return e;
      }
      return output;
    }

    private _fromManual(data: ReferencePayload): string[] {
      /** TODO */

      switch (MainParser.manualCitationType) {
        case 'journal':
          // do stuff
          break;
        case 'blog':
          // do stuff
          break;
        case 'website':
          // do stuff
          break;
        default:
          // return an error
      }

      console.log('MADE IT DO FROM MANUAL')
      console.log(data);

      return ['unfinished'];
    }

    private _parseAuthors(authorArr: Author[]): string|Error {
      let authors: string = '';
      switch (authorArr.length) {
        case 0:
          return new Error(`No authors were found for given reference`);
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
          authors = authorArr.map((author: Author) => author.name).join(', ') + '.';
          break;
        default:
          for (let i = 0; i < 3; i++) { authors+= authorArr[i].name + ', ' };
          authors += 'et al.';
      }
      return authors;
    }

  }

}
