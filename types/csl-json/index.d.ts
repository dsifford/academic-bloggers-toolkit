// Type definitions for the CSL JSON Schema
// Project: https://github.com/citation-style-language/schema
// Definitions by: Derek P Sifford <https://github.com/dsifford>

declare global {
    namespace CSL {
        type ItemType = IItemType;
        type DateFieldKey = IDateFieldKey;
        type PersonFieldKey = IPersonFieldKey;
        type NumberFieldKey = INumberFieldKey;
        type StringFieldKey = IStringFieldKey;
        type Date = IDate;
        type Person = IPerson;
        type Data = IData;
    }
}

export type ItemType =
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

export type DateFieldKey =
    | 'accessed'
    | 'container'
    | 'event-date'
    | 'issued'
    | 'original-date'
    | 'submitted';

export type NumberFieldKey =
    | 'chapter-number'
    | 'collection-number'
    | 'edition'
    | 'issue'
    | 'number-of-pages'
    | 'number-of-volumes'
    | 'volume';

export type PersonFieldKey =
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

export type StringFieldKey =
    | 'DOI'
    | 'ISBN'
    | 'ISSN'
    | 'PMCID'
    | 'PMID'
    | 'URL'
    | 'abstract'
    | 'annote'
    | 'archive'
    | 'archive-place'
    | 'archive_location'
    | 'authority'
    | 'call-number'
    | 'citation-label'
    | 'citation-number'
    | 'collection-title'
    | 'container-title'
    | 'container-title-short'
    | 'dimensions'
    | 'event'
    | 'event-place'
    | 'first-reference-note-number'
    | 'genre'
    | 'journalAbbreviation'
    | 'jurisdiction'
    | 'keyword'
    | 'language'
    | 'locator'
    | 'medium'
    | 'note'
    | 'number'
    | 'original-publisher'
    | 'original-publisher-place'
    | 'original-title'
    | 'page'
    | 'page-first'
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

export type Date = (
    | {
          'date-parts': [
              [LooseNumber, LooseNumber?, LooseNumber?],
              [LooseNumber, LooseNumber?, LooseNumber?]?
          ];
      }
    | { raw: string }
    | { literal: string }) &
    DatePartial;

export type Person =
    | ({ family: string } & PersonPartial)
    | ({ literal: string } & PersonPartial);

// prettier-ignore
export type Data =
        { [k in DateFieldKey]?: Date } &
        { [k in NumberFieldKey]?: string | number } &
        { [k in PersonFieldKey]?: Person[] } &
        { [k in StringFieldKey]?: string } & {
            id: string;
            type: ItemType;
        };

type IItemType = ItemType;
type IDateFieldKey = DateFieldKey;
type INumberFieldKey = NumberFieldKey;
type IPersonFieldKey = PersonFieldKey;
type IStringFieldKey = StringFieldKey;
type IDate = Date;
type IPerson = Person;
type IData = Data;
