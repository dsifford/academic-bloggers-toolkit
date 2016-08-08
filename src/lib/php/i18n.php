<?php

$ABT_i18n = (object)[
    'referenceList' => [],
    'tinymce' => (object)[],
    'peerReviewMetabox' => [],
    'fieldmaps' => (object)[],
    'citationTypes' => [],
];


$ABT_i18n->referenceList = [
    'referenceList' => [
        'tooltips' => [
            'insert' => __('Insert selected references', 'academic-bloggers-toolkit'),
            'add' => __('Add reference to reference list', 'academic-bloggers-toolkit'),
            'remove' => __('Remove selected references from reference list', 'academic-bloggers-toolkit'),
            'pin' => __('Pin Reference List to Visible Window', 'academic-bloggers-toolkit'),
        ],
        'citedItems' => __('Cited Items', 'academic-bloggers-toolkit'),
        'uncitedItems' => __('Uncited Items', 'academic-bloggers-toolkit'),
    ],
    'menu' => [
        'tooltips' => [
            'import' => __('Import References from RIS File', 'academic-bloggers-toolkit'),
            'refresh' => __('Refresh Reference List', 'academic-bloggers-toolkit'),
            'destroy' => __('Delete All References', 'academic-bloggers-toolkit'),
            'help' => __('View Usage Instructions', 'academic-bloggers-toolkit'),
        ],
        'stylePlaceholder' => __('Choose citation style...', 'academic-bloggers-toolkit'),
    ],
];


$ABT_i18n->tinymce->importWindow = [
    'title' => __('Import References from RIS File', 'academic-bloggers-toolkit'),
    'filetypeError' => __("The file could not be processed. Are you sure it's a .RIS (Refman) file?", 'academic-bloggers-toolkit'),
    'leftovers' => __('The following references were unable to be processed:', 'academic-bloggers-toolkit'),
    'upload' => __('Choose File', 'academic-bloggers-toolkit'),
    'import' => __('Import', 'academic-bloggers-toolkit'),
];


$ABT_i18n->tinymce->pubmedWindow = [
    'pubmedWindowTitle' => __('Search PubMed for Reference', 'academic-bloggers-toolkit'),
    'search' => __('Search', 'academic-bloggers-toolkit'),
    'next' => __('Next', 'academic-bloggers-toolkit'),
    'previous' => __('Previous', 'academic-bloggers-toolkit'),
    'addReference' => __('Add Reference', 'academic-bloggers-toolkit'),
];

$ABT_i18n->tinymce->referenceWindow = [
    'referenceWindow' => [
        'title' => __('Insert Formatted Reference', 'academic-bloggers-toolkit'),
    ],
    'people' => [
        'add' => __('Add another', 'academic-bloggers-toolkit'),
        'surname' => __('Surname', 'academic-bloggers-toolkit'),
        'given' => __('Given Name, M.I.', 'academic-bloggers-toolkit'),
    ],
    'manualEntryContainer' => [
        'type' => __('Select Citation Type', 'academic-bloggers-toolkit'),
    ],
    'identifierInput' => [
        'label' => __('PMID/DOI', 'academic-bloggers-toolkit'),
    ],
    'buttonRow' => [
        'pubmedWindowTitle' => __('Search PubMed for Reference', 'academic-bloggers-toolkit'),
        'addManually' => __('Add Manually', 'academic-bloggers-toolkit'),
        'addWithIdentifier' => __('Add with Identifier', 'academic-bloggers-toolkit'),
        'searchPubmed' => __('Search PubMed', 'academic-bloggers-toolkit'),
        'addReference' => __('Add Reference', 'academic-bloggers-toolkit'),
        'attachInline' => __('Attach Inline', 'academic-bloggers-toolkit'),
    ],
];


$ABT_i18n->peerReviewMetabox = [
    'peerReviewMetabox' => [
        'optionText' => [
            __('Select Number of Reviewers', 'academic-bloggers-toolkit'),
            __('One Reviewer', 'academic-bloggers-toolkit'),
            __('Two Reviewers', 'academic-bloggers-toolkit'),
            __('Three Reviewers', 'academic-bloggers-toolkit'),
        ],
        'review1' => __('Review 1', 'academic-bloggers-toolkit'),
        'review2' => __('Review 2', 'academic-bloggers-toolkit'),
        'review3' => __('Review 3', 'academic-bloggers-toolkit'),
        'mediaButton' => __('Use this image', 'academic-bloggers-toolkit'),
        'mediaTitle' => __('Choose or Upload an Image', 'academic-bloggers-toolkit'),
    ],
    'reviewRow' => [
        'reviewHeading' => __('Review Heading', 'academic-bloggers-toolkit'),
        'toggleResponse' => __('Toggle Author Response', 'academic-bloggers-toolkit'),
    ],
    'commonRowContent' => [
        'name' => __('Name', 'academic-bloggers-toolkit'),
        'twitter' => __('Twitter Handle', 'academic-bloggers-toolkit'),
        'background' => __('Background', 'academic-bloggers-toolkit'),
        'content' => __('Content', 'academic-bloggers-toolkit'),
        'photo' => __('Photo', 'academic-bloggers-toolkit'),
        'imageButton' => __('Choose or Upload an Image', 'academic-bloggers-toolkit'),
    ],
];


require_once(dirname(__FILE__) . '/fieldmaps.php');
