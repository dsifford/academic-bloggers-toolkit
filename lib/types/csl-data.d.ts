// Type definitions for CSL-Data JSON
// Definitions by: Derek P Sifford <dereksifford@gmail.com>
// tslint:disable:no-reserved-keywords

declare namespace CSL {
    type ItemType = import('csl-data').ItemType;

    type DateFieldKey = import('csl-data').DateFieldKey;
    type NumberFieldKey = import('csl-data').NumberFieldKey;
    type PersonFieldKey = import('csl-data').PersonFieldKey;
    type StringFieldKey = import('csl-data').StringFieldKey;

    type Date = import('csl-data').Date;
    type Person = import('csl-data').Person;

    type Data = import('csl-data').Data;
}

declare module 'csl-data' {
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

    type DateFieldKey =
        | 'accessed'
        | 'container'
        | 'event-date'
        | 'issued'
        | 'original-date'
        | 'submitted';

    type NumberFieldKey =
        | 'chapter-number'
        | 'collection-number'
        | 'edition'
        | 'issue'
        | 'number'
        | 'number-of-pages'
        | 'number-of-volumes'
        | 'volume';

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

    type StringFieldKey =
        | 'abstract'
        | 'annote'
        | 'archive'
        | 'archive_location'
        | 'archive-place'
        | 'authority'
        | 'call-number'
        | 'citation-label'
        | 'citation-number'
        | 'collection-title'
        | 'container-title'
        | 'container-title-short'
        | 'dimensions'
        | 'DOI'
        | 'event'
        | 'event-place'
        | 'first-reference-note-number'
        | 'genre'
        | 'ISBN'
        | 'ISSN'
        | 'journalAbbreviation'
        | 'jurisdiction'
        | 'keyword'
        | 'language'
        | 'locator'
        | 'medium'
        | 'note'
        | 'original-publisher'
        | 'original-publisher-place'
        | 'original-title'
        | 'page'
        | 'page-first'
        | 'PMID'
        | 'PMCID'
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
        | 'year-suffix';

    type LooseNumber = string | number;

    interface DatePartial {
        'date-parts'?: [
            [LooseNumber, LooseNumber?, LooseNumber?],
            [LooseNumber, LooseNumber?, LooseNumber?]?
        ];
        /**
         * Three variants:
         *      1.  1,   2,   3,   4  => spring, summer, fall, winter
         *      2. "1", "2", "3", "4" => spring, summer, fall, winter
         *      3.            string  => any literal string
         * Spring, Summer, Fall, Winter
         */
        season?: 1 | 2 | 3 | 4 | string;
        /**
         * If date is approximate, this should be set to a "truthy" value.
         */
        circa?: boolean;
        /**
         * May be used with Citeproc-js. String must be able to parse directly into a
         * valid `Date` using `new Date()` **NOT A CSL STANDARD**
         */
        raw?: string;
        /**
         * Literal date string. Should only be used as a last resort.
         */
        literal?: string;
    }

    interface PersonPartial {
        /**
         * Surname minus any particles and suffixes
         */
        family?: string;
        /**
         * Given names, either full ("John Edward") or initialized ("J. E.")
         */
        given?: string;
        /**
         * Name suffix, e.g. "Jr." in "John Smith Jr." and "III" in "Bill Gates III"
         */
        suffix?: string;
        /**
         * Name particles that are not dropped when only the surname is shown
         * ("de" in the Dutch surname "de Koning") but which may be treated
         * separately from the family name, e.g. for sorting
         */
        'non-dropping-particle'?: string;
        /**
         * Name particles that are dropped when only the surname is shown
         * ("van" in "Ludwig van Beethoven", which becomes "Beethoven")
         */
        'dropping-particle'?: string;
        literal?: string;
    }

    type Date = (
        | {
              'date-parts': [
                  [LooseNumber, LooseNumber?, LooseNumber?],
                  [LooseNumber, LooseNumber?, LooseNumber?]?
              ];
          }
        | { raw: string }
        | { literal: string }) &
        DatePartial;

    type Person =
        | ({ family: string } & PersonPartial)
        | ({ literal: string } & PersonPartial);

    // prettier-ignore
    type Data =
        { [k in DateFieldKey]?: Date } &
        { [k in NumberFieldKey]?: string | number } &
        { [k in PersonFieldKey]?: Person[] } &
        { [k in StringFieldKey]?: string } & {
            id: string;
            type: ItemType;
        };
}
