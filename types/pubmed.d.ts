// tslint:disable no-namespace

declare namespace PubMed {

    type Data = SingleReference[]

    interface SingleReference {
        articleids?: {
            idtype: string
            idtypen: number
            value: string
        }[];
        attributes?: string[];
        authors?: Author[];
        availablefromurl?: string;
        bookname?: string;
        booktitle?: string;
        chapter?: string;
        doccontriblist?: string[];
        docdate?: string;
        doctype?: string;
        edition?: string;
        elocationid?: string;
        epubdate?: string;
        essn?: string;
        fulljournalname?: string;
        history?: {
            /** format: 'YYYY/MM/DD HH:MM' */
            date: string;
            pubstatus: string;
        }[];
        issn?: string;
        issue?: string;
        lang?: string[];
        /** format: 'Lastname FM' */
        lastauthor?: string;
        medium?: string;
        nlmuniqueid?: string;
        pages?: string;
        pubdate?: string;
        publisherlocation?: string;
        publishername?: string;
        reportnumber?: string;
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
        pubstatus?: '1'|'2'|'3'|'4'|'5';
        pubtype?: string;
        recordstatus?: string;
        sortfirstauthor?: string;
        /** format: 'YYYY/MM/DD HH:MM' */
        sortpubdate?: string;
        sorttitle?: string;
        source?: string;
        srccontriblist?: string[];
        srcdate?: string;
        title?: string;
        vernaculartitle?: string;
        viewcount?: number;
        volume?: string;
        uid?: string;
    }

    interface Author {
      authtype?: string;
      clusterid?: string;
      name?: string;
      firstname?: string;
      lastname?: string;
      middleinitial?: string;
    }

}
