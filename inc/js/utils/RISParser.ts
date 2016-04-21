import * as processor from './CSLFieldProcessors';


export class RISParser {

    private refArray: string[];
    public unsupportedRefs: number[] = [];

    constructor(risText: string) {
        this.refArray =
            risText
                .split(/(^TY\s\s-(.|\n|\r)+?ER\s\s-?)/gm)
                .filter(i => i.trim() !== '');
    }

    public parse(): CSL.Data[] {

        let payload: CSL.Data[] = [];

        this.refArray.forEach((ref: string, i: number) => {

            let refObj = this.parseSingle(ref, i);

            if (typeof refObj === 'boolean') {
                this.unsupportedRefs.push(i);
            }
            else {
                payload.push(refObj);
            }
        });

        return payload;
    }

    private parseSingle(singleRef: string, id: number): CSL.Data|boolean {

        let payload: CSL.Data = {};
        let ref = singleRef.split(/\n/);
        let type = ref[0].substr(6).trim();

        if (!RISParser.RISTypes[type]) {
            return false;
        }

        payload.id = id;
        payload.type = RISParser.RISTypes[type];
        payload.author = [];
        payload.editor = [];
        payload.translator = [];
        payload.issued = {
            'date-parts': [ [], ]
        };

        let pageHolder = {
            SP: '',
            EP: '',
        };

        ref.forEach((line: string, i: number) => {

            let key = line.substr(0, 2);
            let val = line.substr(6).trim();

            switch (key) {
                case 'ER':
                    break;
                case 'AU':
                case 'A1':
                case 'A4': // Not sure what to do with this field yet.
                    payload.author.push(processor.processName(val, 'RIS'));
                    break;
                case 'A2':
                case 'ED':
                    payload.editor.push(processor.processName(val, 'RIS'));
                    break
                case 'A3':
                    payload.translator.push(processor.processName(val, 'RIS'));
                    break;
                case 'PY':
                case 'Y1':
                    payload.issued['date-parts'][0][0] = val;
                    break;
                case 'DA':
                    payload.issued = processor.processDate(val, 'RIS');
                    break;
                case 'KW':
                    payload.keyword = val;
                    break;
                case 'J2':
                case 'JA':
                    payload.journalAbbreviation = val;
                    payload['container-title-short'] = val;
                    break;
                case 'UR':
                    payload.URL = val;
                    break;
                case 'AB':
                case 'N2':
                    payload.abstract = val;
                    break;
                case 'AN':
                case 'C7':
                    payload.number = val; /** NOTE: This may be incorrect */
                    break;
                case 'CN':
                    payload['call-number'] = val;
                    break;
                case 'CY': // conference location, publish location, city of publisher (zotero)
                    payload['publisher-place'] = val;
                    payload['event-place'] = val;
                    break;
                case 'DB':
                    payload.source = val;
                    break;
                case 'DO':
                    payload.DOI = val;
                    break;
                case 'DP': /** NOTE: This may be incorrect */
                    payload.archive = val;
                    break;
                case 'ET':
                    payload.edition = val;
                    break;
                case 'LA':
                    payload.language = val;
                    break;
                case 'IS':
                    payload.issue = val;
                    break;
                case 'NV':
                    payload['number-of-volumes'] = val;
                    break;
                case 'OP': /** NOTE: This may be incorrect */
                    payload['original-title'] = val;
                    break;
                case 'PB':
                    payload.publisher = val;
                    break;
                case 'SP':
                case 'EP':
                    if (pageHolder.SP && pageHolder.EP === '') {
                        pageHolder[key] = val;
                        break;
                    }
                    pageHolder[key] = val;
                    payload.page = `${pageHolder.SP}-${pageHolder.EP}`;
                    break;
                case 'JF':
                case 'T2':
                    payload['container-title'] = val;
                    payload.event = val;
                case 'C2':
                    if (val.search(/PMC/i) > -1) {
                        payload.PMCID = val;
                        break;
                    }
                    payload.PMID = val;
                    break;
                case 'C3':
                    payload.event = val;
                    break;
                case 'T3':
                    payload['collection-title'] = val;
                    break;
                case 'SN':
                    payload.ISBN = val;
                    payload.ISSN = val;
                    break;
                case 'T1':
                case 'TI':
                    payload.title = val;
                    break;
                case 'ST':
                    payload.shortTitle = val;
                    break;
                case 'VL':
                    payload.volume = val;
                    break;
                case 'Y2':
                    payload['event-date'] = processor.processDate(val, 'RIS');
                    break;
            }

        });


        return payload;
    }

    public static RISTypes: { [abbr: string]: CSL.CitationType } = {
        BLOG   : 'post-weblog',
        BOOK   : 'book',
        EBOOK  : 'book',
        EDBOOK : 'book',
        CHAP   : 'chapter',
        ECHAP  : 'chapter',
        EJOUR  : 'article-journal',
        INPR   : 'article-journal',
        ICOMM  : 'webpage', // perhaps post-weblog
        JOUR   : 'article-journal',
        ELEC   : 'webpage',
        GEN    : 'article', //'Generic',
        ABST   : 'article', //'Abstract',
        AGGR   : 'dataset', //'Aggregated Database',
        ART    : 'graphic', //'Artwork',
        ADVS   : 'broadcast', //'Audiovisual Material',
        BILL   : 'bill', //'Bill',
        CASE   : 'legal_case', //'Case',
        CTLG   : 'article', //'Catalog',
        CHART  : 'figure', //'Chart',
        CLSWK  : 'musical_score', //'Classical Work',
        COMP   : 'article', //'Computer Program',
        CPAPER : 'paper-conference', //'Conference Paper',
        CONF   : 'speech', //'Conference Proceeding',
        DATA   : 'dataset', //'Dataset',
        DICT   : 'entry-dictionary', //'Dictionary',
        ENCYC  : 'entry-encyclopedia', //'Encyclopedia',
        EQUA   : 'figure', //'Equation',
        FIGURE : 'figure', //'Figure',
        MPCT   : 'motion_picture', //'Film or Broadcast',
        JFULL  : 'article-journal', //'Full Journal',
        GOVDOC : 'legislation', //'Government Document',
        HEAR   : 'legal_case', //'Hearing',
        LEGAL  : 'legal_case', //'Legal Rule',
        MGZN   : 'article-magazine', //'Magazine Article',
        MANSCPT: 'manuscript', //'Manuscript',
        MAP    : 'map', //'Map',
        MUSIC  : 'song', //'Music',
        NEWS   : 'article-newspaper', //'Newspaper Article',
        DBASE  : 'dataset', //'Online Database',
        MULTI  : 'graphic', //'Online Multimedia',
        PAMP   : 'pamphlet', //'Pamphlet',
        PAT    : 'patent', //'Patent',
        PCOMM  : 'personal_communication', //'Personal Communication',
        RPRT   : 'report', //'Report',
        SLIDE  : 'figure', //'Slide',
        SOUND  : 'song', //'Sound Recording',
        STAND  : 'article', //'Standard',
        STAT   : 'legislation', //'Statute',
        THES   : 'thesis', //'Thesis',
        UNBILL : 'bill', //'Unenacted Bill',
        UNPD   : 'article', //'Unpublished Work',
        VIDEO  : 'broadcast', //'Video Recording'
    }

    public static RISFields: { [abbr: string]: string|boolean } = {

        /** NOTE: Below are the official spec fields */
        AU: 'authors',
        A1: 'authors',  // mendeley and sciencedirect use this rather than AU
        A2: 'editor', // Editor --- author secondary
        A3: 'translators / author tertiary',
        A4: 'author Subsidiary',
        PY: 'publication year', // must be in the form of '0000' (four number characters)
        DA: 'date', // must be in the form of 'YYYY/MM/DD/other info' eg => 1993///spring or 1990/12
        KW: 'Keywords',
        // RP: 'reprint status', // must be one of the following: 'IN FILE', 'NOT IN FILE', 'ON REQUEST (MM/DD/YY)'
        J2: 'alternate title', // should be the abbreviated name
        UR: 'url',
        AB: 'abstract', //Abstract
        // AD: 'Author Address', // affiliations
        AN: 'Accession Number',
        // CA: 'Caption',
        CN: 'Call Number',
        CY: 'location', // conference location, publish location, city of publisher (zotero)
        DB: 'Name of Database',
        DO: 'DOI',
        DP: 'Database Provider',
        ET: 'edition',
        // L1: 'File Attachments',
        // L4: 'Figure',
        LA: 'Language',
        // LB: 'Label',
        IS: 'issue',
        // M3: 'Type of Work',
        // N1: 'notes', // SCOPUS: cited by count, CODEN, conference code, correspondence address, export date, references, tradenames,
        NV: 'Number of Volumes',
        OP: 'Original Publication',
        PB: 'publisher', // Publisher


        JA: 'abbreviated source title', //Abbreviated source title
        ED: 'editor',
        EP: 'end page',
        SP: 'start page',
        // ID: 'ID number',
        JF: 'source title', // periodical name (zotero mendeley)
        C2: 'pmid/pmcid', // PMID/PMCID
        C3: 'proceedings title', // Proceedings title
        T3: 'series title', // zotero
        C7: 'article number', //Article number
        N2: 'abstract', // mendeley zotero
        SN: 'issn/isbn,eissn', // ISSN/ISBN/EISSN / pages /
        T1: 'title', // mendeley / scopus
        ST: 'seconda article title', // Second article title
        T2: 'fulljournalname', // conference name
        TI: 'title',
        VL: 'volume',
        Y1: 'pubdate', // mendeley uses this instead of PY
        Y2: 'conference date', // Conference date
    }

}
