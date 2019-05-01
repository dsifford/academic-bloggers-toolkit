export const enum IdentifierKind {
    DOI = 'doi',
    PMID = 'pmid',
    PMCID = 'pmcid',
}

export const CSL_DATE_KEYS: readonly CSL.DateFieldKey[] = [
    'accessed',
    'container',
    'event-date',
    'issued',
    'original-date',
    'submitted',
];

export const CSL_NUMBER_KEYS: readonly CSL.NumberFieldKey[] = [
    'chapter-number',
    'collection-number',
    'edition',
    'issue',
    'number-of-pages',
    'number-of-volumes',
    'volume',
];

export const CSL_PERSON_KEYS: readonly CSL.PersonFieldKey[] = [
    'author',
    'collection-editor',
    'composer',
    'container-author',
    'director',
    'editor',
    'editorial-director',
    'illustrator',
    'interviewer',
    'original-author',
    'recipient',
    'reviewed-author',
    'translator',
];

export const CSL_STRING_KEYS: readonly CSL.StringFieldKey[] = [
    'DOI',
    'ISBN',
    'ISSN',
    'PMCID',
    'PMID',
    'URL',
    'abstract',
    'annote',
    'archive',
    'archive-place',
    'archive_location',
    'authority',
    'call-number',
    'citation-label',
    'citation-number',
    'collection-title',
    'container-title',
    'container-title-short',
    'dimensions',
    'event',
    'event-place',
    'first-reference-note-number',
    'genre',
    'journalAbbreviation',
    'jurisdiction',
    'keyword',
    'language',
    'locator',
    'medium',
    'note',
    'number',
    'original-publisher',
    'original-publisher-place',
    'original-title',
    'page',
    'page-first',
    'publisher',
    'publisher-place',
    'references',
    'reviewed-title',
    'scale',
    'section',
    'shortTitle',
    'source',
    'status',
    'title',
    'title-short',
    'version',
    'year-suffix',
];

export const CSL_KEYS: ReadonlyArray<keyof CSL.Data> = [
    'id',
    'type',
    ...CSL_DATE_KEYS,
    ...CSL_NUMBER_KEYS,
    ...CSL_PERSON_KEYS,
    ...CSL_STRING_KEYS,
];

export const ZERO_WIDTH_SPACE = '\u200b';

// vim: set fdm=indent fdl=0:
