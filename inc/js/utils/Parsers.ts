import { toTitleCase, getNumberSuffix } from './HelperFunctions';

export class AMA {

    private manualCitationType: string;
    private includeLink: boolean;

    constructor(includeLink?: boolean, manualCitationType?: string) {
        this.includeLink = includeLink;
        this.manualCitationType = manualCitationType;
    }

    public parse(data: ReferenceObj[]): string[]|Error {

        if (this.manualCitationType !== undefined) {
            return [this._fromManual(data[0])];
        }

        if (data[0].type) {
            this.manualCitationType = data[0].type;
            return [this._fromManual(data[0])];
        }

        return this._fromPMID(data);
    }

    private _fromPMID(data: ReferenceObj[]): string[]|Error {
        let output: string[]|Error;
        try {
            output = data.map((ref: ReferenceObj): string => {
                let year: string = ref.pubdate.substr(0, 4);
                let link = this.includeLink === true
                    ? ` PMID: <a href="http://www.ncbi.nlm.nih.gov/pubmed/${ref.uid}" target="_blank">${ref.uid}</a>`
                    : '';

                let authors: string|Error = this._parseAuthors(ref.authors, false);
                if (authors instanceof Error) {
                    throw authors;
                }
                else {
                    return `${authors} ${ref.title} <em>${ref.source}.</em> ${year}; ` +
                        `${ref.volume === undefined || ref.volume === '' ? '' : ref.volume}` +
                        `${ref.issue === undefined || ref.issue === '' ? '' : '(' + ref.issue + ')'}:` +
                        `${ref.pages}.${link}`;
                }
            });
        }
        catch (e) {
            return e;
        }
        return output;
    }

    private _fromManual(data: ReferenceObj): string {

        let payload: string;
        switch (this.manualCitationType) {
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

    private _parseAuthors(authorArr: Author[], isManual: boolean = true): string|Error {
        let authors: string = '';
        switch (authorArr.length) {
            case 0:
                if (isManual) { break; }
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
                for (let i = 0; i < 3; i++) { authors += authorArr[i].name + ', ' };
                authors += 'et al.';
        }
        return authors;
    }

    private _parseJournal(data: ReferenceObj): string {
        let authors = this._parseAuthors(data.authors);
        let year = data.pubdate;
        let source = toTitleCase(data.source);
        let title = toTitleCase(data.title);
        let issue = data.issue !== '' ? `(${data.issue})` : '';
        let volume = data.volume || '';

        return `${authors} ${title}. <em>${source}.</em> ${year}; ` +
            `${volume}${issue}:${data.pages}.`;
    }

    private _parseWebsite(data: ReferenceObj): string {
        let authors = data.authors.length > 0
            ? this._parseAuthors(data.authors) + ' '
            : '';
        let pubdate: string = `Published ${new Date(`1/1/${data.pubdate}`).toLocaleDateString('en-us', { month: 'long', year: 'numeric' }) }. `;
        let updated: string = data.updated !== ''
            ? `Updated ${new Date(data.updated).toLocaleDateString('en-us', { month: 'long', day: 'numeric', year: 'numeric' }) }. `
            : ''
        let accessed: string = data.accessdate !== ''
            ? `Accessed ${new Date(data.accessdate).toLocaleDateString('en-us', { month: 'long', day: 'numeric', year: 'numeric' }) }.`
            : `Accessed ${new Date(Date.now()).toLocaleDateString('en-us', { month: 'long', day: 'numeric', year: 'numeric' }) }`;

        return `${authors}${data.title}. <em>${data.source}</em>. Available at: ` +
            `<a href="${data.url}" target="_blank">${data.url}</a>. ${pubdate}${updated}${accessed}`;
    }

    private _parseBook(data: ReferenceObj): string {
        let authors = this._parseAuthors(data.authors);
        let title = data.title;
        let pubLocation = data.location !== ''
            ? `${data.location}: `
            : ``;
        let publisher = data.source;
        let year = data.pubdate;
        let edition = data.edition !== ''
            ? `${getNumberSuffix(parseInt(data.edition))} ed. `
            : ``;
        let chapter = data.chapter !== ''
            ? ` ${data.chapter}. In:`
            : ``;
        let pages = data.pages !== ''
            ? `: ${data.pages}.`
            : `.`;

        return `${authors}${chapter} <em>${title}</em>. ${edition}${pubLocation}${publisher}; ${year}${pages}`;
    }

}


export class APA {

    private includeLink: boolean;
    private manualCitationType: string;

    constructor(includeLink?: boolean, manualCitationType?: string) {
        this.includeLink = includeLink;
        this.manualCitationType = manualCitationType;
    }

    public parse(data: ReferenceObj[]): string[]|Error {

        if (this.manualCitationType ) {
            return [this._fromManual(data[0])];
        }

        return this._fromPMID(data);
    }

    private _fromPMID(data: ReferenceObj[]): string[]|Error {

        let output: string[]|Error;

        try {
            output = data.map((ref: ReferenceObj): string => {
                let year: string = ref.pubdate.substr(0, 4);
                let link = this.includeLink === true
                    ? ` PMID: <a href="http://www.ncbi.nlm.nih.gov/pubmed/${ref.uid}" target="_blank">${ref.uid}</a>`
                    : '';

                let authors: string|Error = this._parseAuthors(ref.authors, ref.lastauthor, false);

                if (authors instanceof Error) {
                    throw authors;
                }

                return (
                    `${authors} (${year}). ${ref.title} <em>` +
                    `${!ref.fulljournalname ? ref.source : toTitleCase(ref.fulljournalname) }.</em>, ` +
                    `${!ref.volume ? '' : ref.volume}` +
                    `${!ref.issue ? '' : '(' + ref.issue + ')'}, ` +
                    `${ref.pages}.${link}`
                    );
            });
        } catch (e) {
            return e;
        }

        return output;
    }

    private _fromManual(data: ReferenceObj): string {
        let payload: string;
        switch (this.manualCitationType) {
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

    private _parseAuthors(authorArr: Author[], lastAuthor: string, isManual: boolean = true): string | Error {
        let authors: string = '';

        switch (authorArr.length) {
            case 0:
                if (isManual) { break; }
                return new Error(`No authors were found for given reference`);
            case 1:
                authors = authorArr.map((author: Author) =>
                    `${author.name.split(' ')[0]}, ` +                   // Last name
                    `${author.name.split(' ')[1].split('').join('.') }.` // First Initial(s)
                    ).join();
                break;
            case 2:
                authors = authorArr.map((author: Author) =>
                    `${author.name.split(' ')[0]}, ` +                    // Last name
                    `${author.name.split(' ')[1].split('').join('.') }.`  // First Initial(s)
                    ).join(', & ');
                break;
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                authors = authorArr.map((author, i, arr) => {
                    if (i === arr.length - 1) {
                        return (
                            `& ${author.name.split(' ')[0]}, ` +
                            `${author.name.split(' ')[1].split('').join('.') }.`
                            );
                    }
                    return (
                        `${author.name.split(' ')[0]}, ` +
                        `${author.name.split(' ')[1].split('').join('.') }., `
                        );
                }).join('');
                break;
            default:
                for (let i = 0; i < 6; i++) {
                    authors +=
                    `${authorArr[i].name.split(' ')[0]}, ` +
                    `${authorArr[i].name.split(' ')[1].split('').join('.') }., `
                }
                authors += `. . . ` +
                `${lastAuthor.split(' ')[0]}, ` +
                `${lastAuthor.split(' ')[1].split('').join('.') }.`;
                break;
        }
        return authors;


    }

    private _parseJournal(data: ReferenceObj): string {
        let authors = this._parseAuthors(data.authors, data.lastauthor);
        let year = data.pubdate;
        let source = toTitleCase(data.source);
        let issue = data.issue !== '' ? `(${data.issue})` : '';
        let volume = data.volume !== '' ? ` ${data.volume}` : '';

        return `${authors} (${year}). ${data.title}. <em>` +
            `${source},${volume}</em>${issue}, ${data.pages}.`;
    }

    private _parseWebsite(data: ReferenceObj): string {
        let authors = this._parseAuthors(data.authors, data.lastauthor);
        let rawDate = new Date(`1/1/${data.pubdate}`);
        let source = toTitleCase(data.source);
        let date = `${rawDate.getFullYear() }, ` +
            `${rawDate.toLocaleDateString('en-us', { month: 'long', day: 'numeric' }) }`;

        return `${authors} (${date}). ${data.title}. <em>${source}</em>. ` +
            `Retrieved from <a href="${data.url}" target="_blank">${data.url}</a>`;
    }

    private _parseBook(data: ReferenceObj): string {
        let authors = this._parseAuthors(data.authors, data.lastauthor);
        let year = (new Date(`1/1/${data.pubdate}`).getFullYear()).toString();
        let pubLocation = data.location !== ''
            ? `${data.location}: `
            : '';
        let publisher = data.source;
        let chapter = data.chapter !== ''
            ? ` ${data.chapter}. In`
            : '';
        let edition = data.edition !== ''
            ? `${getNumberSuffix(parseInt(data.edition))} ed.`
            : '';

        let pageEdition = ``;
        switch (true) {
            case data.pages !== '' && edition !== '':
                pageEdition = ` (${edition}, pp. ${data.pages})`;
                break;
            case data.pages !== '' && edition === '':
                pageEdition = ` (${data.pages})`;
                break;
            case data.pages === '' && edition !== '':
                pageEdition = ` (${edition})`;
                break;
        }

        return `${authors} (${year}).${chapter} <em>${data.title}</em>${pageEdition}. ` +
            `${pubLocation}${publisher}.`;
    }

}
