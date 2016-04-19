



export class RISParser {

    private refArray: string[];
    public unsupportedRefs: number[] = [];

    constructor(risText: string) {
        this.refArray =
            risText
                .split(/(^TY\s\s-(.|\n|\r)+?ER\s\s-?)/gm)
                .filter(i => i.trim() !== '');
    }

    public parse(): ReferenceObj[] {

        let payload: ReferenceObj[] = [];

        this.refArray.forEach((ref: string, i: number) => {
            let refObj = this._parse(ref);
            if (typeof refObj === 'boolean') {
                this.unsupportedRefs.push(i);
            }
            else {
                payload.push(refObj);
            }
        });

        return payload;
    }

    private _parse(singleRef: string): ReferenceObj|boolean {

        let isSupportedRefType: boolean = true;

        let payload: ReferenceObj = {
            type: '',
            authors: [],
            lastauthor: '',
            pages: '',
            pubdate: '',
            source: '',
            title: '',
            accessdate: '',
            chapter: '',
            edition: '',
            fulljournalname: '',
            issue: '',
            location: '',
            updated: '',
            url: '',
            volume: '',
            uid: '',
            DOI: '',
        };

        let pageHolder = {
            SP: '',
            EP: '',
        }

        let ref = singleRef.split(/\n/);
        ref.some((line: string, i: number) => {

            let key = line.substr(0, 2);
            let val = line.substr(6).trim();

            switch (true) {
                case key === 'TY':
                    if (!RISParser.RISTypes[val]) {
                        isSupportedRefType = false;
                        return true;
                    }
                    payload.type = RISParser.RISTypes[val] as string;
                    break;
                case key === 'ER':
                    break;
                case key.search(/^A(U|\d)/) > -1:
                    if (val.split(',').length !== 2) {
                        isSupportedRefType = false;
                        return true;
                    }
                    let ln = val.split(',')[0];
                    let fn = val.split(',')[1].trim().split(' ')[0];
                    let mi = val.split(',')[1].trim().split(' ')[1] || '';
                    mi = mi.replace('.', '');
                    payload.authors.push({ name: `${ln} ${fn[0]}${mi}` });
                    break;
                case ['SP', 'EP'].indexOf(key) > -1:
                    if (pageHolder.SP && pageHolder.EP === '') {
                        pageHolder[key] = val;
                        break;
                    }
                    pageHolder[key] = val;
                    payload.pages = `${pageHolder.SP}-${pageHolder.EP}`;
                    break;
                default:
                    if (RISParser.RISFields[key]) {
                        payload[RISParser.RISFields[key] as string] = val;
                    }
            }
            // payload.lastauthor = payload.authors[payload.authors.length - 1].name;
        });

        if (!isSupportedRefType) {
            return false;
        }
        return payload;

    }

    public static RISTypes: { [abbr: string]: string|boolean } = {
        BLOG: 'website',
        BOOK: 'book',
        EBOOK: 'book',
        EDBOOK: 'book',
        CHAP: 'book',
        ECHAP: 'book',
        EJOUR: 'journal',
        INPR: 'journal',
        ICOMM: 'website',
        JOUR: 'journal',
        ELEC: 'website',
        GEN: false,   //'Generic',
        ABST: false,   //'Abstract',
        AGGR: false,   //'Aggregated Database',
        ANCIENT: false,   //'Ancient Text',
        ART: false,   //'Artwork',
        ADVS: false,   //'Audiovisual Material',
        BILL: false,   //'Bill',
        CASE: false,   //'Case',
        CTLG: false,   //'Catalog',
        CHART: false,   //'Chart',
        CLSWK: false,   //'Classical Work',
        COMP: false,   //'Computer Program',
        CPAPER: false,   //'Conference Paper',
        CONF: false,   //'Conference Proceeding',
        DATA: false,   //'Dataset',
        DICT: false,   //'Dictionary',
        ENCYC: false,   //'Encyclopedia',
        EQUA: false,   //'Equation',
        FIGURE: false,   //'Figure',
        MPCT: false,   //'Film or Broadcast',
        JFULL: false,   //'Full Journal',
        GOVDOC: false,   //'Government Document',
        GRNT: false,   //'Grant',
        HEAR: false,   //'Hearing',
        LEGAL: false,   //'Legal Rule',
        MGZN: false,   //'Magazine Article',
        MANSCPT: false,   //'Manuscript',
        MAP: false,   //'Map',
        MUSIC: false,   //'Music',
        NEWS: false,   //'Newspaper Article',
        DBASE: false,   //'Online Database',
        MULTI: false,   //'Online Multimedia',
        PAMP: false,   //'Pamphlet',
        PAT: false,   //'Patent',
        PCOMM: false,   //'Personal Communication',
        RPRT: false,   //'Report',
        SER: false,   //'Serial',
        SLIDE: false,   //'Slide',
        SOUND: false,   //'Sound Recording',
        STAND: false,   //'Standard',
        STAT: false,   //'Statute',
        THES: false,   //'Thesis',
        UNBILL: false,   //'Unenacted Bill',
        UNPD: false,   //'Unpublished Work',
        VIDEO: false,   //'Video Recording',
    }

    public static RISFields: { [abbr: string]: string|boolean } = {
        AU: 'authors',
        A1: 'authors',  // mendeley and sciencedirect use this rather than AU
        SN: 'pages',
        SP: 'start page', /** TODO */
        EP: 'end page', /** TODO */
        DA: 'pubdate',
        PY: 'pubdate',
        Y1: 'pubdate', // mendeley uses this instead of PY
        J2: 'source',
        PB: 'source',
        JF: 'source',
        TI: 'title',
        T1: 'title', // mendeley
        ET: 'edition',
        T2: 'fulljournalname',
        IS: 'issue',
        CY: 'location',
        UR: 'url',
        VL: 'volume',
        DO: 'DOI',

        // AB: 'abstract',
        // N2: 'abstract', // mendeley
        // DP: 'Database Provider',
        // LA: 'Language',
        // KW: 'Keywords',
        // ID: 'ID number (not used)',

        /** NOTE: I haven't seen these used yet. */
        // ED: 'editor',
        // A2: 'author secondary',
        // AD: 'Author Address',
        // AN: 'Accession Number',
        // CA: 'Caption',
        // CN: 'Call Number',
        // DB: 'Name of Database',
        // L1: 'File Attachments',
        // L4: 'Figure',
        // LB: 'Label',
        // M3: 'Type of Work',
        // N1: 'Notes',
        // NV: 'Number of Volumes',
        // OP: 'Original Publication',

    }

}
