export const wpInfo: ABT.Globals['wp'] = {
    abt_url:
        'http://localhost:8080/wp-content/plugins/academic-bloggers-toolkit',
    home_url: 'http://localhost:8080',
    plugins_url: 'http://localhost:8080/wp-content/plugins',
    wp_upload_dir: {
        basedir: '/app/wp-content/uploads',
        baseurl: 'http://localhost:8080/wp-content/uploads',
        error: false,
        path: '/app/wp-content/uploads/2017/08',
        subdir: '/2017/08',
        url: 'http://localhost:8080/wp-content/uploads/2017/08',
    },
    info: {
        site: {
            language: 'en_US',
            name: 'Test Site',
            plugins: ['academic-bloggers-toolkit'],
            theme: 'twentyseventeen',
            url: 'http://localhost:8080',
        },
        versions: {
            abt: '0.0.0',
            php: '0.0.0',
            wordpress: '0.0.0',
        },
    },
};

export const state: ABT.Globals['state'] = {
    displayOptions: {
        bib_heading: 'Bibliography',
        bibliography: 'fixed',
        links: 'always',
        bib_heading_level: 'h3',
    },
    cache: {
        style: {
            kind: 'predefined',
            value: 'american-medical-association',
            label: 'American Medical Association',
        },
        locale: 'en-US',
    },
    citationByIndex: [
        {
            citationID: 'htmlSpanId',
            citationItems: [
                {
                    id: 'aaaaaaaa',
                    item: {
                        ISSN: '3',
                        PMID: '12345',
                        URL: 'http://www.test.com',
                        author: [{ family: 'Doe', given: 'JD' }],
                        'chapter-number': '1',
                        'container-title-short': 'J Test',
                        'container-title': 'Journal of Testing',
                        edition: '2',
                        id: 'aaaaaaaa',
                        issue: '4',
                        issued: { 'date-parts': [['2016', '08', '19']] },
                        journalAbbreviation: 'J Test',
                        language: 'en-US',
                        medium: 'print',
                        number: '5',
                        page: '100-3',
                        'publisher-place': 'USA',
                        publisher: 'Test',
                        title: 'Test Title',
                        type: 'article-journal',
                        volume: '6',
                    },
                },
                {
                    id: 'bbbbbbbb',
                    item: {
                        ISSN: '3',
                        PMID: '12345',
                        URL: 'http://www.test.com',
                        author: [{ family: 'Doe', given: 'JD' }],
                        'chapter-number': '1',
                        'container-title-short': 'J Test',
                        'container-title': 'Journal of Testing',
                        edition: '2',
                        id: 'bbbbbbbb',
                        issue: '4',
                        issued: { 'date-parts': [['2016', '08', '19']] },
                        journalAbbreviation: 'J Test',
                        language: 'en-US',
                        medium: 'print',
                        number: '5',
                        page: '100-3',
                        'publisher-place': 'USA',
                        publisher: 'Test',
                        title: 'Test Title',
                        type: 'article-journal',
                        volume: '6',
                    },
                },
            ],
            properties: {
                index: 0,
                noteIndex: 0,
            },
        },
        {
            citationID: 'otherHtmlSpanId',
            citationItems: [
                {
                    id: 'bbbbbbbb',
                    item: {
                        ISSN: '3',
                        PMID: '12345',
                        URL: 'http://www.test.com',
                        author: [{ family: 'Doe', given: 'JD' }],
                        'chapter-number': '1',
                        'container-title-short': 'J Test',
                        'container-title': 'Journal of Testing',
                        edition: '2',
                        id: 'bbbbbbbb',
                        issue: '4',
                        issued: { 'date-parts': [['2015', '08', '19']] },
                        journalAbbreviation: 'J Test',
                        language: 'en-US',
                        medium: 'print',
                        number: '5',
                        page: '100-3',
                        'publisher-place': 'USA',
                        publisher: 'Test',
                        title: 'Other Test Title',
                        type: 'article-journal',
                        volume: '6',
                    },
                },
            ],
            properties: {
                index: 1,
                noteIndex: 0,
            },
        },
    ],
    CSL: {
        aaaaaaaa: {
            ISSN: '3',
            PMID: '12345',
            URL: 'http://www.test.com',
            author: [{ family: 'Doe', given: 'JD' }],
            'chapter-number': '1',
            'container-title-short': 'J Test',
            'container-title': 'Journal of Testing',
            edition: '2',
            id: 'aaaaaaaa',
            issue: '4',
            issued: { 'date-parts': [['2016', '08', '19']] },
            journalAbbreviation: 'J Test',
            language: 'en-US',
            medium: 'print',
            number: '5',
            page: '100-3',
            'publisher-place': 'USA',
            publisher: 'Test',
            title: 'Test Title',
            type: 'article-journal',
            volume: '6',
        },
        bbbbbbbb: {
            ISSN: '3',
            PMID: '12345',
            URL: 'http://www.test.com',
            author: [{ family: 'Doe', given: 'JD' }],
            'chapter-number': '1',
            'container-title-short': 'J Test',
            'container-title': 'Journal of Testing',
            edition: '2',
            id: 'bbbbbbbb',
            issue: '4',
            issued: { 'date-parts': [['2016', '08', '19']] },
            journalAbbreviation: 'J Test',
            language: 'en-US',
            medium: 'print',
            number: '5',
            page: '100-3',
            'publisher-place': 'USA',
            publisher: 'Test',
            title: 'Other Test Title',
            type: 'article-journal',
            volume: '6',
        },
        cccccccc: {
            ISSN: '3',
            PMID: '12345',
            URL: 'http://www.test.com',
            author: [{ family: 'Doe', given: 'JD' }],
            'chapter-number': '1',
            'container-title-short': 'J Test',
            'container-title': 'Journal of Testing',
            edition: '2',
            id: 'cccccccc',
            issue: '4',
            issued: { 'date-parts': [['2016', '08', '19']] },
            journalAbbreviation: 'J Test',
            language: 'en-US',
            medium: 'print',
            number: '5',
            page: '100-3',
            'publisher-place': 'USA',
            publisher: 'Test',
            title: 'Test Title Uncited',
            type: 'article-journal',
            volume: '6',
        },
    },
};

const blankFields = [
    'article',
    'article-journal',
    'article-magazine',
    'article-newspaper',
    'bill',
    'book',
    'broadcast',
    'chapter',
    'dataset',
    'entry',
    'entry-dictionary',
    'entry-encyclopedia',
    'figure',
    'graphic',
    'interview',
    'legal_case',
    'legislation',
    'manuscript',
    'map',
    'motion_picture',
    'musical_score',
    'pamphlet',
    'paper-conference',
    'patent',
    'personal_communication',
    'post',
    'post-weblog',
    'report',
    'review',
    'review-book',
    'song',
    'speech',
    'thesis',
    'treaty',
    'webpage',
].reduce(
    (obj, item) => {
        return {
            ...obj,
            [item]: {
                title: '',
                fields: [],
                people: [],
            },
        };
    },
    <ABT.FieldMappings>{},
);

export const i18n: ABT.Globals['i18n'] = {
    options_page: {
        citation_style_type: 'Citation Style Type',
        predefined: 'Predefined',
        custom: 'Custom',
        heading: 'Heading',
        heading_level: 'Heading Level',
        fixed: 'Fixed',
        toggle: 'Toggle',
        bibliography_style: 'Bibliography Style',
        link_format: {
            title: 'Link Format',
            always: 'Make URLs clickable and always add trailing source link',
            always_full_surround:
                'Make entire reference a clickable link to the source URL',
            urls: 'Make URLs clickable only',
            never: 'Never add clickable links',
        },
    },
    citation_types: [
        {
            label: 'Bill',
            value: 'bill',
        },
        {
            label: 'Book',
            value: 'book',
        },
        {
            label: 'Book Section',
            value: 'chapter',
        },
        {
            label: 'Case',
            value: 'legal_case',
        },
        {
            label: 'Conference Proceeding',
            value: 'paper-conference',
        },
        {
            label: 'Encyclopedia Entry',
            value: 'entry-encyclopedia',
        },
        {
            label: 'Film',
            value: 'motion_picture',
        },
        {
            label: 'Generic (Note)',
            value: 'article',
        },
        {
            label: 'Hearing',
            value: 'speech',
        },
        {
            label: 'Journal Article',
            value: 'article-journal',
        },
        {
            label: 'Magazine Article',
            value: 'article-magazine',
        },
        {
            label: 'Newspaper Article',
            value: 'article-newspaper',
        },
        {
            label: 'Patent',
            value: 'patent',
        },
        {
            label: 'Report',
            value: 'report',
        },
        {
            label: 'Statute',
            value: 'legislation',
        },
        {
            label: 'Television Broadcast',
            value: 'broadcast',
        },
        {
            label: 'Thesis',
            value: 'thesis',
        },
        {
            label: 'Web Page',
            value: 'webpage',
        },
    ],
    dialogs: {
        add: {
            button_row: {
                add_manually: 'Add Manually',
                add_reference: 'Add Reference',
                add_with_identifier: 'Add with Identifier',
                insert_inline: 'Insert citation inline',
                search_pubmed: 'Search PubMed',
            },
            identifier_input: {
                label: 'DOI/PMID/PMCID',
            },
            manual_input: {
                autocite: 'Autocite',
                citation_type: 'Citation Type',
                ISBN: 'ISBN',
                search: 'Search',
                URL: 'URL',
            },
            contributor_list: {
                add: 'Add contributor',
                contributors: 'Contributors',
            },
            contributor: {
                given: 'Given Name, M.I.',
                surname: 'Surname',
                literal: 'Literal Name',
                remove: 'Remove contributor',
                toggle_literal: 'Toggle literal name',
            },
            title: 'Add References',
        },
        close_label: 'Close dialog',
        edit: {
            title: 'Edit Reference',
            confirm: 'Confirm',
        },
        import: {
            import_button: 'Import',
            title: 'Import References',
            upload: 'Choose File',
        },
        pubmed: {
            add_reference: 'Select',
            next: 'Next',
            previous: 'Previous',
            search: 'Search',
            title: 'Search PubMed',
            view_reference: 'View',
        },
    },
    errors: {
        missing_php_features:
            'Your WordPress PHP installation is incomplete. You must have the following PHP extensions enabled to use this feature: "dom", "libxml"',
        bad_request: 'Request not valid',
        denied: 'Site denied request',
        file_extension_error:
            'Invalid file extension. Extension must be .ris, .bib, or .bibtex',
        filetype_error: 'The selected file could not be processed',
        identifiers_not_found: {
            all: 'No identifiers could be found for your request',
            some: 'The following identifiers could not be found',
        },
        network_error: 'Network Error',
        no_results: 'Your search returned 0 results',
        prefix: 'Error',
        ris_leftovers: 'The following references were unable to be processed',
        status_error: 'Request returned a non-200 status code',
        warnings: {
            warning: 'Warning',
            reason: 'Reason',
            no_bib: 'No bibliography format exists for your citation type',
        },
        unexpected: {
            message: 'An unexpected error occurred',
            report_instructions:
                'Please report this error, including the steps taken to trigger it, here: \nhttps://github.com/dsifford/academic-bloggers-toolkit/issues',
        },
        tinymce_unavailable:
            "TinyMCE editor doesn't appear to be available in this scope",
        invalid_predefined_style: 'Invalid predefined style type',
    },
    fieldmaps: {
        ...blankFields,
        article: {
            title: 'Generic (Note)',
            fields: [
                {
                    value: 'title',
                    label: 'Text',
                    required: true,
                },
            ],
            people: [],
        },
        'article-journal': {
            title: 'Journal Article',
            fields: [
                {
                    value: 'title',
                    label: 'Title',
                    required: true,
                },
                {
                    value: 'container-title',
                    label: 'Journal',
                    required: true,
                },
                {
                    value: 'journalAbbreviation',
                    label: 'Journal Abbreviation',
                },
                {
                    value: 'volume',
                    label: 'Volume',
                    pattern: '[0-9]+',
                    title: 'One or more numbers, no spaces',
                },
                {
                    value: 'issue',
                    label: 'Issue',
                    pattern: '[0-9]+',
                },
                {
                    value: 'page',
                    label: 'Pages',
                    pattern: '[0-9]+(?:-[0-9]+)?',
                    title: 'Number or Range of Numbers (100-200)',
                },
                {
                    value: 'DOI',
                    label: 'DOI',
                },
                {
                    value: 'URL',
                    label: 'URL',
                },
                {
                    value: 'issued',
                    label: 'Date',
                    required: true,
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
            ],
            people: [
                {
                    type: 'author',
                    label: 'Author',
                },
                {
                    type: 'editor',
                    label: 'Editor',
                },
            ],
        },
        'article-magazine': {
            title: 'Magazine Article',
            fields: [
                {
                    value: 'title',
                    label: 'Title',
                    required: true,
                },
                {
                    value: 'container-title',
                    label: 'Magazine',
                    required: true,
                },
                {
                    value: 'volume',
                    label: 'Volume',
                    pattern: '[0-9]+',
                    title: 'One or more numbers, no spaces',
                },
                {
                    value: 'page',
                    label: 'Pages',
                    required: true,
                    pattern: '[0-9]+(?:-[0-9]+)?',
                    title: 'Number or Range of Numbers (100-200)',
                },
                {
                    value: 'issue',
                    label: 'Issue',
                },
                {
                    value: 'ISSN',
                    label: 'ISSN',
                },
                {
                    value: 'URL',
                    label: 'URL',
                },
                {
                    value: 'issued',
                    label: 'Date',
                    required: true,
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
                {
                    value: 'accessed',
                    label: 'Date Accessed',
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
            ],
            people: [
                {
                    type: 'author',
                    label: 'Author',
                },
                {
                    type: 'editor',
                    label: 'Editor',
                },
            ],
        },
        'article-newspaper': {
            title: 'Newspaper Article',
            fields: [
                {
                    value: 'title',
                    label: 'Title',
                    required: true,
                },
                {
                    value: 'container-title',
                    label: 'Publication',
                    required: true,
                },
                {
                    value: 'section',
                    label: 'Section',
                },
                {
                    value: 'page',
                    label: 'Pages',
                    required: true,
                    pattern: '[0-9]+(?:-[0-9]+)?',
                    title: 'Number or Range of Numbers (100-200)',
                },
                {
                    value: 'issue',
                    label: 'Issue',
                },
                {
                    value: 'URL',
                    label: 'URL',
                },
                {
                    value: 'issued',
                    label: 'Date',
                    required: true,
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
                {
                    value: 'accessed',
                    label: 'Date Accessed',
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
            ],
            people: [
                {
                    type: 'author',
                    label: 'Author',
                },
                {
                    type: 'editor',
                    label: 'Editor',
                },
            ],
        },
        bill: {
            title: 'Bill',
            fields: [
                {
                    value: 'title',
                    label: 'Title',
                    required: true,
                },
                {
                    value: 'number',
                    label: 'Bill Number',
                },
                {
                    value: 'page',
                    label: 'Code Pages',
                    pattern: '[0-9]+(?:-[0-9]+)?',
                    title: 'Number or Range of Numbers (100-200)',
                },
                {
                    value: 'volume',
                    label: 'Code Volume',
                    pattern: '[0-9]+',
                    title: 'One or more numbers, no spaces',
                },
                {
                    value: 'section',
                    label: 'Section',
                },
                {
                    value: 'publisher',
                    label: 'Legislative Body',
                },
                {
                    value: 'issued',
                    label: 'Date',
                    required: true,
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
                {
                    value: 'accessed',
                    label: 'Date Accessed',
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
            ],
            people: [
                {
                    type: 'author',
                    label: 'Sponsor',
                },
            ],
        },
        book: {
            title: 'Book',
            fields: [
                {
                    value: 'title',
                    label: 'Title',
                    required: true,
                },
                {
                    value: 'collection-title',
                    label: 'Series Title',
                },
                {
                    value: 'collection-number',
                    label: 'Series Number',
                    pattern: '[0-9]+',
                    title: 'One or more numbers, no spaces',
                },
                {
                    value: 'number-of-pages',
                    label: '# of Pages',
                    pattern: '[0-9]+',
                    title: 'One or more numbers, no spaces',
                },
                {
                    value: 'volume',
                    label: 'Volume',
                    pattern: '[0-9]+',
                    title: 'One or more numbers, no spaces',
                },
                {
                    value: 'edition',
                    label: 'Edition',
                    pattern: '[0-9]+',
                    title: 'One or more numbers, no spaces',
                },
                {
                    value: 'publisher',
                    label: 'Publisher',
                    required: true,
                },
                {
                    value: 'publisher-place',
                    label: 'Publisher Location',
                },
                {
                    value: 'issued',
                    label: 'Date',
                    required: true,
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
                {
                    value: 'accessed',
                    label: 'Date Accessed',
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
            ],
            people: [
                {
                    type: 'author',
                    label: 'Author',
                },
                {
                    type: 'editor',
                    label: 'Editor',
                },
                {
                    type: 'collection-editor',
                    label: 'Series Editor',
                },
                {
                    type: 'translator',
                    label: 'Translator',
                },
            ],
        },
        broadcast: {
            title: 'Broadcast',
            fields: [
                {
                    value: 'title',
                    label: 'Title',
                },
                {
                    value: 'container-title',
                    label: 'Program Title',
                    required: true,
                },
                {
                    value: 'number',
                    label: 'Episode Number',
                    pattern: '[0-9]+',
                    title: 'One or more numbers, no spaces',
                },
                {
                    value: 'medium',
                    label: 'Format',
                },
                {
                    value: 'publisher',
                    label: 'Network',
                    required: true,
                },
                {
                    value: 'issued',
                    label: 'Date',
                    required: true,
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
                {
                    value: 'accessed',
                    label: 'Date Accessed',
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
            ],
            people: [
                {
                    type: 'author',
                    label: 'Producer',
                },
                {
                    type: 'director',
                    label: 'Director',
                },
            ],
        },
        chapter: {
            title: 'Book Section',
            fields: [
                {
                    value: 'title',
                    label: 'Section Title',
                    required: true,
                },
                {
                    value: 'container-title',
                    label: 'Book Title',
                    required: true,
                },
                {
                    value: 'chapter-number',
                    label: 'Chapter Number',
                    pattern: '[0-9]+',
                    title: 'One or more numbers, no spaces',
                },
                {
                    value: 'collection-title',
                    label: 'Series',
                },
                {
                    value: 'collection-number',
                    label: 'Series Number',
                    pattern: '[0-9]+',
                    title: 'One or more numbers, no spaces',
                },
                {
                    value: 'volume',
                    label: 'Volume',
                    pattern: '[0-9]+',
                    title: 'One or more numbers, no spaces',
                },
                {
                    value: 'number-of-volumes',
                    label: '# of Volumes',
                    pattern: '[0-9]+',
                    title: 'One or more numbers, no spaces',
                },
                {
                    value: 'edition',
                    label: 'Edition',
                    pattern: '[0-9]+',
                    title: 'One or more numbers, no spaces',
                },
                {
                    value: 'publisher',
                    label: 'Publisher',
                    required: true,
                },
                {
                    value: 'publisher-place',
                    label: 'Publisher Location',
                },
                {
                    value: 'page',
                    label: 'Pages',
                    required: true,
                    pattern: '[0-9]+(?:-[0-9]+)?',
                    title: 'Number or Range of Numbers (100-200)',
                },
                {
                    value: 'ISBN',
                    label: 'ISBN',
                },
                {
                    value: 'issued',
                    label: 'Date',
                    required: true,
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
                {
                    value: 'accessed',
                    label: 'Date Accessed',
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
            ],
            people: [
                {
                    type: 'author',
                    label: 'Section Author',
                },
                {
                    type: 'container-author',
                    label: 'Book Author',
                },
                {
                    type: 'editor',
                    label: 'Editor',
                },
                {
                    type: 'collection-editor',
                    label: 'Series Editor',
                },
                {
                    type: 'translator',
                    label: 'Translator',
                },
            ],
        },
        'entry-encyclopedia': {
            title: 'Encyclopedia Entry',
            fields: [
                {
                    value: 'title',
                    label: 'Title',
                    required: true,
                },
                {
                    value: 'container-title',
                    label: 'Encyclopedia Title',
                    required: true,
                },
                {
                    value: 'collection-title',
                    label: 'Series',
                },
                {
                    value: 'collection-number',
                    label: 'Series Number',
                    pattern: '[0-9]+',
                    title: 'One or more numbers, no spaces',
                },
                {
                    value: 'volume',
                    label: 'Volume',
                    pattern: '[0-9]+',
                    title: 'One or more numbers, no spaces',
                },
                {
                    value: 'number-of-volumes',
                    label: '# of Volumes',
                    pattern: '[0-9]+',
                    title: 'One or more numbers, no spaces',
                },
                {
                    value: 'edition',
                    label: 'Edition',
                    pattern: '[0-9]+',
                    title: 'One or more numbers, no spaces',
                },
                {
                    value: 'publisher',
                    label: 'Publisher',
                },
                {
                    value: 'publisher-place',
                    label: 'Publisher Location',
                },
                {
                    value: 'page',
                    label: 'Pages',
                    required: true,
                    pattern: '[0-9]+(?:-[0-9]+)?',
                    title: 'Number or Range of Numbers (100-200)',
                },
                {
                    value: 'issued',
                    label: 'Date',
                    required: true,
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
                {
                    value: 'accessed',
                    label: 'Date Accessed',
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
            ],
            people: [
                {
                    type: 'author',
                    label: 'Author',
                },
                {
                    type: 'editor',
                    label: 'Editor',
                },
                {
                    type: 'collection-editor',
                    label: 'Series Editor',
                },
                {
                    type: 'translator',
                    label: 'Translator',
                },
            ],
        },
        legal_case: {
            title: 'Case',
            fields: [
                {
                    value: 'title',
                    label: 'Case Name',
                    required: true,
                },
                {
                    value: 'authority',
                    label: 'Court',
                    required: true,
                },
                {
                    value: 'number',
                    label: 'Docket Number',
                    pattern: '\\S*',
                    title: 'Any combination of non-whitespace characters',
                },
                {
                    value: 'issued',
                    label: 'Date',
                    required: true,
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
                {
                    value: 'accessed',
                    label: 'Date Accessed',
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
            ],
            people: [
                {
                    type: 'author',
                    label: 'Author',
                },
            ],
        },
        legislation: {
            title: 'Statute',
            fields: [
                {
                    value: 'title',
                    label: 'Title',
                    required: true,
                },
                {
                    value: 'number',
                    label: 'Statute Number',
                    pattern: '[0-9]+',
                    title: 'One or more numbers, no spaces',
                },
                {
                    value: 'section',
                    label: 'Section',
                },
                {
                    value: 'page',
                    label: 'Pages',
                    required: true,
                    pattern: '[0-9]+(?:-[0-9]+)?',
                    title: 'Number or Range of Numbers (100-200)',
                },
                {
                    value: 'issued',
                    label: 'Date',
                    required: true,
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
                {
                    value: 'accessed',
                    label: 'Date Accessed',
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
            ],
            people: [
                {
                    type: 'author',
                    label: 'Author',
                },
            ],
        },
        motion_picture: {
            title: 'Film',
            fields: [
                {
                    value: 'title',
                    label: 'Title',
                    required: true,
                },
                {
                    value: 'publisher',
                    label: 'Distributor',
                },
                {
                    value: 'genre',
                    label: 'Genre',
                },
                {
                    value: 'language',
                    label: 'Language',
                },
                {
                    value: 'medium',
                    label: 'Format',
                },
                {
                    value: 'issued',
                    label: 'Date',
                    required: true,
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
                {
                    value: 'accessed',
                    label: 'Date Accessed',
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
            ],
            people: [
                {
                    type: 'author',
                    label: 'Scriptwriter',
                },
                {
                    type: 'director',
                    label: 'Director',
                },
                {
                    type: 'editor',
                    label: 'Producer',
                },
            ],
        },
        'paper-conference': {
            title: 'Conference Proceeding',
            fields: [
                {
                    value: 'title',
                    label: 'Title',
                    required: true,
                },
                {
                    value: 'event',
                    label: 'Conference Name',
                    required: true,
                },
                {
                    value: 'publisher-place',
                    label: 'Conference Location',
                    required: true,
                },
                {
                    value: 'issued',
                    label: 'Date',
                    required: true,
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
            ],
            people: [
                {
                    type: 'author',
                    label: 'Author',
                },
                {
                    type: 'editor',
                    label: 'Editor',
                },
                {
                    type: 'collection-editor',
                    label: 'Series Editor',
                },
                {
                    type: 'translator',
                    label: 'Translator',
                },
            ],
        },
        patent: {
            title: 'Patent',
            fields: [
                {
                    value: 'title',
                    label: 'Title',
                    required: true,
                },
                {
                    value: 'number',
                    label: 'Number',
                    required: true,
                },
                {
                    value: 'jurisdiction',
                    label: 'Jurisdiction',
                    required: true,
                },
                {
                    value: 'page',
                    label: 'Pages',
                    pattern: '[0-9]+(?:-[0-9]+)?',
                    title: 'Number or Range of Numbers (100-200)',
                },
                {
                    value: 'publisher',
                    label: 'Issuer',
                    required: true,
                },
                {
                    value: 'issued',
                    label: 'Date',
                    required: true,
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
                {
                    value: 'accessed',
                    label: 'Date Accessed',
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
            ],
            people: [
                {
                    type: 'author',
                    label: 'Inventor',
                },
            ],
        },
        report: {
            title: 'Report',
            fields: [
                {
                    value: 'title',
                    label: 'Title',
                    required: true,
                },
                {
                    value: 'number',
                    label: 'Number',
                    pattern: '[0-9]+',
                    title: 'One or more numbers, no spaces',
                },
                {
                    value: 'collection-title',
                    label: 'Series',
                },
                {
                    value: 'container-title',
                    label: 'Publication',
                },
                {
                    value: 'publisher',
                    label: 'Publisher',
                    required: true,
                },
                {
                    value: 'page',
                    label: 'Pages',
                    required: true,
                    pattern: '[0-9]+(?:-[0-9]+)?',
                    title: 'Number or Range of Numbers (100-200)',
                },
                {
                    value: 'URL',
                    label: 'URL',
                },
                {
                    value: 'issued',
                    label: 'Date',
                    required: true,
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
                {
                    value: 'accessed',
                    label: 'Date Accessed',
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
            ],
            people: [
                {
                    type: 'author',
                    label: 'Author',
                },
                {
                    type: 'collection-editor',
                    label: 'Series Editor',
                },
                {
                    type: 'translator',
                    label: 'Translator',
                },
            ],
        },
        speech: {
            title: 'Presentation',
            fields: [
                {
                    value: 'title',
                    label: 'Title',
                    required: true,
                },
                {
                    value: 'event',
                    label: 'Event Name',
                    required: true,
                },
                {
                    value: 'event-place',
                    label: 'Event Location',
                },
                {
                    value: 'language',
                    label: 'Language',
                },
                {
                    value: 'issued',
                    label: 'Date',
                    required: true,
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
            ],
            people: [
                {
                    type: 'author',
                    label: 'Presenter',
                },
            ],
        },
        thesis: {
            title: 'Thesis',
            fields: [
                {
                    value: 'title',
                    label: 'Title',
                    required: true,
                },
                {
                    value: 'number-of-pages',
                    label: '# of Pages',
                    pattern: '[0-9]+',
                    title: 'One or more numbers, no spaces',
                },
                {
                    value: 'publisher',
                    label: 'University',
                    required: true,
                },
                {
                    value: 'publisher-place',
                    label: 'Location',
                },
                {
                    value: 'issued',
                    label: 'Date',
                    required: true,
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
                {
                    value: 'accessed',
                    label: 'Date Accessed',
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
            ],
            people: [
                {
                    type: 'author',
                    label: 'Author',
                },
            ],
        },
        webpage: {
            title: 'Web Page',
            fields: [
                {
                    value: 'title',
                    label: 'Content Title',
                    required: true,
                },
                {
                    value: 'container-title',
                    label: 'Website Title',
                    required: true,
                },
                {
                    value: 'URL',
                    label: 'URL',
                    required: true,
                },
                {
                    value: 'issued',
                    label: 'Date',
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
                {
                    value: 'accessed',
                    label: 'Date Accessed',
                    pattern:
                        '[0-2][0-9]{3}(?:(\\/(?:0[1-9]|1[0-2]))(\\/(?:[0-2][0-9]|3[0-1]))?)?',
                    title: 'YYYY/MM/DD or YYYY/MM or YYYY',
                },
            ],
            people: [
                {
                    type: 'author',
                    label: 'Author',
                },
            ],
        },
    },
    misc: {
        footnotes: 'Footnotes',
        source: 'Source',
    },
    reference_list: {
        menu: {
            style_labels: {
                custom: 'Custom Style',
                predefined: 'Pre-defined Styles',
            },
            toggle_label: 'Toggle menu',
            tooltips: {
                destroy: 'Delete all references',
                help: 'Usage instructions',
                import: 'Import references',
                refresh: 'Refresh reference list',
                static_publist: 'Insert static publication list',
            },
        },
        cited_items: 'Cited Items',
        tooltips: {
            add: 'Add reference',
            insert: 'Insert selected references',
            pin: 'Pin reference list',
            remove: 'Remove selected references',
        },
        uncited_items: 'Uncited Items',
    },
};
