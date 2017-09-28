/**
 * NOTE: Some fields in the CSL Specification allow for type "string" OR "number". In those
 * instances, this library will narrow them to be exclusively type string so that the implementer
 * will be certain as to what they are getting.
 */
declare namespace CSL {
    interface Data {
        type: ItemType;
        id: string;
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
        accessed?: DateType;
        container?: DateType;
        'event-date'?: DateType;
        issued?: DateType;
        'original-date'?: DateType;
        submitted?: DateType;
        abstract?: string;
        annote?: string;
        archive?: string;
        archive_location?: string;
        'archive-place'?: string;
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
        edition?: string;
        event?: string;
        'event-place'?: string;
        'first-reference-note-number'?: string;
        genre?: string;
        ISBN?: string;
        ISSN?: string;
        issue?: string;
        jurisdiction?: string;
        keyword?: string;
        locator?: string;
        medium?: string;
        note?: string;
        number?: string;
        'number-of-pages'?: string;
        'number-of-volumes'?: string;
        'original-publisher'?: string;
        'original-publisher-place'?: string;
        'original-title'?: string;
        page?: string;
        'page-first'?: string;
        PMCID?: string;
        PMID?: string;
        publisher?: string;
        'publisher-place'?: string;
        references?: string;
        'reviewed-title'?: string;
        scale?: string;
        section?: string;
        source?: string;
        status?: string;
        title?: string;
        'title-short'?: string;
        URL?: string;
        version?: string;
        volume?: string;
        'year-suffix'?: string;
    }

    type PersonType =
        | 'author'
        | 'container-author'
        | 'editor'
        | 'director'
        | 'interviewer'
        | 'illustrator'
        | 'composer'
        | 'translator'
        | 'recipient';

    type DateKey =
        | 'accessed'
        | 'container'
        | 'event-date'
        | 'issued'
        | 'original-date'
        | 'submitted';

    type ItemType =
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

    type Year = string | number;
    type Month = string | number;
    type Day = string | number;

    type DatePart = [Year, Month, Day];

    interface DateType {
        /** First variant if no end date. Second variant if there is an end date */
        'date-parts'?: [DatePart] | [DatePart, DatePart];
        /** Spring, Summer, Fall, Winter */
        season?: '1' | '2' | '3' | '4';
        /** If date is approximate, this should be true. Otherwise Don't set */
        circa?: boolean;
        /** Literal date string. Should be used as a last resort */
        literal?: string;
        /**
         * May be used with Citeproc-js. String must be able to parse directly into a
         * valid `Date` using `new Date()` **NOT A CSL STANDARD**
         */
        raw?: string;
    }
}
