
declare namespace PubMed {
    /**
     * Format: "<YYYY> <Mmm>? <DD>?"
     * Examples: `2004`, `2014 Jun`, `2000 Nov 12`
     */
    type ShortDate = string;

    /**
     * Format: "YYYY/MM/DD HH:MM"
     * Example: `2014/07/01 00:00`
     */
    type LongDate = string;

    type Response = DataPMID | DataPMCID;

    interface Author {
        authtype: string;
        name: string;
        clusterid?: string;
    }

    interface Shared {
        authors?: Author[];
        epubdate?: ShortDate;
        fulljournalname?: string;
        issue?: string;
        pages?: string;
        pubdate?: ShortDate;
        /** Journal Shortname */
        source?: string;
        title?: string;
        uid?: string;
        volume?: string;
    }

    interface DataPMCID extends Shared {
        articleids: Array<{
            idtype: 'doi' | 'pmid' | 'pmcid';
            value: string;
        }>;
        pmclivedate: string;
        printpubdate: ShortDate;
        sortdate: LongDate;
    }

    interface DataPMID extends Shared {
        articleids?: Array<{
            idtype: 'doi' | 'eid' | 'pii' | 'pmc' | 'pubmed' | 'rid';
            idtypeen: number;
            value: string;
        }>;
        attributes?: string[];
        availablefromurl?: string;
        bookname?: string;
        booktitle?: string;
        chapter?: string;
        doccontriblist?: string[];
        docdate?: ShortDate;
        doctype?: string;
        edition?: string;
        /** Generally = "doi: <doi-here>" */
        elocationid?: string;
        essn?: string;
        history?: Array<{
            date: LongDate;
            pubstatus:
                | 'accepted'
                | 'entrez'
                | 'medline'
                | 'pubmed'
                | 'received'
                | 'revised';
        }>;
        issn?: string;
        lang?: string[];
        /** format: 'Lastname FM' */
        lastauthor?: string;
        medium?: string;
        nlmuniqueid?: string;
        pmcrefcount?: '' | number;
        publisherlocation?: string;
        publishername?: string;
        locationlabel?: string;
        /**
         * (1) received      -- date manuscript received for review
         * (2) accepted      -- accepted for publication
         * (3) epublish      -- published electronically by publisher
         * (4) ppublish      -- published in print by publisher
         * (5) revised       -- article revised by publisher/author
         * (6) pmc           -- article first appeared in PubMed Central
         * (7) pmcr          -- article revision in PubMed Central
         * (8) pubmed        -- article citation first appeared in PubMed
         * (9) pubmedr       -- article citation revision in PubMed
         * (10) aheadofprint -- epublish, but will be followed by print
         * (11) premedline   -- date into PreMedline status
         * (12) medline      -- date made a MEDLINE record
         * (255) other
         */
        pubstatus?:
            | '1'
            | '2'
            | '3'
            | '4'
            | '5'
            | '6'
            | '7'
            | '8'
            | '9'
            | '10'
            | '11'
            | '12'
            | '255';
        pubtype?: string[];
        recordstatus?: string;
        references?: Array<{
            refsource: string;
            reftype: string;
            pmid: number;
            note: string;
        }>;
        reportnumber?: string;
        sortfirstauthor?: string;
        sortpubdate?: LongDate;
        sorttitle?: string;
        srccontriblist?: string[];
        srcdate?: string;
        vernaculartitle?: string;
    }
}
