import { HTMLProps } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

interface BaseField<T = string> {
    readonly key: T;
    readonly label: string;
}

export interface InputField extends BaseField<keyof CSL.Data> {
    readonly inputProps?: Readonly<HTMLProps<HTMLInputElement>>;
}

export type PersonField = BaseField<CSL.PersonFieldKey>;

export interface FieldMapping {
    readonly title: string;
    readonly fields: InputField[];
    readonly people: PersonField[];
}

/* eslint-disable @typescript-eslint/camelcase */
const CSL_FIELDS: Readonly<Record<string, FieldMapping>> = {
    bill: {
        title: __('Bill', 'academic-bloggers-toolkit'),
        fields: [
            {
                key: 'title',
                label: __('Title', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                },
            },
            {
                key: 'number',
                label: __('Bill Number', 'academic-bloggers-toolkit'),
            },
            {
                key: 'page',
                label: __('Code Pages', 'academic-bloggers-toolkit'),
            },
            {
                key: 'volume',
                label: __('Code Volume', 'academic-bloggers-toolkit'),
            },
            {
                key: 'section',
                label: __('Section', 'academic-bloggers-toolkit'),
            },
            {
                key: 'publisher',
                label: __('Legislative Body', 'academic-bloggers-toolkit'),
            },
            {
                key: 'issued',
                label: __('Date', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
            },
            {
                key: 'accessed',
                label: __('Date Accessed', 'academic-bloggers-toolkit'),
                inputProps: {
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
            },
        ],
        people: [
            {
                key: 'author',
                label: __('Sponsor', 'academic-bloggers-toolkit'),
            },
        ],
    },
    book: {
        title: __('Book', 'academic-bloggers-toolkit'),
        fields: [
            {
                key: 'title',
                label: __('Title', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                },
            },
            {
                key: 'collection-title',
                label: __('Series Title', 'academic-bloggers-toolkit'),
            },
            {
                key: 'collection-number',
                label: __('Series Number', 'academic-bloggers-toolkit'),
            },
            {
                key: 'number-of-pages',
                label: __('# of Pages', 'academic-bloggers-toolkit'),
            },
            {
                key: 'volume',
                label: __('Volume', 'academic-bloggers-toolkit'),
            },
            {
                key: 'edition',
                label: __('Edition', 'academic-bloggers-toolkit'),
            },
            {
                key: 'publisher',
                label: __('Publisher', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                },
            },
            {
                key: 'publisher-place',
                label: __('Publisher Location', 'academic-bloggers-toolkit'),
            },
            {
                key: 'URL',
                label: __('URL', 'academic-bloggers-toolkit'),
            },
            {
                key: 'issued',
                label: __('Date', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
            },
            {
                key: 'accessed',
                label: __('Date Accessed', 'academic-bloggers-toolkit'),
                inputProps: {
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
            },
        ],
        people: [
            {
                key: 'author',
                label: __('Author', 'academic-bloggers-toolkit'),
            },
            {
                key: 'editor',
                label: __('Editor', 'academic-bloggers-toolkit'),
            },
            {
                key: 'collection-editor',
                label: __('Series Editor', 'academic-bloggers-toolkit'),
            },
            {
                key: 'translator',
                label: __('Translator', 'academic-bloggers-toolkit'),
            },
        ],
    },
    chapter: {
        title: __('Book Chapter', 'academic-bloggers-toolkit'),
        fields: [
            {
                key: 'title',
                label: __('Chapter Title', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                },
            },
            {
                key: 'container-title',
                label: __('Book Title', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                },
            },
            {
                key: 'chapter-number',
                label: __('Chapter Number', 'academic-bloggers-toolkit'),
            },
            {
                key: 'collection-title',
                label: __('Series', 'academic-bloggers-toolkit'),
            },
            {
                key: 'collection-number',
                label: __('Series Number', 'academic-bloggers-toolkit'),
            },
            {
                key: 'volume',
                label: __('Volume', 'academic-bloggers-toolkit'),
            },
            {
                key: 'number-of-volumes',
                label: __('# of Volumes', 'academic-bloggers-toolkit'),
            },
            {
                key: 'edition',
                label: __('Edition', 'academic-bloggers-toolkit'),
            },
            {
                key: 'publisher',
                label: __('Publisher', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                },
            },
            {
                key: 'publisher-place',
                label: __('Publisher Location', 'academic-bloggers-toolkit'),
            },
            {
                key: 'page',
                label: __('Pages', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                },
            },
            {
                key: 'ISBN',
                label: __('ISBN', 'academic-bloggers-toolkit'),
            },
            {
                key: 'URL',
                label: __('URL', 'academic-bloggers-toolkit'),
            },
            {
                key: 'issued',
                label: __('Date', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
            },
            {
                key: 'accessed',
                label: __('Date Accessed', 'academic-bloggers-toolkit'),
                inputProps: {
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
            },
        ],
        people: [
            {
                key: 'author',
                label: __('Section Author', 'academic-bloggers-toolkit'),
            },
            {
                key: 'container-author',
                label: __('Book Author', 'academic-bloggers-toolkit'),
            },
            {
                key: 'editor',
                label: __('Editor', 'academic-bloggers-toolkit'),
            },
            {
                key: 'collection-editor',
                label: __('Series Editor', 'academic-bloggers-toolkit'),
            },
            {
                key: 'translator',
                label: __('Translator', 'academic-bloggers-toolkit'),
            },
        ],
    },
    broadcast: {
        title: __('Broadcast', 'academic-bloggers-toolkit'),
        fields: [
            {
                key: 'title',
                label: __('Title', 'academic-bloggers-toolkit'),
            },
            {
                key: 'container-title',
                label: __('Program Title', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                },
            },
            {
                key: 'number',
                label: __('Episode Number', 'academic-bloggers-toolkit'),
            },
            {
                key: 'medium',
                label: __('Format', 'academic-bloggers-toolkit'),
            },
            {
                key: 'publisher',
                label: __('Network', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                },
            },
            {
                key: 'issued',
                label: __('Date', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
            },
            {
                key: 'accessed',
                label: __('Date Accessed', 'academic-bloggers-toolkit'),
                inputProps: {
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
            },
        ],
        people: [
            {
                key: 'author',
                label: __('Producer', 'academic-bloggers-toolkit'),
            },
            {
                key: 'director',
                label: __('Director', 'academic-bloggers-toolkit'),
            },
        ],
    },
    'paper-conference': {
        title: __('Conference Proceeding', 'academic-bloggers-toolkit'),
        fields: [
            {
                key: 'title',
                label: __('Title', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                },
            },
            {
                key: 'event',
                label: __('Conference Name', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                },
            },
            {
                key: 'publisher-place',
                label: __('Conference Location', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                },
            },
            {
                key: 'issued',
                label: __('Date', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
            },
        ],
        people: [
            {
                key: 'author',
                label: __('Author', 'academic-bloggers-toolkit'),
            },
            {
                key: 'editor',
                label: __('Editor', 'academic-bloggers-toolkit'),
            },
            {
                key: 'collection-editor',
                label: __('Series Editor', 'academic-bloggers-toolkit'),
            },
            {
                key: 'translator',
                label: __('Translator', 'academic-bloggers-toolkit'),
            },
        ],
    },
    'entry-encyclopedia': {
        title: __('Encyclopedia Entry', 'academic-bloggers-toolkit'),
        fields: [
            {
                key: 'title',
                label: __('Title', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                },
            },
            {
                key: 'container-title',
                label: __('Encyclopedia Title', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                },
            },
            {
                key: 'collection-title',
                label: __('Series', 'academic-bloggers-toolkit'),
            },
            {
                key: 'collection-number',
                label: __('Series Number', 'academic-bloggers-toolkit'),
            },
            {
                key: 'volume',
                label: __('Volume', 'academic-bloggers-toolkit'),
            },
            {
                key: 'number-of-volumes',
                label: __('# of Volumes', 'academic-bloggers-toolkit'),
            },
            {
                key: 'edition',
                label: __('Edition', 'academic-bloggers-toolkit'),
            },
            {
                key: 'publisher',
                label: __('Publisher', 'academic-bloggers-toolkit'),
            },
            {
                key: 'publisher-place',
                label: __('Publisher Location', 'academic-bloggers-toolkit'),
            },
            {
                key: 'page',
                label: __('Pages', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                },
            },
            {
                key: 'issued',
                label: __('Date', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
            },
            {
                key: 'accessed',
                label: __('Date Accessed', 'academic-bloggers-toolkit'),
                inputProps: {
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
            },
        ],
        people: [
            {
                key: 'author',
                label: __('Author', 'academic-bloggers-toolkit'),
            },
            {
                key: 'editor',
                label: __('Editor', 'academic-bloggers-toolkit'),
            },
            {
                key: 'collection-editor',
                label: __('Series Editor', 'academic-bloggers-toolkit'),
            },
            {
                key: 'translator',
                label: __('Translator', 'academic-bloggers-toolkit'),
            },
        ],
    },
    motion_picture: {
        title: __('Film', 'academic-bloggers-toolkit'),
        fields: [
            {
                key: 'title',
                label: __('Title', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                },
            },
            {
                key: 'publisher',
                label: __('Distributor', 'academic-bloggers-toolkit'),
            },
            {
                key: 'genre',
                label: __('Genre', 'academic-bloggers-toolkit'),
            },
            {
                key: 'language',
                label: __('Language', 'academic-bloggers-toolkit'),
            },
            {
                key: 'medium',
                label: __('Format', 'academic-bloggers-toolkit'),
            },
            {
                key: 'issued',
                label: __('Date', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
            },
            {
                key: 'accessed',
                label: __('Date Accessed', 'academic-bloggers-toolkit'),
                inputProps: {
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
            },
        ],
        people: [
            {
                key: 'author',
                label: __('Scriptwriter', 'academic-bloggers-toolkit'),
            },
            {
                key: 'director',
                label: __('Director', 'academic-bloggers-toolkit'),
            },
            {
                key: 'editor',
                label: __('Producer', 'academic-bloggers-toolkit'),
            },
        ],
    },
    'article-journal': {
        title: __('Journal Article', 'academic-bloggers-toolkit'),
        fields: [
            {
                key: 'title',
                label: __('Title', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                },
            },
            {
                key: 'container-title',
                label: __('Journal', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                },
            },
            {
                key: 'journalAbbreviation',
                label: __('Journal Abbreviation', 'academic-bloggers-toolkit'),
            },
            {
                key: 'volume',
                label: __('Volume', 'academic-bloggers-toolkit'),
            },
            {
                key: 'issue',
                label: __('Issue', 'academic-bloggers-toolkit'),
            },
            {
                key: 'page',
                label: __('Pages', 'academic-bloggers-toolkit'),
            },
            {
                key: 'DOI',
                label: __('DOI', 'academic-bloggers-toolkit'),
            },
            {
                key: 'URL',
                label: __('URL', 'academic-bloggers-toolkit'),
            },
            {
                key: 'issued',
                label: __('Date', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
            },
        ],
        people: [
            {
                key: 'author',
                label: __('Author', 'academic-bloggers-toolkit'),
            },
            {
                key: 'editor',
                label: __('Editor', 'academic-bloggers-toolkit'),
            },
        ],
    },
    legal_case: {
        title: __('Legal Case', 'academic-bloggers-toolkit'),
        fields: [
            {
                key: 'title',
                label: __('Case Name', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                },
            },
            {
                key: 'authority',
                label: __('Court', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                },
            },
            {
                key: 'number',
                label: __('Docket Number', 'academic-bloggers-toolkit'),
                inputProps: {
                    pattern: '\\S*',
                    title: 'Any combination of non-whitespace characters',
                },
            },
            {
                key: 'issued',
                label: __('Date', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
            },
            {
                key: 'accessed',
                label: __('Date Accessed', 'academic-bloggers-toolkit'),
                inputProps: {
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
            },
        ],
        people: [
            {
                key: 'author',
                label: __('Author', 'academic-bloggers-toolkit'),
            },
        ],
    },
    'article-magazine': {
        title: __('Magazine Article', 'academic-bloggers-toolkit'),
        fields: [
            {
                key: 'title',
                label: __('Title', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                },
            },
            {
                key: 'container-title',
                label: __('Magazine', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                },
            },
            {
                key: 'volume',
                label: __('Volume', 'academic-bloggers-toolkit'),
            },
            {
                key: 'page',
                label: __('Pages', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                },
            },
            {
                key: 'issue',
                label: __('Issue', 'academic-bloggers-toolkit'),
            },
            {
                key: 'ISSN',
                label: __('ISSN', 'academic-bloggers-toolkit'),
            },
            {
                key: 'URL',
                label: __('URL', 'academic-bloggers-toolkit'),
            },
            {
                key: 'issued',
                label: __('Date', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
            },
            {
                key: 'accessed',
                label: __('Date Accessed', 'academic-bloggers-toolkit'),
                inputProps: {
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
            },
        ],
        people: [
            {
                key: 'author',
                label: __('Author', 'academic-bloggers-toolkit'),
            },
            {
                key: 'editor',
                label: __('Editor', 'academic-bloggers-toolkit'),
            },
        ],
    },
    'article-newspaper': {
        title: __('Newspaper Article', 'academic-bloggers-toolkit'),
        fields: [
            {
                key: 'title',
                label: __('Title', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                },
            },
            {
                key: 'container-title',
                label: __('Publication', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                },
            },
            {
                key: 'section',
                label: __('Section', 'academic-bloggers-toolkit'),
            },
            {
                key: 'page',
                label: __('Pages', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                },
            },
            {
                key: 'issue',
                label: __('Issue', 'academic-bloggers-toolkit'),
            },
            {
                key: 'URL',
                label: __('URL', 'academic-bloggers-toolkit'),
            },
            {
                key: 'issued',
                label: __('Date', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
            },
            {
                key: 'accessed',
                label: __('Date Accessed', 'academic-bloggers-toolkit'),
                inputProps: {
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
            },
        ],
        people: [
            {
                key: 'author',
                label: __('Author', 'academic-bloggers-toolkit'),
            },
            {
                key: 'editor',
                label: __('Editor', 'academic-bloggers-toolkit'),
            },
        ],
    },
    patent: {
        title: __('Patent', 'academic-bloggers-toolkit'),
        fields: [
            {
                key: 'title',
                label: __('Title', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                },
            },
            {
                key: 'number',
                label: __('Number', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                },
            },
            {
                key: 'jurisdiction',
                label: __('Jurisdiction', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                },
            },
            {
                key: 'page',
                label: __('Pages', 'academic-bloggers-toolkit'),
            },
            {
                key: 'authority',
                label: __('Issuing Authority', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                },
            },
            {
                key: 'URL',
                label: __('URL', 'academic-bloggers-toolkit'),
            },
            {
                key: 'issued',
                label: __('Date', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
            },
            {
                key: 'accessed',
                label: __('Date Accessed', 'academic-bloggers-toolkit'),
                inputProps: {
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
            },
        ],
        people: [
            {
                key: 'author',
                label: __('Inventor', 'academic-bloggers-toolkit'),
            },
        ],
    },
    speech: {
        title: __('Presentation', 'academic-bloggers-toolkit'),
        fields: [
            {
                key: 'title',
                label: __('Title', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                },
            },
            {
                key: 'event',
                label: __('Event Name', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                },
            },
            {
                key: 'event-place',
                label: __('Event Location', 'academic-bloggers-toolkit'),
            },
            {
                key: 'language',
                label: __('Language', 'academic-bloggers-toolkit'),
            },
            {
                key: 'issued',
                label: __('Date', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
            },
        ],
        people: [
            {
                key: 'author',
                label: __('Presenter', 'academic-bloggers-toolkit'),
            },
        ],
    },
    report: {
        title: __('Report', 'academic-bloggers-toolkit'),
        fields: [
            {
                key: 'title',
                label: __('Title', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                },
            },
            {
                key: 'genre',
                label: __('Report Type', 'academic-bloggers-toolkit'),
            },
            {
                key: 'number',
                label: __('Number', 'academic-bloggers-toolkit'),
            },
            {
                key: 'collection-title',
                label: __('Series', 'academic-bloggers-toolkit'),
            },
            {
                key: 'container-title',
                label: __('Publication', 'academic-bloggers-toolkit'),
            },
            {
                key: 'publisher',
                label: __('Publisher', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                },
            },
            {
                key: 'page',
                label: __('Pages', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                },
            },
            {
                key: 'URL',
                label: __('URL', 'academic-bloggers-toolkit'),
            },
            {
                key: 'issued',
                label: __('Date', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
            },
            {
                key: 'accessed',
                label: __('Date Accessed', 'academic-bloggers-toolkit'),
                inputProps: {
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
            },
        ],
        people: [
            {
                key: 'author',
                label: __('Author', 'academic-bloggers-toolkit'),
            },
            {
                key: 'collection-editor',
                label: __('Series Editor', 'academic-bloggers-toolkit'),
            },
            {
                key: 'translator',
                label: __('Translator', 'academic-bloggers-toolkit'),
            },
        ],
    },
    legislation: {
        title: __('Statute', 'academic-bloggers-toolkit'),
        fields: [
            {
                key: 'title',
                label: __('Title', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                },
            },
            {
                key: 'number',
                label: __('Statute Number', 'academic-bloggers-toolkit'),
            },
            {
                key: 'section',
                label: __('Section', 'academic-bloggers-toolkit'),
            },
            {
                key: 'page',
                label: __('Pages', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                },
            },
            {
                key: 'issued',
                label: __('Date', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
            },
            {
                key: 'accessed',
                label: __('Date Accessed', 'academic-bloggers-toolkit'),
                inputProps: {
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
            },
        ],
        people: [
            {
                key: 'author',
                label: __('Author', 'academic-bloggers-toolkit'),
            },
        ],
    },
    thesis: {
        title: __('Thesis', 'academic-bloggers-toolkit'),
        fields: [
            {
                key: 'title',
                label: __('Title', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                },
            },
            {
                key: 'number-of-pages',
                label: __('# of Pages', 'academic-bloggers-toolkit'),
            },
            {
                key: 'publisher',
                label: __('University', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                },
            },
            {
                key: 'publisher-place',
                label: __('Location', 'academic-bloggers-toolkit'),
            },
            {
                key: 'URL',
                label: __('URL', 'academic-bloggers-toolkit'),
            },
            {
                key: 'issued',
                label: __('Date', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
            },
            {
                key: 'accessed',
                label: __('Date Accessed', 'academic-bloggers-toolkit'),
                inputProps: {
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
            },
        ],
        people: [
            {
                key: 'author',
                label: __('Author', 'academic-bloggers-toolkit'),
            },
        ],
    },
    webpage: {
        title: __('Web Page', 'academic-bloggers-toolkit'),
        fields: [
            {
                key: 'title',
                label: __('Content Title', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                },
            },
            {
                key: 'container-title',
                label: __('Website Title', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                },
            },
            {
                key: 'URL',
                label: __('URL', 'academic-bloggers-toolkit'),
                inputProps: {
                    required: true,
                },
            },
            {
                key: 'issued',
                label: __('Date', 'academic-bloggers-toolkit'),
                inputProps: {
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
            },
            {
                key: 'accessed',
                label: __('Date Accessed', 'academic-bloggers-toolkit'),
                inputProps: {
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
            },
        ],
        people: [
            {
                key: 'author',
                label: __('Author', 'academic-bloggers-toolkit'),
            },
        ],
    },
};

export default CSL_FIELDS;
// vim: set fdl=1 fdn=2:
