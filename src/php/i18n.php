<?php

namespace ABT\i18n;

defined('ABSPATH') || exit;

/**
 * Function that generates and returns an object of translated strings to be
 * used in javascript.
 */
function generate_translations() {
    $ABT_i18n = (object) [
        'citationTypes' => [],
        'dialogs' => (object) [],
        'errors' => [],
        'fieldmaps' => (object) [],
        'misc' => [],
        'referenceList' => [],
    ];

    $ABT_i18n->misc = [
        'footnotes' => __('Footnotes', 'academic-bloggers-toolkit'),
    ];

    $ABT_i18n->errors = [
        'missingPhpFeatures' => sprintf(__('Your WordPress PHP installation is incomplete. You must have the following PHP extensions enabled to use this feature: %s', 'academic-bloggers-toolkit'), '"dom", "libxml"'),
        'badRequest' => __('Request not valid', 'academic-bloggers-toolkit'),
        'denied' => __('Site denied request', 'academic-bloggers-toolkit'),
        'fileExtensionError' => __('Invalid file extension. Extension must be .ris, .bib, or .bibtex', 'academic-bloggers-toolkit'),
        'filetypeError' => __('The selected file could not be processed', 'academic-bloggers-toolkit'),
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
            'noBib' => __('No bibliography format exists for your citation type', 'academic-bloggers-toolkit'),
        ],
        'unexpected' => [
            'message' => __('An unexpected error occurred', 'academic-bloggers-toolkit'),
            'reportInstructions' => sprintf(__('Please report this error, including the steps taken to trigger it, here: %s', 'academic-bloggers-toolkit'), "\nhttps://github.com/dsifford/academic-bloggers-toolkit/issues"),
        ],
    ];

    $ABT_i18n->referenceList = [
        'menu' => [
            'styleLabels' => [
                'custom' => __('Custom Style', 'academic-bloggers-toolkit'),
                'predefined' => __('Pre-defined Styles', 'academic-bloggers-toolkit'),
            ],
            'toggleLabel' => __('Toggle menu', 'academic-bloggers-toolkit'),
            'tooltips' => [
                'destroy' => __('Delete all references', 'academic-bloggers-toolkit'),
                'help' => __('Usage instructions', 'academic-bloggers-toolkit'),
                'importRIS' => __('Import references', 'academic-bloggers-toolkit'),
                'refresh' => __('Refresh reference list', 'academic-bloggers-toolkit'),
                'staticPubList' => __('Insert static publication list', 'academic-bloggers-toolkit'),
            ],
        ],
        'citedItems' => __('Cited Items', 'academic-bloggers-toolkit'),
        'tooltips' => [
            'add' => __('Add reference', 'academic-bloggers-toolkit'),
            'insert' => __('Insert selected references', 'academic-bloggers-toolkit'),
            'pin' => __('Pin reference list', 'academic-bloggers-toolkit'),
            'remove' => __('Remove selected references', 'academic-bloggers-toolkit'),
        ],
        'uncitedItems' => __('Uncited Items', 'academic-bloggers-toolkit'),
    ];

    $ABT_i18n->dialogs->closeLabel = __('Close dialog', 'academic-bloggers-toolkit');

    $ABT_i18n->dialogs->edit = [
        'title' => __('Edit Reference', 'academic-bloggers-toolkit'),
        'confirm' => __('Confirm', 'academic-bloggers-toolkit'),
    ];

    $ABT_i18n->dialogs->import = [
        'importBtn' => __('Import', 'academic-bloggers-toolkit'),
        'title' => __('Import References', 'academic-bloggers-toolkit'),
        'upload' => __('Choose File', 'academic-bloggers-toolkit'),
    ];

    $ABT_i18n->dialogs->pubmed = [
        'addReference' => __('Select', 'academic-bloggers-toolkit'),
        'next' => __('Next', 'academic-bloggers-toolkit'),
        'previous' => __('Previous', 'academic-bloggers-toolkit'),
        'search' => __('Search', 'academic-bloggers-toolkit'),
        'title' => __('Search PubMed', 'academic-bloggers-toolkit'),
        'viewReference' => __('View', 'academic-bloggers-toolkit'),
    ];

    $ABT_i18n->dialogs->add = [
        'buttonRow' => [
            'addManually' => __('Add Manually', 'academic-bloggers-toolkit'),
            'addReference' => __('Add Reference', 'academic-bloggers-toolkit'),
            'addWithIdentifier' => __('Add with Identifier', 'academic-bloggers-toolkit'),
            'insertInline' => __('Insert citation inline', 'academic-bloggers-toolkit'),
            'searchPubmed' => __('Search PubMed', 'academic-bloggers-toolkit'),
        ],
        'identifierInput' => [
            'label' => __('DOI/PMID/PMCID', 'academic-bloggers-toolkit'),
        ],
        'manualEntryContainer' => [
            'autocite' => __('Autocite', 'academic-bloggers-toolkit'),
            'citationType' => __('Citation Type', 'academic-bloggers-toolkit'),
            'ISBN' => __('ISBN', 'academic-bloggers-toolkit'),
            'search' => __('Search', 'academic-bloggers-toolkit'),
            'URL' => __('URL', 'academic-bloggers-toolkit'),
        ],
        'contributorList' => [
            'add' => __('Add contributor', 'academic-bloggers-toolkit'),
            'contributors' => __('Contributors', 'academic-bloggers-toolkit'),
        ],
        'contributor' => [
            'given' => __('Given Name, M.I.', 'academic-bloggers-toolkit'),
            'surname' => __('Surname', 'academic-bloggers-toolkit'),
            'literal' => __('Literal Name', 'academic-bloggers-toolkit'),
            'remove' => __('Remove contributor', 'academic-bloggers-toolkit'),
            'toggleLiteral' => __('Toggle literal name', 'academic-bloggers-toolkit'),
        ],
        'title' => __('Add References', 'academic-bloggers-toolkit'),
    ];

    require_once __DIR__ . '/fieldmaps.php';

    return $ABT_i18n;
}
