import * as processor from './CSLFieldProcessors';


export class RISParser {

    private refArray: string[];
    public unsupportedRefs: number[] = [];

    /**
     * Constructor. Takes a raw string of RIS as input and process it for parsing.
     * @param  {string} risText Raw RIS string.
     * @return {void}
     */
    constructor(risText: string) {
        this.refArray =
            risText
                .split(/(^TY\s\s-(.|\n|\r)+?ER\s\s-?)/gm)
                .filter(i => i.trim() !== '');
    }

    /**
     * Wrapper function that is called after constructing a new RISParser that
     *   returns an array of CSL.Data. If any single RIS object can't be processed,
     *   its index is pushed to unsupportedRefs.
     * @return {CSL.Data[]} Array of CSL.Data
     */
    public parse(): CSL.Data[] {

        let payload: CSL.Data[] = [];

        this.refArray.forEach((ref: string, i: number) => {
            let refObj = this.parseSingle(ref, i);

            if (typeof refObj === 'boolean') {
                this.unsupportedRefs.push(i + 1);
                return;
            }
            payload.push(refObj);
        });

        return payload;
    }

    /**
     * Parses a single RIS Object and returns its CSL.Data or false (if it can't
     *   be processed).
     * @param  {string}   singleRef A single RIS string.
     * @param  {number}   id        The ID to be used for the CSL.Data object.
     * @return {CSL.Data}           Parsed CSL.Data.
     */
    private parseSingle(singleRef: string, id: number): CSL.Data|boolean {

        let payload: CSL.Data = {};
        let ref = singleRef.split(/\n/);
        let type = ref[0].substr(6).trim();

        if (!RISParser.RISTypes[type]) {
            return false;
        }

        payload.id = `${id}`;
        payload.type = RISParser.RISTypes[type];
        payload.issued = {
            'date-parts': [[], ],
        };

        let pageHolder = {};

        ref.forEach((line: string) => {

            let key = line.substr(0, 2);
            let val = line.substr(6).trim();

            switch (key) {
                case 'AU':
                case 'A1':
                case 'A4':
                    payload.author =
                        !payload.author
                        ? [processor.processName(val, 'RIS'), ]
                        : payload.author.concat(processor.processName(val, 'RIS'));
                    break;
                case 'A2':
                case 'ED':
                    payload.editor =
                        !payload.editor
                        ? [processor.processName(val, 'RIS'), ]
                        : payload.editor.concat(processor.processName(val, 'RIS'));
                    break;
                case 'A3':
                    if (typeof payload.translator === 'undefined') {
                        payload.translator = [processor.processName(val, 'RIS'), ];
                    }
                    else {
                        payload.translator.push(processor.processName(val, 'RIS'));
                    }
                    break;
                case 'PY':
                case 'Y1':
                    payload.issued['date-parts'][0][0] = processor.processDate(val, 'RIS')['date-parts'][0][0];
                    break;
                case 'Y2':
                    payload.accessed = processor.processDate(val, 'RIS');
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
                case 'CY': // Conference location, publish location, city of publisher (zotero)
                    if (['paper-conference', 'speech', ].indexOf(payload.type) > -1) {
                        payload['event-place'] = val;
                        break;
                    }
                    payload['publisher-place'] = val;
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
                    pageHolder[key] = val;
                    break;
                case 'JF':
                case 'T2':
                    payload['container-title'] = val;
                    if (['paper-conference', 'speech', ].indexOf(payload.type) > -1) {
                        payload.event = val;
                    }
                    break;
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
                case 'ER':
                    if (Object.keys(pageHolder).length === 2) {
                        payload.page = `${pageHolder['SP']}-${pageHolder['EP']}`;
                    }
                    break;
            }

        });


        return payload;
    }

    /**
     * On object that holds the RIS types as keys and the corresponding CSL types
     * as values.
     */
    public static RISTypes: { [abbr: string]: CSL.CitationType } = {
        BLOG   : 'post-weblog',
        BOOK   : 'book',
        EBOOK  : 'book',
        EDBOOK : 'book',
        CHAP   : 'chapter',
        ECHAP  : 'chapter',
        EJOUR  : 'article-journal',
        INPR   : 'article-journal',
        ICOMM  : 'webpage',                 // Perhaps post-weblog
        JOUR   : 'article-journal',
        ELEC   : 'webpage',
        GEN    : 'article',                 // 'Generic',
        ABST   : 'article',                 // 'Abstract',
        AGGR   : 'dataset',                 // 'Aggregated Database',
        ART    : 'graphic',                 // 'Artwork',
        ADVS   : 'broadcast',               // 'Audiovisual Material',
        BILL   : 'bill',                    // 'Bill',
        CASE   : 'legal_case',              // 'Case',
        CTLG   : 'article',                 // 'Catalog',
        CHART  : 'figure',                  // 'Chart',
        CLSWK  : 'musical_score',           // 'Classical Work',
        COMP   : 'article',                 // 'Computer Program',
        CPAPER : 'paper-conference',        // 'Conference Paper',
        CONF   : 'speech',                  // 'Conference Proceeding',
        DATA   : 'dataset',                 // 'Dataset',
        DICT   : 'entry-dictionary',        // 'Dictionary',
        ENCYC  : 'entry-encyclopedia',      // 'Encyclopedia',
        EQUA   : 'figure',                  // 'Equation',
        FIGURE : 'figure',                  // 'Figure',
        MPCT   : 'motion_picture',          // 'Film or Broadcast',
        JFULL  : 'article-journal',         // 'Full Journal',
        GOVDOC : 'legislation',             // 'Government Document',
        HEAR   : 'legal_case',              // 'Hearing',
        LEGAL  : 'legal_case',              // 'Legal Rule',
        MGZN   : 'article-magazine',        // 'Magazine Article',
        MANSCPT: 'manuscript',              // 'Manuscript',
        MAP    : 'map',                     // 'Map',
        MUSIC  : 'song',                    // 'Music',
        NEWS   : 'article-newspaper',       // 'Newspaper Article',
        DBASE  : 'dataset',                 // 'Online Database',
        MULTI  : 'graphic',                 // 'Online Multimedia',
        PAMP   : 'pamphlet',                // 'Pamphlet',
        PAT    : 'patent',                  // 'Patent',
        PCOMM  : 'personal_communication',  // 'Personal Communication',
        RPRT   : 'report',                  // 'Report',
        SLIDE  : 'figure',                  // 'Slide',
        SOUND  : 'song',                    // 'Sound Recording',
        STAND  : 'article',                 // 'Standard',
        STAT   : 'legislation',             // 'Statute',
        THES   : 'thesis',                  // 'Thesis',
        UNBILL : 'bill',                    // 'Unenacted Bill',
        UNPD   : 'article',                 // 'Unpublished Work',
        VIDEO  : 'broadcast',               // 'Video Recording'
    };
}


/**
 * ========== RIS Field Notes ==========
 *
 * AU: authors                          // official spec
 * A1: authors                          // mendeley, sciencedirect
 * A2: secondary authors                // official spec -- editor used here by some
 * A3: translator/tertiary authors      // official spec
 * A4: author subsidary                 // official spec
 * PY: publication year                 // official spec -- Format: `0000` (four number characters)
 * DA: date                             // official spec -- Format: `YYYY/MM/DD/other` eg => `1993///spring` or `1990/12`
 * KW: keywords                         // official spec
 * J2: alternate title                  // official spec (abbreviated title name)
 * UR: URL                              // official spec
 * AB: abstract                         // official spec
 * AN: accession number                 // official spec
 * CN: call number                      // official spec
 * CY: location                         // official spec -- conference location, publish location, city of publisher (zotero)
 * DB: database name                    // official spec
 * DO: DOI                              // official spec
 * DP: database provider                // official spec
 * ET: edition                          // official spec
 * LA: language                         // official spec
 * IS: issue                            // official spec
 * NV: number of volumes                // official spec
 * OP: original publication             // official spec
 * PB: publisher                        // official spec
 * JA: abbreviates source title         // official spec -- eg: J Trauma.
 * ED: editor                           // official spec
 * EP: end page                         // NON-OFFICAL (mendeley, zotero)
 * SP: start page                       // NON-OFFICIAL (mendeley, zotero)
 * JF: source title                     // NON-OFFICIAL (mendeley, zotero) - periodical name
 * C2: PMID/PMCID                       // official spec
 * C3: proceedings title                // ?unsure
 * T3: series title                     // NON-OFFICIAL (zotero)
 * C7: article number                   // ?unsure
 * N2: abstract                         // NON-OFFICIAL (mendeley, zotero)
 * SN: ISSN/ISBN/EISSN                  // official spec
 * T1: title                            // NON-OFFICIAL (mendeley, scopus)
 * ST: seconda article title            // ?unsure
 * T2: fulljournalname                  // ?unsure -- also conference name
 * TI: title                            // official spec
 * VL: volume                           // official spec
 * Y1: issued date                      // NON-OFFICIAL (mendeley)
 * Y2: conference date                  // NON-OFFICIAL
 * RP: reprint status                   // official spec -- format: `IN FILE`, `NOT IN FILE`, `ON REQUEST (MM/DD/YY)`
 * AD: author address                   // ?unsure -- also affiliations
 * CA: caption                          // official spec
 * L1: file attachments                 // official spec
 * L4: figure                           // official spec
 * LB: label                            // official spec
 * M3: type of work                     // official spec
 * N1: notes                            // ?unsure -- (scopus: cited by count, CODEN, conference code, correspondence address, export date, references, tradenames)
 * ID: ID number                        // official spec
 */
