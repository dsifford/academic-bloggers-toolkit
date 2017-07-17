<?php

function sort_by_label($a, $b) {
    $a = strtolower($a['label']);
    $b = strtolower($b['label']);
    if ($a == $b) return 0;
    return ($a < $b) ? -1 : 1;
}

$ABT_i18n->citationTypes = [
    [
        'label' => __('Bill', 'academic-bloggers-toolkit'),
        'value' => 'bill',
    ],
    [
        'label' => __('Book', 'academic-bloggers-toolkit'),
        'value' => 'book',
    ],
    [
        'label' => __('Book Section', 'academic-bloggers-toolkit'),
        'value' => 'chapter',
    ],
    [
        'label' => __('Case', 'academic-bloggers-toolkit'),
        'value' => 'legal_case',
    ],
    [
        'label' => __('Conference Proceeding', 'academic-bloggers-toolkit'),
        'value' => 'paper-conference',
    ],
    [
        'label' => __('Encyclopedia Entry', 'academic-bloggers-toolkit'),
        'value' => 'entry-encyclopedia',
    ],
    [
        'label' => __('Film', 'academic-bloggers-toolkit'),
        'value' => 'motion_picture',
    ],
    [
        'label' => __('Generic (Note)', 'academic-bloggers-toolkit'),
        'value' => 'article',
    ],
    [
        'label' => __('Hearing', 'academic-bloggers-toolkit'),
        'value' => 'speech',
    ],
    [
        'label' => __('Journal Article', 'academic-bloggers-toolkit'),
        'value' => 'article-journal',
    ],
    [
        'label' => __('Magazine Article', 'academic-bloggers-toolkit'),
        'value' => 'article-magazine',
    ],
    [
        'label' => __('Newspaper Article', 'academic-bloggers-toolkit'),
        'value' => 'article-newspaper',
    ],
    [
        'label' => __('Patent', 'academic-bloggers-toolkit'),
        'value' => 'patent',
    ],
    [
        'label' => __('Report', 'academic-bloggers-toolkit'),
        'value' => 'report',
    ],
    [
        'label' => __('Statute', 'academic-bloggers-toolkit'),
        'value' => 'legislation',
    ],
    [
        'label' => __('Thesis', 'academic-bloggers-toolkit'),
        'value' => 'thesis',
    ],
    [
        'label' => __('Television Broadcast', 'academic-bloggers-toolkit'),
        'value' => 'broadcast',
    ],
    [
        'label' => __('Web Page', 'academic-bloggers-toolkit'),
        'value' => 'webpage',
    ],
];

usort($ABT_i18n->citationTypes, 'sort_by_label');

/*
Not currently used.
{ label: 'Book - Review', value: 'review-book' },
{ label: 'Dataset', value: 'dataset' },
{ label: 'Entry - Generic', value: 'entry' },
{ label: 'Entry - Dictionary', value: 'entry-dictionary' },
{ label: 'Figure', value: 'figure' },
{ label: 'Graphic', value: 'graphic' },
{ label: 'Interview', value: 'interview' },
{ label: 'Manuscript', value: 'manuscript' },
{ label: 'Map', value: 'map' },
{ label: 'Music - Musical Score', value: 'musical_score' },
{ label: 'Music - Song', value: 'song' },
{ label: 'Pamphlet', value: 'pamphlet' },
{ label: 'Personal Communication', value: 'personal_communication' },
{ label: 'Post', value: 'post' },
{ label: 'Review', value: 'review' },
{ label: 'Treaty', value: 'treaty' },
{ label: 'Website - Blog', value: 'post-weblog' },
 */



$ABT_i18n->fieldmaps->bill = [
    'title' => __('Bill', 'academic-bloggers-toolkit'),
    'fields' => [
        [
            'value' => 'title',
            'label' => __('Title', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'number',
            'label' => __('Bill Number', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '[0-9]+',
            'placeholder' => '',
        ],
        [
            'value' => 'page',
            'label' => __('Code Pages', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '^[0-9]+-?[0-9]*$',
            'placeholder' => __('Number or Range of Numbers (e.g. 100-200)', 'academic-bloggers-toolkit'),
        ],
        [
            'value' => 'volume',
            'label' => __('Code Volume', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '[0-9]+',
            'placeholder' => '',
        ],
        [
            'value' => 'section',
            'label' => __('Section', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'publisher',
            'label' => __('Legislative Body', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'issued',
            'label' => __('Date', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '[0-9]{4}(\/[0-9]{2})?(\/[0-9]{2})?(?!\/)$',
            'placeholder' => __('YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit'),
        ],
        [
            'value' => 'accessed',
            'label' => __('Date Accessed', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '[0-9]{4}(\/[0-9]{2})?(\/[0-9]{2})?(?!\/)$',
            'placeholder' => __('YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit'),
        ],
    ],
    'people' => [
        [
            'type' => 'author',
            'label' => __('Sponsor', 'academic-bloggers-toolkit'),
        ],
    ],
];


$ABT_i18n->fieldmaps->book = [
    'title' => __('Book', 'academic-bloggers-toolkit'),
    'fields' => [
        [
            'value' => 'title',
            'label' => __('Title', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'collection-title',
            'label' => __('Series Title', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'collection-number',
            'label' => __('Series Number', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '[0-9]+',
            'placeholder' => '',
        ],
        [
            'value' => 'number-of-pages',
            'label' => __('# of Pages', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '[0-9]+',
            'placeholder' => '',
        ],
        [
            'value' => 'volume',
            'label' => __('Volume', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '[0-9]+',
            'placeholder' => '',
        ],
        [
            'value' => 'edition',
            'label' => __('Edition', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '[0-9]+',
            'placeholder' => '',
        ],
        [
            'value' => 'publisher',
            'label' => __('Publisher', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'publisher-place',
            'label' => __('Publisher Location', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'issued',
            'label' => __('Date', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '[0-9]{4}(\/[0-9]{2})?(\/[0-9]{2})?(?!\/)$',
            'placeholder' => __('YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit'),
        ],
        [
            'value' => 'accessed',
            'label' => __('Date Accessed', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '[0-9]{4}(\/[0-9]{2})?(\/[0-9]{2})?(?!\/)$',
            'placeholder' => __('YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit'),
        ],
    ],
    'people' => [
        [
            'type' => 'author',
            'label' => __('Author', 'academic-bloggers-toolkit'),
        ],
        [
            'type' => 'editor',
            'label' => __('Editor', 'academic-bloggers-toolkit'),
        ],
        [
            'type' => 'collection-editor',
            'label' => __('Series Editor', 'academic-bloggers-toolkit'),
        ],
        [
            'type' => 'translator',
            'label' => __('Translator', 'academic-bloggers-toolkit'),
        ],
    ],
];


$ABT_i18n->fieldmaps->chapter = [
    'title' => __('Book Section', 'academic-bloggers-toolkit'),
    'fields' => [
        [
            'value' => 'title',
            'label' => __('Section Title', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'container-title',
            'label' => __('Book Title', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'chapter-number',
            'label' => __('Chapter Number', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '[0-9]+',
            'placeholder' => '',
        ],
        [
            'value' => 'collection-title',
            'label' => __('Series', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'collection-number',
            'label' => __('Series Number', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '[0-9]+',
            'placeholder' => '',
        ],
        [
            'value' => 'volume',
            'label' => __('Volume', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'number-of-volumes',
            'label' => __('# of Volumes', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '[0-9]+',
            'placeholder' => '',
        ],
        [
            'value' => 'edition',
            'label' => __('Edition', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '[0-9]+',
            'placeholder' => '',
        ],
        [
            'value' => 'publisher',
            'label' => __('Publisher', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'publisher-place',
            'label' => __('Publisher Location', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'page',
            'label' => __('Pages', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '^[0-9]+-?[0-9]*$',
            'placeholder' => __('Number or Range of Numbers (100-200)', 'academic-bloggers-toolkit'),
        ],
        [
            'value' => 'ISBN',
            'label' => __('ISBN', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'issued',
            'label' => __('Date', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '[0-9]{4}(\/[0-9]{2})?(\/[0-9]{2})?(?!\/)$',
            'placeholder' => __('YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit'),
        ],
        [
            'value' => 'accessed',
            'label' => __('Date Accessed', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '[0-9]{4}(\/[0-9]{2})?(\/[0-9]{2})?(?!\/)$',
            'placeholder' => __('YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit'),
        ],
    ],
    'people' => [
        [
            'type' => 'author',
            'label' => __('Section Author', 'academic-bloggers-toolkit'),
        ],
        [
            'type' => 'container-author',
            'label' => __('Book Author', 'academic-bloggers-toolkit'),
        ],
        [
            'type' => 'editor',
            'label' => __('Editor', 'academic-bloggers-toolkit'),
        ],
        [
            'type' => 'collection-editor',
            'label' => __('Series Editor', 'academic-bloggers-toolkit'),
        ],
        [
            'type' => 'translator',
            'label' => __('Translator', 'academic-bloggers-toolkit'),
        ],
    ],
];


$ABT_i18n->fieldmaps->broadcast = [
    'title' => __('Broadcast', 'academic-bloggers-toolkit'),
    'fields' => [
        [
            'value' => 'title',
            'label' => __('Title', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '.*',
            'placeholder' => __('E.g. "Chapter 1"', 'academic-bloggers-toolkit'),
        ],
        [
            'value' => 'container-title',
            'label' => __('Program Title', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '.*',
            'placeholder' => __('E.g. "House of Cards"', 'academic-bloggers-toolkit'),
        ],
        [
            'value' => 'number',
            'label' => __('Episode Number', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '[0-9]+',
            'placeholder' => '',
        ],
        [
            'value' => 'medium',
            'label' => __('Format', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '.*',
            'placeholder' => __('E.g. "Television"', 'academic-bloggers-toolkit'),
        ],
        [
            'value' => 'publisher',
            'label' => __('Network', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '.*',
            'placeholder' => __('E.g. "Netflix"', 'academic-bloggers-toolkit'),
        ],
        [
            'value' => 'issued',
            'label' => __('Date', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '[0-9]{4}(\/[0-9]{2})?(\/[0-9]{2})?(?!\/)$',
            'placeholder' => __('YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit'),
        ],
        [
            'value' => 'accessed',
            'label' => __('Date Accessed', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '[0-9]{4}(\/[0-9]{2})?(\/[0-9]{2})?(?!\/)$',
            'placeholder' => __('YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit'),
        ],
    ],
    'people' => [
        [
            'type' => 'author',
            'label' => __('Producer', 'academic-bloggers-toolkit'),
        ],
        [
            'type' => 'director',
            'label' => __('Director', 'academic-bloggers-toolkit'),
        ],
    ],
];

$ABT_i18n->fieldmaps->legal_case = [
    'title' => __('Case', 'academic-bloggers-toolkit'),
    'fields' => [
        [
            'value' => 'title',
            'label' => __('Case Name', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'authority',
            'label' => __('Court', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'number',
            'label' => __('Docket Number', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '\S.*',
            'placeholder' => '',
        ],
        [
            'value' => 'issued',
            'label' => __('Date', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '[0-9]{4}(\/[0-9]{2})?(\/[0-9]{2})?(?!\/)$',
            'placeholder' => __('YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit'),
        ],
        [
            'value' => 'accessed',
            'label' => __('Date Accessed', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '[0-9]{4}(\/[0-9]{2})?(\/[0-9]{2})?(?!\/)$',
            'placeholder' => __('YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit'),
        ],
    ],
    'people' => [
        [
            'type' => 'author',
            'label' => __('Author', 'academic-bloggers-toolkit'),
        ],
    ],
];

$ABT_i18n->fieldmaps->{'paper-conference'} = [
    'title' => __('Conference Proceeding', 'academic-bloggers-toolkit'),
    'fields' => [
        [
            'value' => 'title',
            'label' => __('Title', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'event',
            'label' => __('Conference Name', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'publisher-place',
            'label' => __('Conference Location', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'issued',
            'label' => __('Date', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '[0-9]{4}(\/[0-9]{2})?(\/[0-9]{2})?(?!\/)$',
            'placeholder' => __('YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit'),
        ],
    ],
    'people' => [
        [
            'type' => 'author',
            'label' => __('Author', 'academic-bloggers-toolkit'),
        ],
        [
            'type' => 'editor',
            'label' => __('Editor', 'academic-bloggers-toolkit'),
        ],
        [
            'type' => 'collection-editor',
            'label' => __('Series Editor', 'academic-bloggers-toolkit'),
        ],
        [
            'type' => 'translator',
            'label' => __('Translator', 'academic-bloggers-toolkit'),
        ],
    ],
];

$ABT_i18n->fieldmaps->{'entry-encyclopedia'} = [
    'title' => __('Encyclopedia Entry', 'academic-bloggers-toolkit'),
    'fields' => [
        [
            'value' => 'title',
            'label' => __('Title', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'container-title',
            'label' => __('Encyclopedia Title', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'collection-title',
            'label' => __('Series', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'collection-number',
            'label' => __('Series Number', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '[0-9]+',
            'placeholder' => '',
        ],
        [
            'value' => 'volume',
            'label' => __('Volume', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '[0-9]+',
            'placeholder' => '',
        ],
        [
            'value' => 'number-of-volumes',
            'label' => __('# of Volumes', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '[0-9]+',
            'placeholder' => '',
        ],
        [
            'value' => 'edition',
            'label' => __('Edition', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '[0-9]+',
            'placeholder' => '',
        ],
        [
            'value' => 'publisher',
            'label' => __('Publisher', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'publisher-place',
            'label' => __('Publisher Location', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'page',
            'label' => __('Pages', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '^[0-9]+-?[0-9]*$',
            'placeholder' => __('Number or Range of Numbers (100-200)', 'academic-bloggers-toolkit'),
        ],
        [
            'value' => 'issued',
            'label' => __('Date', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '[0-9]{4}(\/[0-9]{2})?(\/[0-9]{2})?(?!\/)$',
            'placeholder' => __('YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit'),
        ],
        [
            'value' => 'accessed',
            'label' => __('Date Accessed', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '[0-9]{4}(\/[0-9]{2})?(\/[0-9]{2})?(?!\/)$',
            'placeholder' => __('YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit'),
        ],
    ],
    'people' => [
        [
            'type' => 'author',
            'label' => __('Author', 'academic-bloggers-toolkit'),
        ],
        [
            'type' => 'editor',
            'label' => __('Editor', 'academic-bloggers-toolkit'),
        ],
        [
            'type' => 'collection-editor',
            'label' => __('Series Editor', 'academic-bloggers-toolkit'),
        ],
        [
            'type' => 'translator',
            'label' => __('Translator', 'academic-bloggers-toolkit'),
        ],
    ],
];

$ABT_i18n->fieldmaps->motion_picture = [
    'title' => __('Film', 'academic-bloggers-toolkit'),
    'fields' => [
        [
            'value' => 'title',
            'label' => __('Title', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'publisher',
            'label' => __('Distributor', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'genre',
            'label' => __('Genre', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'language',
            'label' => __('Language', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'medium',
            'label' => __('Format', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'issued',
            'label' => __('Date', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '[0-9]{4}(\/[0-9]{2})?(\/[0-9]{2})?(?!\/)$',
            'placeholder' => __('YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit'),
        ],
        [
            'value' => 'accessed',
            'label' => __('Date Accessed', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '[0-9]{4}(\/[0-9]{2})?(\/[0-9]{2})?(?!\/)$',
            'placeholder' => __('YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit'),
        ],
    ],
    'people' => [
        [
            'type' => 'author',
            'label' => __('Scriptwriter', 'academic-bloggers-toolkit'),
        ],
        [
            'type' => 'director',
            'label' => __('Director', 'academic-bloggers-toolkit'),
        ],
        [
            'type' => 'editor',
            'label' => __('Producer', 'academic-bloggers-toolkit'),
        ],
    ],
];

$ABT_i18n->fieldmaps->article = [
    'title' => __('Generic (Note)', 'academic-bloggers-toolkit'),
    'fields' => [
        [
            'value' => 'title',
            'label' => __('Text', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '.*',
            'placeholder' => __('Note: This type may not work with certain citation styles', 'academic-bloggers-toolkit'),
        ],
    ],
    'people' => [],
];

$ABT_i18n->fieldmaps->speech = [
    'title' => __('Presentation', 'academic-bloggers-toolkit'),
    'fields' => [
        [
            'value' => 'title',
            'label' => __('Title', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'event',
            'label' => __('Event Name', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'event-place',
            'label' => __('Event Location', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'language',
            'label' => __('Language', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'issued',
            'label' => __('Date', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '[0-9]{4}(\/[0-9]{2})?(\/[0-9]{2})?(?!\/)$',
            'placeholder' => __('YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit'),
        ],
    ],
    'people' => [
        [
            'type' => 'author',
            'label' => __('Presenter', 'academic-bloggers-toolkit'),
        ],
    ],
];

$ABT_i18n->fieldmaps->{'article-journal'} = [
    'title' => __('Journal Article', 'academic-bloggers-toolkit'),
    'fields' => [
        [
            'value' => 'title',
            'label' => __('Title', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'container-title',
            'label' => __('Journal', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'journalAbbreviation',
            'label' => __('Journal Abbreviation', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'volume',
            'label' => __('Volume', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '[0-9]+',
            'placeholder' => '',
        ],
        [
            'value' => 'issue',
            'label' => __('Issue', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '[0-9]+',
            'placeholder' => '',
        ],
        [
            'value' => 'page',
            'label' => __('Pages', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '^[0-9]+-?[0-9]*$',
            'placeholder' => __('Number or Range of Numbers (100-200)', 'academic-bloggers-toolkit'),
        ],
        [
            'value' => 'DOI',
            'label' => __('DOI', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'URL',
            'label' => __('URL', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'issued',
            'label' => __('Date', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '[0-9]{4}(\/[0-9]{2})?(\/[0-9]{2})?(?!\/)$',
            'placeholder' => __('YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit'),
        ],
    ],
    'people' => [
        [
            'type' => 'author',
            'label' => __('Author', 'academic-bloggers-toolkit'),
        ],
        [
            'type' => 'editor',
            'label' => __('Editor', 'academic-bloggers-toolkit'),
        ],
    ],
];

$ABT_i18n->fieldmaps->{'article-magazine'} = [
    'title' => __('Magazine Article', 'academic-bloggers-toolkit'),
    'fields' => [
        [
            'value' => 'title',
            'label' => __('Title', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'container-title',
            'label' => __('Magazine', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'volume',
            'label' => __('Volume', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'page',
            'label' => __('Pages', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '^[0-9]+-?[0-9]*$',
            'placeholder' => __('Number or Range of Numbers (100-200)', 'academic-bloggers-toolkit'),
        ],
        [
            'value' => 'issue',
            'label' => __('Issue', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'ISSN',
            'label' => __('ISSN', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'URL',
            'label' => __('URL', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'issued',
            'label' => __('Date', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '[0-9]{4}(\/[0-9]{2})?(\/[0-9]{2})?(?!\/)$',
            'placeholder' => __('YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit'),
        ],
        [
            'value' => 'accessed',
            'label' => __('Date Accessed', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '[0-9]{4}(\/[0-9]{2})?(\/[0-9]{2})?(?!\/)$',
            'placeholder' => __('YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit'),
        ],
    ],
    'people' => [
        [
            'type' => 'author',
            'label' => __('Author', 'academic-bloggers-toolkit'),
        ],
        [
            'type' => 'editor',
            'label' => __('Editor', 'academic-bloggers-toolkit'),
        ],
    ],
];

$ABT_i18n->fieldmaps->{'article-newspaper'} = [
    'title' => __('Newspaper Article', 'academic-bloggers-toolkit'),
    'fields' => [
        [
            'value' => 'title',
            'label' => __('Title', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'container-title',
            'label' => __('Publication', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'section',
            'label' => __('Section', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '.*',
            'placeholder' => __('E.g. "Sports", "Politics"', 'academic-bloggers-toolkit'),
        ],
        [
            'value' => 'page',
            'label' => __('Pages', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '^[0-9]+-?[0-9]*$',
            'placeholder' => __('Number or Range of Numbers (100-200)', 'academic-bloggers-toolkit'),
        ],
        [
            'value' => 'issue',
            'label' => __('Issue', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'URL',
            'label' => __('URL', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'issued',
            'label' => __('Date', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '[0-9]{4}(\/[0-9]{2})?(\/[0-9]{2})?(?!\/)$',
            'placeholder' => __('YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit'),
        ],
        [
            'value' => 'accessed',
            'label' => __('Date Accessed', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '[0-9]{4}(\/[0-9]{2})?(\/[0-9]{2})?(?!\/)$',
            'placeholder' => __('YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit'),
        ],
    ],
    'people' => [
        [
            'type' => 'author',
            'label' => __('Author', 'academic-bloggers-toolkit'),
        ],
        [
            'type' => 'editor',
            'label' => __('Editor', 'academic-bloggers-toolkit'),
        ],
    ],
];

$ABT_i18n->fieldmaps->patent = [
    'title' => __('Patent', 'academic-bloggers-toolkit'),
    'fields' => [
        [
            'value' => 'title',
            'label' => __('Title', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'number',
            'label' => __('Number', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '[0-9]+',
            'placeholder' => '',
        ],
        [
            'value' => 'jurisdiction',
            'label' => __('Jurisdiction', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '.*',
            'placeholder' => __('E.g. "United States"', 'academic-bloggers-toolkit'),
        ],
        [
            'value' => 'page',
            'label' => __('Pages', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '^[0-9]+-?[0-9]*$',
            'placeholder' => __('Number or Range of Numbers (100-200)', 'academic-bloggers-toolkit'),
        ],
        [
            'value' => 'publisher',
            'label' => __('Issuer', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'issued',
            'label' => __('Date', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '[0-9]{4}(\/[0-9]{2})?(\/[0-9]{2})?(?!\/)$',
            'placeholder' => __('YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit'),
        ],
        [
            'value' => 'accessed',
            'label' => __('Date Accessed', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '[0-9]{4}(\/[0-9]{2})?(\/[0-9]{2})?(?!\/)$',
            'placeholder' => __('YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit'),
        ],
    ],
    'people' => [
        [
            'type' => 'author',
            'label' => __('Inventor', 'academic-bloggers-toolkit'),
        ],
    ],
];

$ABT_i18n->fieldmaps->report = [
    'title' => __('Report', 'academic-bloggers-toolkit'),
    'fields' => [
        [
            'value' => 'title',
            'label' => __('Title', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'number',
            'label' => __('Number', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '[0-9]+',
            'placeholder' => '',
        ],
        [
            'value' => 'collection-title',
            'label' => __('Series', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'container-title',
            'label' => __('Publication', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'publisher',
            'label' => __('Publisher', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'page',
            'label' => __('Pages', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '^[0-9]+-?[0-9]*$',
            'placeholder' => __('Number or Range of Numbers (100-200)', 'academic-bloggers-toolkit'),
        ],
        [
            'value' => 'URL',
            'label' => __('URL', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'issued',
            'label' => __('Date', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '[0-9]{4}(\/[0-9]{2})?(\/[0-9]{2})?(?!\/)$',
            'placeholder' => __('YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit'),
        ],
        [
            'value' => 'accessed',
            'label' => __('Date Accessed', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '[0-9]{4}(\/[0-9]{2})?(\/[0-9]{2})?(?!\/)$',
            'placeholder' => __('YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit'),
        ],
    ],
    'people' => [
        [
            'type' => 'author',
            'label' => __('Author', 'academic-bloggers-toolkit'),
        ],
        [
            'type' => 'collection-editor',
            'label' => __('Series Editor', 'academic-bloggers-toolkit'),
        ],
        [
            'type' => 'translator',
            'label' => __('Translator', 'academic-bloggers-toolkit'),
        ],
    ],
];

$ABT_i18n->fieldmaps->legislation = [
    'title' => __('Statute', 'academic-bloggers-toolkit'),
    'fields' => [
        [
            'value' => 'title',
            'label' => __('Title', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'number',
            'label' => __('Statute Number', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '[0-9]+',
            'placeholder' => '',
        ],
        [
            'value' => 'section',
            'label' => __('Section', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'page',
            'label' => __('Pages', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '^[0-9]+-?[0-9]*$',
            'placeholder' => __('Number or Range of Numbers (100-200)', 'academic-bloggers-toolkit'),
        ],
        [
            'value' => 'issued',
            'label' => __('Date', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '[0-9]{4}(\/[0-9]{2})?(\/[0-9]{2})?(?!\/)$',
            'placeholder' => __('YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit'),
        ],
        [
            'value' => 'accessed',
            'label' => __('Date Accessed', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '[0-9]{4}(\/[0-9]{2})?(\/[0-9]{2})?(?!\/)$',
            'placeholder' => __('YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit'),
        ],
    ],
    'people' => [
        [
            'type' => 'author',
            'label' => __('Author', 'academic-bloggers-toolkit'),
        ],
    ],
];

$ABT_i18n->fieldmaps->thesis = [
    'title' => __('Thesis', 'academic-bloggers-toolkit'),
    'fields' => [
        [
            'value' => 'title',
            'label' => __('Title', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'number-of-pages',
            'label' => __('# of Pages', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '[0-9]+',
            'placeholder' => '',
        ],
        [
            'value' => 'publisher',
            'label' => __('University', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'publisher-place',
            'label' => __('Location', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'issued',
            'label' => __('Date', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '[0-9]{4}(\/[0-9]{2})?(\/[0-9]{2})?(?!\/)$',
            'placeholder' => __('YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit'),
        ],
        [
            'value' => 'accessed',
            'label' => __('Date Accessed', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '[0-9]{4}(\/[0-9]{2})?(\/[0-9]{2})?(?!\/)$',
            'placeholder' => __('YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit'),
        ],
    ],
    'people' => [
        [
            'type' => 'author',
            'label' => __('Author', 'academic-bloggers-toolkit'),
        ],
    ],
];

$ABT_i18n->fieldmaps->webpage = [
    'title' => __('Web Page', 'academic-bloggers-toolkit'),
    'fields' => [
        [
            'value' => 'title',
            'label' => __('Content Title', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'container-title',
            'label' => __('Website Title', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'URL',
            'label' => __('URL', 'academic-bloggers-toolkit'),
            'required' => true,
            'pattern' => '.*',
            'placeholder' => '',
        ],
        [
            'value' => 'issued',
            'label' => __('Date', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '[0-9]{4}(\/[0-9]{2})?(\/[0-9]{2})?(?!\/)$',
            'placeholder' => __('YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit'),
        ],
        [
            'value' => 'accessed',
            'label' => __('Date Accessed', 'academic-bloggers-toolkit'),
            'required' => false,
            'pattern' => '[0-9]{4}(\/[0-9]{2})?(\/[0-9]{2})?(?!\/)$',
            'placeholder' => __('YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit'),
        ],
    ],
    'people' => [
        [
            'type' => 'author',
            'label' => __('Author', 'academic-bloggers-toolkit'),
        ],
    ],
];
