<?php

namespace ABT\i18n;

defined( 'ABSPATH' ) || exit;

function fieldmaps() {
	$patterns = (object) [
		'non_whitespace' => '\S*',
		'numeric'        => '[0-9]+',
		'date'           => '[0-2][0-9]{3}(?:(\/(?:0[1-9]|1[0-2]))(\/(?:[0-2][0-9]|3[0-1]))?)?',
	];

	$bill = [
		'title'  => __( 'Bill', 'academic-bloggers-toolkit' ),
		'fields' => [
			[
				'value'    => 'title',
				'label'    => __( 'Title', 'academic-bloggers-toolkit' ),
				'required' => true,
			],
			[
				'value' => 'number',
				'label' => __( 'Bill Number', 'academic-bloggers-toolkit' ),
			],
			[
				'value' => 'page',
				'label' => __( 'Code Pages', 'academic-bloggers-toolkit' ),
			],
			[
				'value'   => 'volume',
				'label'   => __( 'Code Volume', 'academic-bloggers-toolkit' ),
				'pattern' => $patterns->numeric,
				'title'   => __( 'One or more numbers, no spaces', 'academic-bloggers-toolkit' ),
			],
			[
				'value' => 'section',
				'label' => __( 'Section', 'academic-bloggers-toolkit' ),
			],
			[
				'value' => 'publisher',
				'label' => __( 'Legislative Body', 'academic-bloggers-toolkit' ),
			],
			[
				'value'    => 'issued',
				'label'    => __( 'Date', 'academic-bloggers-toolkit' ),
				'required' => true,
				'pattern'  => $patterns->date,
				'title'    => __( 'YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit' ),
			],
			[
				'value'   => 'accessed',
				'label'   => __( 'Date Accessed', 'academic-bloggers-toolkit' ),
				'pattern' => $patterns->date,
				'title'   => __( 'YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit' ),
			],
		],
		'people' => [
			[
				'type'  => 'author',
				'label' => __( 'Sponsor', 'academic-bloggers-toolkit' ),
			],
		],
	];

	$book = [
		'title'  => __( 'Book', 'academic-bloggers-toolkit' ),
		'fields' => [
			[
				'value'    => 'title',
				'label'    => __( 'Title', 'academic-bloggers-toolkit' ),
				'required' => true,
			],
			[
				'value' => 'collection-title',
				'label' => __( 'Series Title', 'academic-bloggers-toolkit' ),
			],
			[
				'value'   => 'collection-number',
				'label'   => __( 'Series Number', 'academic-bloggers-toolkit' ),
				'pattern' => $patterns->numeric,
				'title'   => __( 'One or more numbers, no spaces', 'academic-bloggers-toolkit' ),
			],
			[
				'value'   => 'number-of-pages',
				'label'   => __( '# of Pages', 'academic-bloggers-toolkit' ),
				'pattern' => $patterns->numeric,
				'title'   => __( 'One or more numbers, no spaces', 'academic-bloggers-toolkit' ),
			],
			[
				'value'   => 'volume',
				'label'   => __( 'Volume', 'academic-bloggers-toolkit' ),
				'pattern' => $patterns->numeric,
				'title'   => __( 'One or more numbers, no spaces', 'academic-bloggers-toolkit' ),
			],
			[
				'value'   => 'edition',
				'label'   => __( 'Edition', 'academic-bloggers-toolkit' ),
				'pattern' => $patterns->numeric,
				'title'   => __( 'One or more numbers, no spaces', 'academic-bloggers-toolkit' ),
			],
			[
				'value'    => 'publisher',
				'label'    => __( 'Publisher', 'academic-bloggers-toolkit' ),
				'required' => true,
			],
			[
				'value' => 'publisher-place',
				'label' => __( 'Publisher Location', 'academic-bloggers-toolkit' ),
			],
			[
				'value'    => 'issued',
				'label'    => __( 'Date', 'academic-bloggers-toolkit' ),
				'required' => true,
				'pattern'  => $patterns->date,
				'title'    => __( 'YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit' ),
			],
			[
				'value'   => 'accessed',
				'label'   => __( 'Date Accessed', 'academic-bloggers-toolkit' ),
				'pattern' => $patterns->date,
				'title'   => __( 'YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit' ),
			],
		],
		'people' => [
			[
				'type'  => 'author',
				'label' => __( 'Author', 'academic-bloggers-toolkit' ),
			],
			[
				'type'  => 'editor',
				'label' => __( 'Editor', 'academic-bloggers-toolkit' ),
			],
			[
				'type'  => 'collection-editor',
				'label' => __( 'Series Editor', 'academic-bloggers-toolkit' ),
			],
			[
				'type'  => 'translator',
				'label' => __( 'Translator', 'academic-bloggers-toolkit' ),
			],
		],
	];

	$chapter = [
		'title'  => __( 'Book Section', 'academic-bloggers-toolkit' ),
		'fields' => [
			[
				'value'    => 'title',
				'label'    => __( 'Section Title', 'academic-bloggers-toolkit' ),
				'required' => true,
			],
			[
				'value'    => 'container-title',
				'label'    => __( 'Book Title', 'academic-bloggers-toolkit' ),
				'required' => true,
			],
			[
				'value'   => 'chapter-number',
				'label'   => __( 'Chapter Number', 'academic-bloggers-toolkit' ),
				'pattern' => $patterns->numeric,
				'title'   => __( 'One or more numbers, no spaces', 'academic-bloggers-toolkit' ),
			],
			[
				'value' => 'collection-title',
				'label' => __( 'Series', 'academic-bloggers-toolkit' ),
			],
			[
				'value'   => 'collection-number',
				'label'   => __( 'Series Number', 'academic-bloggers-toolkit' ),
				'pattern' => $patterns->numeric,
				'title'   => __( 'One or more numbers, no spaces', 'academic-bloggers-toolkit' ),
			],
			[
				'value'   => 'volume',
				'label'   => __( 'Volume', 'academic-bloggers-toolkit' ),
				'pattern' => $patterns->numeric,
				'title'   => __( 'One or more numbers, no spaces', 'academic-bloggers-toolkit' ),
			],
			[
				'value'   => 'number-of-volumes',
				'label'   => __( '# of Volumes', 'academic-bloggers-toolkit' ),
				'pattern' => $patterns->numeric,
				'title'   => __( 'One or more numbers, no spaces', 'academic-bloggers-toolkit' ),
			],
			[
				'value'   => 'edition',
				'label'   => __( 'Edition', 'academic-bloggers-toolkit' ),
				'pattern' => $patterns->numeric,
				'title'   => __( 'One or more numbers, no spaces', 'academic-bloggers-toolkit' ),
			],
			[
				'value'    => 'publisher',
				'label'    => __( 'Publisher', 'academic-bloggers-toolkit' ),
				'required' => true,
			],
			[
				'value' => 'publisher-place',
				'label' => __( 'Publisher Location', 'academic-bloggers-toolkit' ),
			],
			[
				'value'    => 'page',
				'label'    => __( 'Pages', 'academic-bloggers-toolkit' ),
				'required' => true,
			],
			[
				'value' => 'ISBN',
				'label' => __( 'ISBN', 'academic-bloggers-toolkit' ),
			],
			[
				'value'    => 'issued',
				'label'    => __( 'Date', 'academic-bloggers-toolkit' ),
				'required' => true,
				'pattern'  => $patterns->date,
				'title'    => __( 'YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit' ),
			],
			[
				'value'   => 'accessed',
				'label'   => __( 'Date Accessed', 'academic-bloggers-toolkit' ),
				'pattern' => $patterns->date,
				'title'   => __( 'YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit' ),
			],
		],
		'people' => [
			[
				'type'  => 'author',
				'label' => __( 'Section Author', 'academic-bloggers-toolkit' ),
			],
			[
				'type'  => 'container-author',
				'label' => __( 'Book Author', 'academic-bloggers-toolkit' ),
			],
			[
				'type'  => 'editor',
				'label' => __( 'Editor', 'academic-bloggers-toolkit' ),
			],
			[
				'type'  => 'collection-editor',
				'label' => __( 'Series Editor', 'academic-bloggers-toolkit' ),
			],
			[
				'type'  => 'translator',
				'label' => __( 'Translator', 'academic-bloggers-toolkit' ),
			],
		],
	];

	$broadcast = [
		'title'  => __( 'Broadcast', 'academic-bloggers-toolkit' ),
		'fields' => [
			[
				'value' => 'title',
				'label' => __( 'Title', 'academic-bloggers-toolkit' ),
			],
			[
				'value'    => 'container-title',
				'label'    => __( 'Program Title', 'academic-bloggers-toolkit' ),
				'required' => true,
			],
			[
				'value'   => 'number',
				'label'   => __( 'Episode Number', 'academic-bloggers-toolkit' ),
				'pattern' => $patterns->numeric,
				'title'   => __( 'One or more numbers, no spaces', 'academic-bloggers-toolkit' ),
			],
			[
				'value' => 'medium',
				'label' => __( 'Format', 'academic-bloggers-toolkit' ),
			],
			[
				'value'    => 'publisher',
				'label'    => __( 'Network', 'academic-bloggers-toolkit' ),
				'required' => true,
			],
			[
				'value'    => 'issued',
				'label'    => __( 'Date', 'academic-bloggers-toolkit' ),
				'required' => true,
				'pattern'  => $patterns->date,
				'title'    => __( 'YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit' ),
			],
			[
				'value'   => 'accessed',
				'label'   => __( 'Date Accessed', 'academic-bloggers-toolkit' ),
				'pattern' => $patterns->date,
				'title'   => __( 'YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit' ),
			],
		],
		'people' => [
			[
				'type'  => 'author',
				'label' => __( 'Producer', 'academic-bloggers-toolkit' ),
			],
			[
				'type'  => 'director',
				'label' => __( 'Director', 'academic-bloggers-toolkit' ),
			],
		],
	];

	$legal_case = [
		'title'  => __( 'Case', 'academic-bloggers-toolkit' ),
		'fields' => [
			[
				'value'    => 'title',
				'label'    => __( 'Case Name', 'academic-bloggers-toolkit' ),
				'required' => true,
			],
			[
				'value'    => 'authority',
				'label'    => __( 'Court', 'academic-bloggers-toolkit' ),
				'required' => true,
			],
			[
				'value'   => 'number',
				'label'   => __( 'Docket Number', 'academic-bloggers-toolkit' ),
				'pattern' => $patterns->non_whitespace,
				'title'   => __( 'Any combination of non-whitespace characters', 'academic-bloggers-toolkit' ),
			],
			[
				'value'    => 'issued',
				'label'    => __( 'Date', 'academic-bloggers-toolkit' ),
				'required' => true,
				'pattern'  => $patterns->date,
				'title'    => __( 'YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit' ),
			],
			[
				'value'   => 'accessed',
				'label'   => __( 'Date Accessed', 'academic-bloggers-toolkit' ),
				'pattern' => $patterns->date,
				'title'   => __( 'YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit' ),
			],
		],
		'people' => [
			[
				'type'  => 'author',
				'label' => __( 'Author', 'academic-bloggers-toolkit' ),
			],
		],
	];

	$paper_conference = [
		'title'  => __( 'Conference Proceeding', 'academic-bloggers-toolkit' ),
		'fields' => [
			[
				'value'    => 'title',
				'label'    => __( 'Title', 'academic-bloggers-toolkit' ),
				'required' => true,
			],
			[
				'value'    => 'event',
				'label'    => __( 'Conference Name', 'academic-bloggers-toolkit' ),
				'required' => true,
			],
			[
				'value'    => 'publisher-place',
				'label'    => __( 'Conference Location', 'academic-bloggers-toolkit' ),
				'required' => true,
			],
			[
				'value'    => 'issued',
				'label'    => __( 'Date', 'academic-bloggers-toolkit' ),
				'required' => true,
				'pattern'  => $patterns->date,
				'title'    => __( 'YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit' ),
			],
		],
		'people' => [
			[
				'type'  => 'author',
				'label' => __( 'Author', 'academic-bloggers-toolkit' ),
			],
			[
				'type'  => 'editor',
				'label' => __( 'Editor', 'academic-bloggers-toolkit' ),
			],
			[
				'type'  => 'collection-editor',
				'label' => __( 'Series Editor', 'academic-bloggers-toolkit' ),
			],
			[
				'type'  => 'translator',
				'label' => __( 'Translator', 'academic-bloggers-toolkit' ),
			],
		],
	];

	$entry_encyclopedia = [
		'title'  => __( 'Encyclopedia Entry', 'academic-bloggers-toolkit' ),
		'fields' => [
			[
				'value'    => 'title',
				'label'    => __( 'Title', 'academic-bloggers-toolkit' ),
				'required' => true,
			],
			[
				'value'    => 'container-title',
				'label'    => __( 'Encyclopedia Title', 'academic-bloggers-toolkit' ),
				'required' => true,
			],
			[
				'value' => 'collection-title',
				'label' => __( 'Series', 'academic-bloggers-toolkit' ),
			],
			[
				'value'   => 'collection-number',
				'label'   => __( 'Series Number', 'academic-bloggers-toolkit' ),
				'pattern' => $patterns->numeric,
				'title'   => __( 'One or more numbers, no spaces', 'academic-bloggers-toolkit' ),
			],
			[
				'value'   => 'volume',
				'label'   => __( 'Volume', 'academic-bloggers-toolkit' ),
				'pattern' => $patterns->numeric,
				'title'   => __( 'One or more numbers, no spaces', 'academic-bloggers-toolkit' ),
			],
			[
				'value'   => 'number-of-volumes',
				'label'   => __( '# of Volumes', 'academic-bloggers-toolkit' ),
				'pattern' => $patterns->numeric,
				'title'   => __( 'One or more numbers, no spaces', 'academic-bloggers-toolkit' ),
			],
			[
				'value'   => 'edition',
				'label'   => __( 'Edition', 'academic-bloggers-toolkit' ),
				'pattern' => $patterns->numeric,
				'title'   => __( 'One or more numbers, no spaces', 'academic-bloggers-toolkit' ),
			],
			[
				'value' => 'publisher',
				'label' => __( 'Publisher', 'academic-bloggers-toolkit' ),
			],
			[
				'value' => 'publisher-place',
				'label' => __( 'Publisher Location', 'academic-bloggers-toolkit' ),
			],
			[
				'value'    => 'page',
				'label'    => __( 'Pages', 'academic-bloggers-toolkit' ),
				'required' => true,
			],
			[
				'value'    => 'issued',
				'label'    => __( 'Date', 'academic-bloggers-toolkit' ),
				'required' => true,
				'pattern'  => $patterns->date,
				'title'    => __( 'YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit' ),
			],
			[
				'value'   => 'accessed',
				'label'   => __( 'Date Accessed', 'academic-bloggers-toolkit' ),
				'pattern' => $patterns->date,
				'title'   => __( 'YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit' ),
			],
		],
		'people' => [
			[
				'type'  => 'author',
				'label' => __( 'Author', 'academic-bloggers-toolkit' ),
			],
			[
				'type'  => 'editor',
				'label' => __( 'Editor', 'academic-bloggers-toolkit' ),
			],
			[
				'type'  => 'collection-editor',
				'label' => __( 'Series Editor', 'academic-bloggers-toolkit' ),
			],
			[
				'type'  => 'translator',
				'label' => __( 'Translator', 'academic-bloggers-toolkit' ),
			],
		],
	];

	$motion_picture = [
		'title'  => __( 'Film', 'academic-bloggers-toolkit' ),
		'fields' => [
			[
				'value'    => 'title',
				'label'    => __( 'Title', 'academic-bloggers-toolkit' ),
				'required' => true,
			],
			[
				'value' => 'publisher',
				'label' => __( 'Distributor', 'academic-bloggers-toolkit' ),
			],
			[
				'value' => 'genre',
				'label' => __( 'Genre', 'academic-bloggers-toolkit' ),
			],
			[
				'value' => 'language',
				'label' => __( 'Language', 'academic-bloggers-toolkit' ),
			],
			[
				'value' => 'medium',
				'label' => __( 'Format', 'academic-bloggers-toolkit' ),
			],
			[
				'value'    => 'issued',
				'label'    => __( 'Date', 'academic-bloggers-toolkit' ),
				'required' => true,
				'pattern'  => $patterns->date,
				'title'    => __( 'YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit' ),
			],
			[
				'value'   => 'accessed',
				'label'   => __( 'Date Accessed', 'academic-bloggers-toolkit' ),
				'pattern' => $patterns->date,
				'title'   => __( 'YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit' ),
			],
		],
		'people' => [
			[
				'type'  => 'author',
				'label' => __( 'Scriptwriter', 'academic-bloggers-toolkit' ),
			],
			[
				'type'  => 'director',
				'label' => __( 'Director', 'academic-bloggers-toolkit' ),
			],
			[
				'type'  => 'editor',
				'label' => __( 'Producer', 'academic-bloggers-toolkit' ),
			],
		],
	];

	$article = [
		'title'  => __( 'Generic (Note)', 'academic-bloggers-toolkit' ),
		'fields' => [
			[
				'value'    => 'title',
				'label'    => __( 'Text', 'academic-bloggers-toolkit' ),
				'required' => true,
			],
		],
		'people' => [],
	];

	$speech = [
		'title'  => __( 'Presentation', 'academic-bloggers-toolkit' ),
		'fields' => [
			[
				'value'    => 'title',
				'label'    => __( 'Title', 'academic-bloggers-toolkit' ),
				'required' => true,
			],
			[
				'value'    => 'event',
				'label'    => __( 'Event Name', 'academic-bloggers-toolkit' ),
				'required' => true,
			],
			[
				'value' => 'event-place',
				'label' => __( 'Event Location', 'academic-bloggers-toolkit' ),
			],
			[
				'value' => 'language',
				'label' => __( 'Language', 'academic-bloggers-toolkit' ),
			],
			[
				'value'    => 'issued',
				'label'    => __( 'Date', 'academic-bloggers-toolkit' ),
				'required' => true,
				'pattern'  => $patterns->date,
				'title'    => __( 'YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit' ),
			],
		],
		'people' => [
			[
				'type'  => 'author',
				'label' => __( 'Presenter', 'academic-bloggers-toolkit' ),
			],
		],
	];

	$article_journal = [
		'title'  => __( 'Journal Article', 'academic-bloggers-toolkit' ),
		'fields' => [
			[
				'value'    => 'title',
				'label'    => __( 'Title', 'academic-bloggers-toolkit' ),
				'required' => true,
			],
			[
				'value'    => 'container-title',
				'label'    => __( 'Journal', 'academic-bloggers-toolkit' ),
				'required' => true,
			],
			[
				'value' => 'journalAbbreviation',
				'label' => __( 'Journal Abbreviation', 'academic-bloggers-toolkit' ),
			],
			[
				'value'   => 'volume',
				'label'   => __( 'Volume', 'academic-bloggers-toolkit' ),
				'pattern' => $patterns->numeric,
				'title'   => __( 'One or more numbers, no spaces', 'academic-bloggers-toolkit' ),
			],
			[
				'value'   => 'issue',
				'label'   => __( 'Issue', 'academic-bloggers-toolkit' ),
				'pattern' => $patterns->numeric,
			],
			[
				'value' => 'page',
				'label' => __( 'Pages', 'academic-bloggers-toolkit' ),
			],
			[
				'value' => 'DOI',
				'label' => __( 'DOI', 'academic-bloggers-toolkit' ),
			],
			[
				'value' => 'URL',
				'label' => __( 'URL', 'academic-bloggers-toolkit' ),
			],
			[
				'value'    => 'issued',
				'label'    => __( 'Date', 'academic-bloggers-toolkit' ),
				'required' => true,
				'pattern'  => $patterns->date,
				'title'    => __( 'YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit' ),
			],
		],
		'people' => [
			[
				'type'  => 'author',
				'label' => __( 'Author', 'academic-bloggers-toolkit' ),
			],
			[
				'type'  => 'editor',
				'label' => __( 'Editor', 'academic-bloggers-toolkit' ),
			],
		],
	];

	$article_magazine = [
		'title'  => __( 'Magazine Article', 'academic-bloggers-toolkit' ),
		'fields' => [
			[
				'value'    => 'title',
				'label'    => __( 'Title', 'academic-bloggers-toolkit' ),
				'required' => true,
			],
			[
				'value'    => 'container-title',
				'label'    => __( 'Magazine', 'academic-bloggers-toolkit' ),
				'required' => true,
			],
			[
				'value'   => 'volume',
				'label'   => __( 'Volume', 'academic-bloggers-toolkit' ),
				'pattern' => $patterns->numeric,
				'title'   => __( 'One or more numbers, no spaces', 'academic-bloggers-toolkit' ),
			],
			[
				'value'    => 'page',
				'label'    => __( 'Pages', 'academic-bloggers-toolkit' ),
				'required' => true,
			],
			[
				'value' => 'issue',
				'label' => __( 'Issue', 'academic-bloggers-toolkit' ),
			],
			[
				'value' => 'ISSN',
				'label' => __( 'ISSN', 'academic-bloggers-toolkit' ),
			],
			[
				'value' => 'URL',
				'label' => __( 'URL', 'academic-bloggers-toolkit' ),
			],
			[
				'value'    => 'issued',
				'label'    => __( 'Date', 'academic-bloggers-toolkit' ),
				'required' => true,
				'pattern'  => $patterns->date,
				'title'    => __( 'YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit' ),
			],
			[
				'value'   => 'accessed',
				'label'   => __( 'Date Accessed', 'academic-bloggers-toolkit' ),
				'pattern' => $patterns->date,
				'title'   => __( 'YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit' ),
			],
		],
		'people' => [
			[
				'type'  => 'author',
				'label' => __( 'Author', 'academic-bloggers-toolkit' ),
			],
			[
				'type'  => 'editor',
				'label' => __( 'Editor', 'academic-bloggers-toolkit' ),
			],
		],
	];

	$article_newspaper = [
		'title'  => __( 'Newspaper Article', 'academic-bloggers-toolkit' ),
		'fields' => [
			[
				'value'    => 'title',
				'label'    => __( 'Title', 'academic-bloggers-toolkit' ),
				'required' => true,
			],
			[
				'value'    => 'container-title',
				'label'    => __( 'Publication', 'academic-bloggers-toolkit' ),
				'required' => true,
			],
			[
				'value' => 'section',
				'label' => __( 'Section', 'academic-bloggers-toolkit' ),
			],
			[
				'value'    => 'page',
				'label'    => __( 'Pages', 'academic-bloggers-toolkit' ),
				'required' => true,
			],
			[
				'value' => 'issue',
				'label' => __( 'Issue', 'academic-bloggers-toolkit' ),
			],
			[
				'value' => 'URL',
				'label' => __( 'URL', 'academic-bloggers-toolkit' ),
			],
			[
				'value'    => 'issued',
				'label'    => __( 'Date', 'academic-bloggers-toolkit' ),
				'required' => true,
				'pattern'  => $patterns->date,
				'title'    => __( 'YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit' ),
			],
			[
				'value'   => 'accessed',
				'label'   => __( 'Date Accessed', 'academic-bloggers-toolkit' ),
				'pattern' => $patterns->date,
				'title'   => __( 'YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit' ),
			],
		],
		'people' => [
			[
				'type'  => 'author',
				'label' => __( 'Author', 'academic-bloggers-toolkit' ),
			],
			[
				'type'  => 'editor',
				'label' => __( 'Editor', 'academic-bloggers-toolkit' ),
			],
		],
	];

	$patent = [
		'title'  => __( 'Patent', 'academic-bloggers-toolkit' ),
		'fields' => [
			[
				'value'    => 'title',
				'label'    => __( 'Title', 'academic-bloggers-toolkit' ),
				'required' => true,
			],
			[
				'value'    => 'number',
				'label'    => __( 'Number', 'academic-bloggers-toolkit' ),
				'required' => true,
			],
			[
				'value'    => 'jurisdiction',
				'label'    => __( 'Jurisdiction', 'academic-bloggers-toolkit' ),
				'required' => true,
			],
			[
				'value' => 'page',
				'label' => __( 'Pages', 'academic-bloggers-toolkit' ),
			],
			[
				'value'    => 'publisher',
				'label'    => __( 'Issuer', 'academic-bloggers-toolkit' ),
				'required' => true,
			],
			[
				'value'    => 'issued',
				'label'    => __( 'Date', 'academic-bloggers-toolkit' ),
				'required' => true,
				'pattern'  => $patterns->date,
				'title'    => __( 'YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit' ),
			],
			[
				'value'   => 'accessed',
				'label'   => __( 'Date Accessed', 'academic-bloggers-toolkit' ),
				'pattern' => $patterns->date,
				'title'   => __( 'YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit' ),
			],
		],
		'people' => [
			[
				'type'  => 'author',
				'label' => __( 'Inventor', 'academic-bloggers-toolkit' ),
			],
		],
	];

	$report = [
		'title'  => __( 'Report', 'academic-bloggers-toolkit' ),
		'fields' => [
			[
				'value'    => 'title',
				'label'    => __( 'Title', 'academic-bloggers-toolkit' ),
				'required' => true,
			],
			[
				'value'   => 'number',
				'label'   => __( 'Number', 'academic-bloggers-toolkit' ),
				'pattern' => $patterns->numeric,
				'title'   => __( 'One or more numbers, no spaces', 'academic-bloggers-toolkit' ),
			],
			[
				'value' => 'collection-title',
				'label' => __( 'Series', 'academic-bloggers-toolkit' ),
			],
			[
				'value' => 'container-title',
				'label' => __( 'Publication', 'academic-bloggers-toolkit' ),
			],
			[
				'value'    => 'publisher',
				'label'    => __( 'Publisher', 'academic-bloggers-toolkit' ),
				'required' => true,
			],
			[
				'value'    => 'page',
				'label'    => __( 'Pages', 'academic-bloggers-toolkit' ),
				'required' => true,
			],
			[
				'value' => 'URL',
				'label' => __( 'URL', 'academic-bloggers-toolkit' ),
			],
			[
				'value'    => 'issued',
				'label'    => __( 'Date', 'academic-bloggers-toolkit' ),
				'required' => true,
				'pattern'  => $patterns->date,
				'title'    => __( 'YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit' ),
			],
			[
				'value'   => 'accessed',
				'label'   => __( 'Date Accessed', 'academic-bloggers-toolkit' ),
				'pattern' => $patterns->date,
				'title'   => __( 'YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit' ),
			],
		],
		'people' => [
			[
				'type'  => 'author',
				'label' => __( 'Author', 'academic-bloggers-toolkit' ),
			],
			[
				'type'  => 'collection-editor',
				'label' => __( 'Series Editor', 'academic-bloggers-toolkit' ),
			],
			[
				'type'  => 'translator',
				'label' => __( 'Translator', 'academic-bloggers-toolkit' ),
			],
		],
	];

	$legislation = [
		'title'  => __( 'Statute', 'academic-bloggers-toolkit' ),
		'fields' => [
			[
				'value'    => 'title',
				'label'    => __( 'Title', 'academic-bloggers-toolkit' ),
				'required' => true,
			],
			[
				'value'   => 'number',
				'label'   => __( 'Statute Number', 'academic-bloggers-toolkit' ),
				'pattern' => $patterns->numeric,
				'title'   => __( 'One or more numbers, no spaces', 'academic-bloggers-toolkit' ),
			],
			[
				'value' => 'section',
				'label' => __( 'Section', 'academic-bloggers-toolkit' ),
			],
			[
				'value'    => 'page',
				'label'    => __( 'Pages', 'academic-bloggers-toolkit' ),
				'required' => true,
			],
			[
				'value'    => 'issued',
				'label'    => __( 'Date', 'academic-bloggers-toolkit' ),
				'required' => true,
				'pattern'  => $patterns->date,
				'title'    => __( 'YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit' ),
			],
			[
				'value'   => 'accessed',
				'label'   => __( 'Date Accessed', 'academic-bloggers-toolkit' ),
				'pattern' => $patterns->date,
				'title'   => __( 'YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit' ),
			],
		],
		'people' => [
			[
				'type'  => 'author',
				'label' => __( 'Author', 'academic-bloggers-toolkit' ),
			],
		],
	];

	$thesis = [
		'title'  => __( 'Thesis', 'academic-bloggers-toolkit' ),
		'fields' => [
			[
				'value'    => 'title',
				'label'    => __( 'Title', 'academic-bloggers-toolkit' ),
				'required' => true,
			],
			[
				'value'   => 'number-of-pages',
				'label'   => __( '# of Pages', 'academic-bloggers-toolkit' ),
				'pattern' => $patterns->numeric,
				'title'   => __( 'One or more numbers, no spaces', 'academic-bloggers-toolkit' ),
			],
			[
				'value'    => 'publisher',
				'label'    => __( 'University', 'academic-bloggers-toolkit' ),
				'required' => true,
			],
			[
				'value' => 'publisher-place',
				'label' => __( 'Location', 'academic-bloggers-toolkit' ),
			],
			[
				'value'    => 'issued',
				'label'    => __( 'Date', 'academic-bloggers-toolkit' ),
				'required' => true,
				'pattern'  => $patterns->date,
				'title'    => __( 'YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit' ),
			],
			[
				'value'   => 'accessed',
				'label'   => __( 'Date Accessed', 'academic-bloggers-toolkit' ),
				'pattern' => $patterns->date,
				'title'   => __( 'YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit' ),
			],
		],
		'people' => [
			[
				'type'  => 'author',
				'label' => __( 'Author', 'academic-bloggers-toolkit' ),
			],
		],
	];

	$webpage = [
		'title'  => __( 'Web Page', 'academic-bloggers-toolkit' ),
		'fields' => [
			[
				'value'    => 'title',
				'label'    => __( 'Content Title', 'academic-bloggers-toolkit' ),
				'required' => true,
			],
			[
				'value'    => 'container-title',
				'label'    => __( 'Website Title', 'academic-bloggers-toolkit' ),
				'required' => true,
			],
			[
				'value'    => 'URL',
				'label'    => __( 'URL', 'academic-bloggers-toolkit' ),
				'required' => true,
			],
			[
				'value'   => 'issued',
				'label'   => __( 'Date', 'academic-bloggers-toolkit' ),
				'pattern' => $patterns->date,
				'title'   => __( 'YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit' ),
			],
			[
				'value'   => 'accessed',
				'label'   => __( 'Date Accessed', 'academic-bloggers-toolkit' ),
				'pattern' => $patterns->date,
				'title'   => __( 'YYYY/MM/DD or YYYY/MM or YYYY', 'academic-bloggers-toolkit' ),
			],
		],
		'people' => [
			[
				'type'  => 'author',
				'label' => __( 'Author', 'academic-bloggers-toolkit' ),
			],
		],
	];

	return (object) [
		'article'            => $article,
		'article-journal'    => $article_journal,
		'article-magazine'   => $article_magazine,
		'article-newspaper'  => $article_newspaper,
		'bill'               => $bill,
		'book'               => $book,
		'broadcast'          => $broadcast,
		'chapter'            => $chapter,
		'entry-encyclopedia' => $entry_encyclopedia,
		'legal_case'         => $legal_case,
		'legislation'        => $legislation,
		'motion_picture'     => $motion_picture,
		'paper-conference'   => $paper_conference,
		'patent'             => $patent,
		'report'             => $report,
		'speech'             => $speech,
		'thesis'             => $thesis,
		'webpage'            => $webpage,
	];
}
