/// <reference path="../main-parser.ts"/>

namespace Parsers {

  export class APA {

    private _isManual: boolean = true;

    public parse(data: ReferencePayload): string[]|Error {
      let pmidArray: string[]|boolean = data.uids || false;

      if (pmidArray) {
        this._isManual = false;
        return this._fromPMID(data, (pmidArray as string[]));
      }

      return [this._fromManual(data)];
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

    private _fromManual(data: ReferencePayload): string {
      let payload: string;
      switch (MainParser.manualCitationType) {
        case 'journal':
          payload = this._parseJournal(data);
          break;
        case 'website':
          payload = this._parseWebsite(data);
          break;
        case 'book':
          payload = this._parseBook(data);
          break;
      }

      return payload;
    }

    private _parseAuthors(authorArr: Author[], lastAuthor: string): string|Error {
      let authors: string = '';

      switch (authorArr.length) {
        case 0:
          if (this._isManual === true) { break; }
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

    private _parseJournal(data: ReferencePayload): string {
      let authors = this._parseAuthors(data[0].authors, data[0].lastauthor);
      let year = (new Date(data[0].pubdate).getFullYear() + 1).toString();
      let source = data[0].source.toTitleCase();
      let issue = `(${data[0].issue})` || '';
      let volume = data[0].volume || '';

      return `${authors} (${year}). ${data[0].title}. <em>` +
        `${source}.</em>, ${volume}${issue}, ${data[0].pages}.`;
    }

    private _parseWebsite(data: ReferencePayload): string {
      let authors = this._parseAuthors(data[0].authors, data[0].lastauthor);
      let rawDate = new Date(data[0].pubdate);
      let source = data[0].source.toTitleCase();
      let date = `${rawDate.getFullYear()}, ` +
        `${rawDate.toLocaleDateString('en-us', {month: 'long', day: 'numeric'})}`;

      return `${authors} (${date}). ${data[0].title}. <em>${source}</em>. ` +
        `Retrieved from <a href="${data[0].url}" target="_blank">${data[0].url}</a>`;
    }

    private _parseBook(data: ReferencePayload): string {
      let authors = this._parseAuthors(data[0].authors, data[0].lastauthor);
      let year = (new Date(data[0].pubdate).getFullYear() + 1).toString();
      let pubLocation = data[0].location !== ''
        ? `${data[0].location}:`
        : '';
      let publisher = data[0].source;
      let chapter = data[0].chapter !== ''
        ? ` ${data[0].chapter}. In`
        : '';
      let pages = data[0].pages !== ''
        ? ` (${data[0].pages})`
        : '';

      return `${authors} (${year}).${chapter} <em>${data[0].title}</em>${pages}. ` +
          `${pubLocation}${publisher}.`;
    }

  }

}
