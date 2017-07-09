// tslint:disable no-namespace

declare namespace CSL {
    type CitationType =
        | 'article'
        | 'article-journal'
        | 'article-magazine'
        | 'article-newspaper'
        | 'bill'
        | 'book'
        | 'broadcast'
        | 'chapter'
        | 'dataset'
        | 'entry'
        | 'entry-dictionary'
        | 'entry-encyclopedia'
        | 'figure'
        | 'graphic'
        | 'interview'
        | 'legal_case'
        | 'legislation'
        | 'manuscript'
        | 'map'
        | 'motion_picture'
        | 'musical_score'
        | 'pamphlet'
        | 'paper-conference'
        | 'patent'
        | 'personal_communication'
        | 'post'
        | 'post-weblog'
        | 'report'
        | 'review'
        | 'review-book'
        | 'song'
        | 'speech'
        | 'thesis'
        | 'treaty'
        | 'webpage';

    interface Citation {
        schema: 'https://github.com/citation-style-language/schema/raw/master/csl-citation.json';
        citationID: string | number;
        citationItems?: CitationItem[];
        properties?: {
            noteIndex: number;
        };
    }

    interface CitationItem {
        id: string | number;
        itemData?: string;
        prefix?: string;
        suffix?: string;
        locator?: string;
        label?:
            | 'book'
            | 'chapter'
            | 'column'
            | 'figure'
            | 'folio'
            | 'issue'
            | 'line'
            | 'note'
            | 'opus'
            | 'page'
            | 'paragraph'
            | 'part'
            | 'section'
            | 'sub verbo'
            | 'verse'
            | 'volume';
        'suppress-author'?: string | number | boolean;
        'author-only'?: string | number | boolean;
        uris?: string[];
    }

    interface Data {
        id?: string;
        type?: CitationType; // tslint:disable-line
        categories?: string[];
        language?: string;
        journalAbbreviation?: string;
        shortTitle?: string;
        author?: Person[];
        'collection-editor'?: Person[];
        composer?: Person[];
        'container-author'?: Person[];
        director?: Person[];
        editor?: Person[];
        'editorial-director'?: Person[];
        interviewer?: Person[];
        illustrator?: Person[];
        'original-author'?: Person[];
        recipient?: Person[];
        'reviewed-author'?: Person[];
        translator?: Person[];
        accessed?: Date | '';
        container?: Date;
        'event-date'?: Date | '';
        'issued'?: Date | '';
        'original-date'?: Date;
        submitted?: Date;
        abstract?: string;
        annote?: string;
        archive?: string;
        'archive-location'?: string;
        'achive-place'?: string;
        authority?: string;
        'call-number'?: string;
        'chapter-number'?: string;
        'citation-number'?: string;
        'citation-label'?: string;
        'collection-number'?: string;
        'collection-title'?: string;
        'container-title'?: string;
        'container-title-short'?: string;
        dimensions?: string;
        DOI?: string;
        edition?: string | number;
        event?: string;
        'event-place'?: string;
        'first-reference-note-number'?: string;
        genre?: string;
        ISBN?: string;
        ISSN?: string;
        issue?: string | number;
        jurisdiction?: string;
        keyword?: string;
        locator?: string;
        medium?: string;
        note?: string;
        number?: string | number; // tslint:disable-line
        'number-of-pages'?: string;
        'number-of-volumes'?: string | number;
        'original-publisher'?: string;
        'original-publisher-place'?: string;
        'original-title'?: string;
        'page'?: string;
        'page-first'?: string;
        PMCID?: string;
        PMID?: string;
        publisher?: string;
        'publisher-place'?: string;
        references?: string;
        'reviewed-title'?: string;
        scale?: string;
        section?: string;
        'short-container-title'?: string[]; // Non-standard. Only appears when resolving DOIs
        source?: string;
        status?: string;
        title?: string;
        'title-short'?: string;
        URL?: string;
        version?: string;
        volume?: string | number;
        'year-suffix'?: string;
        [key: string]: any;
    }

    interface Person {
        family?: string;
        given?: string;
        'dropping-particle'?: string;
        'non-dropping-particle'?: string;
        suffix?: string;
        'comma-suffix'?: string | number | boolean;
        'static-ordering'?: string | number | boolean;
        literal?: string;
        'parse-names'?: string | number | boolean;
    }

    /**
     * Skipped Person Types:
     *   - collection-editor
     *   - editorial-director
     *   - original-author
     *   - reviewed-author
     */
    interface TypedPerson extends Person {
        type:
            | 'author' // tslint:disable-line
            | 'container-author'
            | 'editor'
            | 'director'
            | 'interviewer'
            | 'illustrator'
            | 'composer'
            | 'translator'
            | 'recipient';
    }

    interface Date {
        'date-parts'?: [Array<number | string>];
        season?: string | number;
        circa?: string | number | boolean;
        literal?: string;
        raw?: string;
        /* Not part of CSL spec - Added by Citeproc */
        day?: number;
        month?: number;
        year?: number;
        [k: string]: any;
    }
}
