// tslint:disable no-namespace no-reserved-keywords

declare namespace CrossRef {
    interface Agency {
        /* "ok" if response is good */
        status: string;
        'message-type': string;
        'message-version': string;
        message: {
            DOI: string;
            agency: {
                id: 'crossref' | 'datacite' | 'medra';
                label: string;
            };
        };
    }
}

declare namespace GoogleBooks {
    type industryIdentifier = 'ISBN_10' | 'ISBN_13';
    type printType = 'BOOK';

    interface Response {
        kind: string;
        totalItems: number;
        items: Item[];
    }

    interface Meta {
        title: string;
        'number-of-pages': string;
        publisher: string;
        /** 2012-06-07 */
        issued: string;
        authors: {
            type: 'author';
            family: string;
            given: string;
        }[];
    }

    interface Item {
        /** "books#volume" */
        kind: string;
        /** "Jx1ojwEACAAJ" */
        id: string;
        /** "uISZ7b1XOlc" */
        etag: string;
        /** "https://www.googleapis.com/books/v1/volumes/Jx1ojwEACAAJ" */
        selfLink: string;
        volumeInfo: {
            title: string;
            subtitle: string;
            authors: string[];
            publisher: string;
            /** "2016-07-31" */
            publishedDate: string;
            description: string;
            industryIdentifiers: {
                type: industryIdentifier;
                identifier: string;
            }[];
            readingModes: {
                text: boolean;
                image: boolean;
            };
            pageCount: number;
            printType: printType;
            averageRating: number;
            ratingsCount: number;
            maturityRating: 'NOT_MATURE' | 'MATURE';
            allowAnonLogging: boolean;
            contentVersion: string;
            imageLinks: {
                smallThumbnail: string;
                thumbnail: string;
            };
            /** en */
            language: string;
            previewLink: string;
            /** use this one */
            infoLink: string;
            canonicalVolumeLink: string;
        };
        saleInfo: {
            country: string;
            saleability: string;
            isEbook: boolean;
        };
        accessInfo: {
            country: string;
            viewability: string;
            embeddable: boolean;
            publicDomain: boolean;
            textToSpeechPermission: 'ALLOWED' | 'NOT_ALLOWED';
            epub: {
                isAvailable: boolean;
            };
            pdf: {
                isAvailable: boolean;
            };
            webReaderLink: string;
            accessViewStatus: string;
            quoteSharingAllowed: boolean;
        };
        searchInfo: {
            textSnippet: string;
        };
    }
}

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
        articleids: {
            idtype: 'doi' | 'pmid' | 'pmcid';
            value: string;
        }[];
        pmclivedate: string;
        printpubdate: ShortDate;
        sortdate: LongDate;
    }

    interface DataPMID extends Shared {
        articleids?: {
            idtype: 'doi' | 'eid' | 'pii' | 'pmc' | 'pubmed' | 'rid';
            idtypeen: number;
            value: string;
        }[];
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
        history?: {
            date: LongDate;
            pubstatus:
                | 'accepted'
                | 'entrez'
                | 'medline'
                | 'pubmed'
                | 'received'
                | 'revised';
        }[];
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
        references?: {
            refsource: string;
            reftype: string;
            pmid: number;
            note: string;
        }[];
        reportnumber?: string;
        sortfirstauthor?: string;
        sortpubdate?: LongDate;
        sorttitle?: string;
        srccontriblist?: string[];
        srcdate?: string;
        vernaculartitle?: string;
    }
}
