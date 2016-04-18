import { AMA, APA } from './Parsers';
import { PubmedGet } from './PubmedAPI';
import { toTitleCase, prepareName } from './HelperFunctions';
import ABTEvent from './Events';

export default class Dispatcher {
    public citationFormat: string;
    public includeLink: boolean;
    public attachInline: boolean;

    constructor(data: ReferenceFormData) {
        this.citationFormat = data.citationFormat;
        this.includeLink = data.includeLink;
        this.attachInline = data.attachInline;
    }

    public fromPMID(PMIDstring: string, callback: Function): void {
        PMIDstring = PMIDstring.replace(/\s/g, '');

        PubmedGet(PMIDstring, (res: Error|ReferenceObj[]) => {

            // Handle response errors
            if (res instanceof Error) {
                callback(res);
                return;
            }
            else {
                let payload: string[]|Error;
                switch (this.citationFormat) {
                    case 'ama':
                        let ama = new AMA(this.includeLink);
                        payload = ama.parse(res);
                        break;
                    case 'apa':
                        let apa = new APA(this.includeLink);
                        payload = apa.parse(res);
                        break;
                    default:
                        let err = new Error('ERROR => Citation format not given.');
                        callback(err);
                        return;
                }
                callback(payload);
            }
        })
    }

    public fromManualInput(data: ReferenceFormData): string[]|Error {
        let cleanedData: ReferenceObj;
        let citationType = data.manualData.type;

        // Reformat name to <last> <firstinitial><middleinitial>
        let authors: Author[] = data.manualData.authors.map((author: any) => {
            let name = prepareName(author);
            return { name };
        });

        let meta: JournalMeta|BookMeta|WebsiteMeta = data.manualData.meta[citationType];

        let title: string = toTitleCase(meta.title);
        let source: string = meta.source;
        let pubdate: string = meta.pubdate;
        let lastauthor: string = data.manualData.authors.length > 0
            ? prepareName(data.manualData.authors[data.manualData.authors.length - 1])
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

        switch (citationType) {
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
                let ama = new AMA(this.includeLink, citationType);
                payload = ama.parse([cleanedData]);
                break;
            case 'apa':
                let apa = new APA(this.includeLink, citationType);;
                payload = apa.parse([cleanedData]);
                break;
            default:
                let err = new Error('ERROR => An error occured while processing your citation.');
                return err;
        }

        return payload;

    }

}
