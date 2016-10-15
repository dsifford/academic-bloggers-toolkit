<?php

function abt_generate_translations() {
    $ABT_i18n = (object)[
        'citationTypes' => [],
        'errors' => [],
        'fieldmaps' => (object)[],
        'referenceList' => [],
        'tinymce' => (object)[],
    ];

    $ABT_i18n->errors = [
        'badRequest' => __('Request not valid', 'academic-bloggers-toolkit'),
        'broken' => __('BROKEN!', 'academic-bloggers-toolkit'),
        'denied' => __('Site denied request', 'academic-bloggers-toolkit'),
        'filetypeError' => __("The file could not be processed. Are you sure it's a .RIS (Refman) file?", 'academic-bloggers-toolkit'),
        'identifiersNotFound' => [
            'all' => __('No identifiers could be found for your request', 'academic-bloggers-toolkit'),
            'some' => __('The following identifiers could not be found', 'academic-bloggers-toolkit'),
        ],
        'networkError' => __('Network Error', 'academic-bloggers-toolkit'),
        'noResults' => __('Your search returned 0 results', 'academic-bloggers-toolkit'),
        'prefix' => __('Error', 'academic-bloggers-toolkit'),
        'risLeftovers' => __('The following references were unable to be processed', 'academic-bloggers-toolkit'),
        'statusError' => __('Request returned a non-200 status code', 'academic-bloggers-toolkit'),
        'warnings' => [
            'warning' => __('Warning', 'academic-bloggers-toolkit'),
            'reason' => __('Reason', 'academic-bloggers-toolkit'),
            'noBib' => [
                'message' => __('Cannot create publication list for currently selected citation style', 'academic-bloggers-toolkit'),
                'reason' => __('Style does not include bibliography', 'academic-bloggers-toolkit'),
            ],
        ],
        'unexpected' => [
            'message' => __('An unexpected error occurred', 'academic-bloggers-toolkit'),
            'reportInstructions' => sprintf(__('Please report this error, including the steps taken to trigger it, here: %s', 'academic-bloggers-toolkit'), "\nhttps://github.com/dsifford/academic-bloggers-toolkit/issues"),
        ],
    ];

    $ABT_i18n->referenceList = [
        'menu' => [
            'tooltips' => [
                'destroy' => __('Delete all references', 'academic-bloggers-toolkit'),
                'help' => __('Usage instructions', 'academic-bloggers-toolkit'),
                'importRIS' => __('Import references from RIS file', 'academic-bloggers-toolkit'),
                'refresh' => __('Refresh reference list', 'academic-bloggers-toolkit'),
                'staticPubList' => __('Insert Static Publication List', 'academic-bloggers-toolkit'),
            ],
        ],
        'referenceList' => [
            'citedItems' => __('Cited Items', 'academic-bloggers-toolkit'),
            'tooltips' => [
                'add' => __('Add reference to reference list', 'academic-bloggers-toolkit'),
                'insert' => __('Insert selected references', 'academic-bloggers-toolkit'),
                'pin' => __('Pin reference list to visible window', 'academic-bloggers-toolkit'),
                'remove' => __('Remove selected references from reference list', 'academic-bloggers-toolkit'),
            ],
            'uncitedItems' => __('Uncited Items', 'academic-bloggers-toolkit'),
        ],
    ];

    $ABT_i18n->tinymce->importWindow = [
        'importBtn' => __('Import', 'academic-bloggers-toolkit'),
        'title' => __('Import References from RIS File', 'academic-bloggers-toolkit'),
        'upload' => __('Choose File', 'academic-bloggers-toolkit'),
    ];

    $ABT_i18n->tinymce->pubmedWindow = [
        'addReference' => __('Select', 'academic-bloggers-toolkit'),
        'next' => __('Next', 'academic-bloggers-toolkit'),
        'previous' => __('Previous', 'academic-bloggers-toolkit'),
        'search' => __('Search', 'academic-bloggers-toolkit'),
        'title' => __('Search PubMed for Reference', 'academic-bloggers-toolkit'),
        'viewReference' => __('View', 'academic-bloggers-toolkit'),
    ];

    $ABT_i18n->tinymce->referenceWindow = [
        'buttonRow' => [
            'addManually' => __('Add Manually', 'academic-bloggers-toolkit'),
            'addReference' => __('Add Reference', 'academic-bloggers-toolkit'),
            'addWithIdentifier' => __('Add with Identifier', 'academic-bloggers-toolkit'),
            'insertInline' => __('Insert citation inline', 'academic-bloggers-toolkit'),
            'pubmedWindowTitle' => __('Search PubMed for Reference', 'academic-bloggers-toolkit'),
            'searchPubmed' => __('Search PubMed', 'academic-bloggers-toolkit'),
        ],
        'identifierInput' => [
            'label' => __('PMID/DOI', 'academic-bloggers-toolkit'),
        ],
        'manualEntryContainer' => [
            'autocite' => __('Autocite', 'academic-bloggers-toolkit'),
            'citationType' => __('Citation Type', 'academic-bloggers-toolkit'),
            'ISBN' => __('ISBN', 'academic-bloggers-toolkit'),
            'search' => __('Search', 'academic-bloggers-toolkit'),
            'URL' => __('URL', 'academic-bloggers-toolkit'),
        ],
        'people' => [
            'add' => __('Add Contributor', 'academic-bloggers-toolkit'),
            'contributors' => __('Contributors', 'academic-bloggers-toolkit'),
            'given' => __('Given Name, M.I.', 'academic-bloggers-toolkit'),
            'surname' => __('Surname', 'academic-bloggers-toolkit'),
        ],
        'referenceWindow' => [
            'title' => __('Add Reference', 'academic-bloggers-toolkit'),
        ],
    ];

    require_once(dirname(__FILE__) . '/fieldmaps.php');

    return $ABT_i18n;
}
