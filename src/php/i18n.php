<?php

namespace ABT\i18n;

defined( 'ABSPATH' ) || exit;

/**
 * Sort function that is used to sort an array of fields by field label.
 *
 * @param mixed $a Field array.
 * @param mixed $b Field array.
 */
function sort_by_label( $a, $b ) {
	$a = strtolower( $a['label'] );
	$b = strtolower( $b['label'] );
	if ( $a === $b ) {
		return 0;
	}
	return ( $a < $b ) ? -1 : 1;
}

/**
 * Function that generates and returns an object of translated strings to be
 * used in javascript.
 */
function generate_translations() {
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
	$citation_types = [
		[
			'label' => __( 'Bill', 'academic-bloggers-toolkit' ),
			'value' => 'bill',
		],
		[
			'label' => __( 'Book', 'academic-bloggers-toolkit' ),
			'value' => 'book',
		],
		[
			'label' => __( 'Book Section', 'academic-bloggers-toolkit' ),
			'value' => 'chapter',
		],
		[
			'label' => __( 'Case', 'academic-bloggers-toolkit' ),
			'value' => 'legal_case',
		],
		[
			'label' => __( 'Conference Proceeding', 'academic-bloggers-toolkit' ),
			'value' => 'paper-conference',
		],
		[
			'label' => __( 'Encyclopedia Entry', 'academic-bloggers-toolkit' ),
			'value' => 'entry-encyclopedia',
		],
		[
			'label' => __( 'Film', 'academic-bloggers-toolkit' ),
			'value' => 'motion_picture',
		],
		[
			'label' => __( 'Generic (Note)', 'academic-bloggers-toolkit' ),
			'value' => 'article',
		],
		[
			'label' => __( 'Hearing', 'academic-bloggers-toolkit' ),
			'value' => 'speech',
		],
		[
			'label' => __( 'Journal Article', 'academic-bloggers-toolkit' ),
			'value' => 'article-journal',
		],
		[
			'label' => __( 'Magazine Article', 'academic-bloggers-toolkit' ),
			'value' => 'article-magazine',
		],
		[
			'label' => __( 'Newspaper Article', 'academic-bloggers-toolkit' ),
			'value' => 'article-newspaper',
		],
		[
			'label' => __( 'Patent', 'academic-bloggers-toolkit' ),
			'value' => 'patent',
		],
		[
			'label' => __( 'Report', 'academic-bloggers-toolkit' ),
			'value' => 'report',
		],
		[
			'label' => __( 'Statute', 'academic-bloggers-toolkit' ),
			'value' => 'legislation',
		],
		[
			'label' => __( 'Thesis', 'academic-bloggers-toolkit' ),
			'value' => 'thesis',
		],
		[
			'label' => __( 'Television Broadcast', 'academic-bloggers-toolkit' ),
			'value' => 'broadcast',
		],
		[
			'label' => __( 'Web Page', 'academic-bloggers-toolkit' ),
			'value' => 'webpage',
		],
	];

	usort( $citation_types, 'ABT\i18n\sort_by_label' );

	$misc = [
		'footnotes' => __( 'Footnotes', 'academic-bloggers-toolkit' ),
		'source'    => __( 'Source', 'academic-bloggers-toolkit' ),
	];

	$errors = [
		'missing_php_features'     => sprintf(
			/* translators: %s: PHP extension names */
			__( 'Your WordPress PHP installation is incomplete. You must have the following PHP extensions enabled to use this feature: %s', 'academic-bloggers-toolkit' ),
			'"dom", "libxml"'
		),
		'bad_request'              => __( 'Request not valid', 'academic-bloggers-toolkit' ),
		'denied'                   => __( 'Site denied request', 'academic-bloggers-toolkit' ),
		'file_extension_error'     => __( 'Invalid file extension. Extension must be .ris, .bib, or .bibtex', 'academic-bloggers-toolkit' ),
		'filetype_error'           => __( 'The selected file could not be processed', 'academic-bloggers-toolkit' ),
		'identifiers_not_found'    => [
			'all'  => __( 'No identifiers could be found for your request', 'academic-bloggers-toolkit' ),
			'some' => __( 'The following identifiers could not be found', 'academic-bloggers-toolkit' ),
		],
		'network_error'            => __( 'Network Error', 'academic-bloggers-toolkit' ),
		'no_results'               => __( 'Your search returned 0 results', 'academic-bloggers-toolkit' ),
		'prefix'                   => __( 'Error', 'academic-bloggers-toolkit' ),
		'ris_leftovers'            => __( 'The following references were unable to be processed', 'academic-bloggers-toolkit' ),
		'status_error'             => __( 'Request returned a non-200 status code', 'academic-bloggers-toolkit' ),
		'warnings'                 => [
			'warning' => __( 'Warning', 'academic-bloggers-toolkit' ),
			'reason'  => __( 'Reason', 'academic-bloggers-toolkit' ),
			'no_bib'  => __( 'No bibliography format exists for your citation type', 'academic-bloggers-toolkit' ),
		],
		'unexpected'               => [
			'message'             => __( 'An unexpected error occurred', 'academic-bloggers-toolkit' ),
			'report_instructions' => sprintf(
				/* translators: %s: url to issue reporting page */
				__( 'Please report this error, including the steps taken to trigger it, here: %s', 'academic-bloggers-toolkit' ),
				"\nhttps://github.com/dsifford/academic-bloggers-toolkit/issues"
			),
		],
		'tinymce_unavailable'      => __( "TinyMCE editor doesn't appear to be available in this scope", 'academic-bloggers-toolkit' ),
		'invalid_predefined_style' => __( 'Invalid predefined style type', 'academic-bloggers-toolkit' ),
	];

	$reference_list = [
		'menu'          => [
			'style_labels' => [
				'custom'     => __( 'Custom Style', 'academic-bloggers-toolkit' ),
				'predefined' => __( 'Pre-defined Styles', 'academic-bloggers-toolkit' ),
			],
			'toggle_label' => __( 'Toggle menu', 'academic-bloggers-toolkit' ),
			'tooltips'     => [
				'destroy'        => __( 'Delete all references', 'academic-bloggers-toolkit' ),
				'help'           => __( 'Usage instructions', 'academic-bloggers-toolkit' ),
				'import'         => __( 'Import references', 'academic-bloggers-toolkit' ),
				'refresh'        => __( 'Refresh reference list', 'academic-bloggers-toolkit' ),
				'static_publist' => __( 'Insert static publication list', 'academic-bloggers-toolkit' ),
			],
		],
		'cited_items'   => __( 'Cited Items', 'academic-bloggers-toolkit' ),
		'tooltips'      => [
			'add'    => __( 'Add reference', 'academic-bloggers-toolkit' ),
			'insert' => __( 'Insert selected references', 'academic-bloggers-toolkit' ),
			'pin'    => __( 'Pin reference list', 'academic-bloggers-toolkit' ),
			'remove' => __( 'Remove selected references', 'academic-bloggers-toolkit' ),
		],
		'uncited_items' => __( 'Uncited Items', 'academic-bloggers-toolkit' ),
	];

	$dialogs = [
		'add'         => [
			'button_row'       => [
				'add_manually'        => __( 'Add Manually', 'academic-bloggers-toolkit' ),
				'add_reference'       => __( 'Add Reference', 'academic-bloggers-toolkit' ),
				'add_with_identifier' => __( 'Add with Identifier', 'academic-bloggers-toolkit' ),
				'insert_inline'       => __( 'Insert citation inline', 'academic-bloggers-toolkit' ),
				'search_pubmed'       => __( 'Search PubMed', 'academic-bloggers-toolkit' ),
			],
			'identifier_input' => [
				'label' => __( 'DOI/PMID/PMCID', 'academic-bloggers-toolkit' ),
			],
			'manual_input'     => [
				'autocite'      => __( 'Autocite', 'academic-bloggers-toolkit' ),
				'citation_type' => __( 'Citation Type', 'academic-bloggers-toolkit' ),
				'ISBN'          => __( 'ISBN', 'academic-bloggers-toolkit' ),
				'search'        => __( 'Search', 'academic-bloggers-toolkit' ),
				'URL'           => __( 'URL', 'academic-bloggers-toolkit' ),
			],
			'contributor_list' => [
				'add'          => __( 'Add contributor', 'academic-bloggers-toolkit' ),
				'contributors' => __( 'Contributors', 'academic-bloggers-toolkit' ),
			],
			'contributor'      => [
				'given'          => __( 'Given Name, M.I.', 'academic-bloggers-toolkit' ),
				'surname'        => __( 'Surname', 'academic-bloggers-toolkit' ),
				'literal'        => __( 'Literal Name', 'academic-bloggers-toolkit' ),
				'remove'         => __( 'Remove contributor', 'academic-bloggers-toolkit' ),
				'toggle_literal' => __( 'Toggle literal name', 'academic-bloggers-toolkit' ),
			],
			'title'            => __( 'Add References', 'academic-bloggers-toolkit' ),
		],
		'close_label' => __( 'Close dialog', 'academic-bloggers-toolkit' ),
		'edit'        => [
			'title'   => __( 'Edit Reference', 'academic-bloggers-toolkit' ),
			'confirm' => __( 'Confirm', 'academic-bloggers-toolkit' ),
		],
		'import'      => [
			'import_button' => __( 'Import', 'academic-bloggers-toolkit' ),
			'title'         => __( 'Import References', 'academic-bloggers-toolkit' ),
			'upload'        => __( 'Choose File', 'academic-bloggers-toolkit' ),
		],
		'pubmed'      => [
			'add_reference'  => __( 'Select', 'academic-bloggers-toolkit' ),
			'next'           => __( 'Next', 'academic-bloggers-toolkit' ),
			'previous'       => __( 'Previous', 'academic-bloggers-toolkit' ),
			'search'         => __( 'Search', 'academic-bloggers-toolkit' ),
			'title'          => __( 'Search PubMed', 'academic-bloggers-toolkit' ),
			'view_reference' => __( 'View', 'academic-bloggers-toolkit' ),
		],
	];

	$options_page = [
		'citation_style_type' => __( 'Citation Style Type', 'academic-bloggers-toolkit' ),
		'predefined'          => __( 'Predefined', 'academic-bloggers-toolkit' ),
		'custom'              => __( 'Custom', 'academic-bloggers-toolkit' ),
		'heading'             => __( 'Heading', 'academic-bloggers-toolkit' ),
		'heading_level'       => __( 'Heading Level', 'academic-bloggers-toolkit' ),
		'fixed'               => __( 'Fixed', 'academic-bloggers-toolkit' ),
		'toggle'              => __( 'Toggle', 'academic-bloggers-toolkit' ),
		'bibliography_style'  => __( 'Bibliography Style', 'academic-bloggers-toolkit' ),
		'link_format'         => [
			'title'                => __( 'Link Format', 'academic-bloggers-toolkit' ),
			'always'               => __( 'Make URLs clickable and always add trailing source link', 'academic-bloggers-toolkit' ),
			'always_full_surround' => __( 'Make entire reference a clickable link to the source URL', 'academic-bloggers-toolkit' ),
			'urls'                 => __( 'Make URLs clickable only', 'academic-bloggers-toolkit' ),
			'never'                => __( 'Never add clickable links', 'academic-bloggers-toolkit' ),
		],
	];

	require_once __DIR__ . '/fieldmaps.php';

	return (object) [
		'citation_types' => $citation_types,
		'dialogs'        => $dialogs,
		'errors'         => $errors,
		'fieldmaps'      => fieldmaps(),
		'misc'           => $misc,
		'reference_list' => $reference_list,
		'options_page'   => $options_page,
	];
}
