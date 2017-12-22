/**
 * NOTE: Some fields in the CSL Specification allow for type "string" OR "number". In those
 * instances, this library will narrow them to be exclusively type string so that the implementer
 * will be certain as to what they are getting.
 */
declare namespace CSL {
    type Year = string | number;
    type Month = string | number;
    type Day = string | number;

    type DatePart = [Year, Month, Day];

    interface DateOptional {
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

    type Date =
        | { 'date-parts': [DatePart] | [DatePart, DatePart] } & DateOptional
        | { literal: string } & DateOptional;

    type DateFieldKey =
        | 'accessed'
        | 'container'
        | 'event-date'
        | 'issued'
        | 'original-date'
        | 'submitted';

    type DateFields = { [k in DateFieldKey]?: Date };

    interface PersonOptional {
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

    type Person =
        | { family: string } & PersonOptional
        | { given: string } & PersonOptional
        | { literal: string } & PersonOptional;

    type PersonFieldKey =
        | 'author'
        | 'collection-editor'
        | 'composer'
        | 'container-author'
        | 'director'
        | 'editor'
        | 'editorial-director'
        | 'illustrator'
        | 'interviewer'
        | 'original-author'
        | 'recipient'
        | 'reviewed-author'
        | 'translator';

    type PersonFields = { [k in PersonFieldKey]?: Person[] };

    type StandardFieldKey =
        | 'abstract'
        | 'annote'
        | 'archive'
        | 'archive_location'
        | 'archive-place'
        | 'authority'
        | 'call-number'
        // NOTE: Skipped `categories` -- too hard to deal with a random array
        | 'chapter-number'
        | 'citation-label'
        | 'citation-number'
        | 'collection-number'
        | 'collection-title'
        | 'container-title'
        | 'container-title-short'
        | 'dimensions'
        | 'DOI'
        | 'edition'
        | 'event'
        | 'event-place'
        | 'first-reference-note-number'
        | 'genre'
        | 'ISBN'
        | 'ISSN'
        | 'issue'
        | 'jurisdiction'
        | 'journalAbbreviation'
        | 'keyword'
        | 'language'
        | 'locator'
        | 'medium'
        | 'note'
        | 'number'
        | 'number-of-pages'
        | 'number-of-volumes'
        | 'original-publisher'
        | 'original-publisher-place'
        | 'original-title'
        | 'page'
        | 'page-first'
        | 'PMCID'
        | 'PMID'
        | 'publisher'
        | 'publisher-place'
        | 'references'
        | 'reviewed-title'
        | 'scale'
        | 'section'
        | 'shortTitle'
        | 'source'
        | 'status'
        | 'title'
        | 'title-short'
        | 'URL'
        | 'version'
        | 'volume'
        | 'year-suffix';

    type StandardFields = { [k in StandardFieldKey]?: string };

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

    type Value = Date | Person[] | string;

    interface Data extends DateFields, PersonFields, StandardFields {
        id: string;
        type: ItemType;
    }
}
