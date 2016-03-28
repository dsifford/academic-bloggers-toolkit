/// <reference path="../main-parser.ts"/>

namespace Parsers {

  export class APA {

    public parse(data: ReferencePayload): string[]|Error {
      let pmidArray: string[]|boolean = data.uids || false;

      if (pmidArray) {
        return this._fromPMID(data, (pmidArray as string[]));
      }

      return this._fromManual(data);
    }

    private _fromPMID(data: ReferencePayload, pmidArray: string[]): string[]|Error {

      let output: string[];

      try {
        output = pmidArray.map((PMID: string): string => {
          let ref: ReferenceObj = data[PMID];
          let year: string = ref.pubdate.substr(0, 4);
          let link  = MainParser.includeLink === true
                    ? ` PMID: <a href="http://www.ncbi.nlm.nih.gov/pubmed/${PMID}" target="_blank">${PMID}</a>`
                    : '';

          let authors: string|Error = this._parseAuthors(ref.authors, ref.lastauthor);
          if ((authors as Error).name === 'Error') {
            throw authors;
          }

          return `${authors} (${year}). ${ref.title} <em>` +
            `${ref.fulljournalname === undefined || ref.fulljournalname === '' ? ref.source : ref.fulljournalname.toTitleCase()}.</em>, ` +
            `${ref.volume === undefined || ref.volume === '' ? '' : ref.volume}` +
            `${ref.issue === undefined || ref.issue === '' ? '' : '('+ref.issue+')'}, ` +
            `${ref.pages}.${link}`;
        });
      } catch(e) {
        return e;
      }

      return output;

    }

    private _fromManual(data: ReferencePayload): string[] {
      /** TODO */
      return ['unfinished']
    }

    private _parseAuthors(authorArr: Author[], lastAuthor: string): string|Error {
      let authors: string = '';

      switch (authorArr.length) {
        case 0:
          return new Error(`No authors were found for given reference`);
        case 1:
          authors = authorArr.map((author: Author) =>
            `${author.name.split(' ')[0]}, ` +                   // Last name
            `${author.name.split(' ')[1].split('').join('. ')}.` // First Initial(s)
          ).join();
          break;
        case 2:
          authors = authorArr.map((author: Author) =>
            `${author.name.split(' ')[0]}, ` +                    // Last name
            `${author.name.split(' ')[1].split('').join('. ')}.`  // First Initial(s)
          ).join(', & ');
          break;
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
          authors = authorArr.map((author, i, arr) => {
            if (i === arr.length - 1) {
              return(
                `& ${author.name.split(' ')[0]}, ` +
                `${author.name.split(' ')[1].split('').join('. ')}.`
              );
            }
            return(
              `${author.name.split(' ')[0]}, ` +
              `${author.name.split(' ')[1].split('').join('. ')}., `
            );
          }).join('');
          break;
        default:
          for (let i = 0; i < 6; i++) {
            authors +=
              `${authorArr[i].name.split(' ')[0]}, ` +
              `${authorArr[i].name.split(' ')[1].split('').join('. ')}., `
          }
          authors += `. . . ` +
            `${lastAuthor.split(' ')[0]}, ` +
            `${lastAuthor.split(' ')[1].split('').join('. ')}.`;
          break;
      }
      return authors;


    }

  }

}
