<?php
/**
 * AJAX Endpoints.
 *
 * @package ABT
 */

namespace ABT\Endpoints;

defined( 'ABSPATH' ) || exit;

use function ABT\Admin\get_citation_styles;

/**
 * AJAX Method for getting metadata from other websites for citations.
 */
function get_website_meta() {
	if ( ! extension_loaded( 'dom' ) || ! extension_loaded( 'libxml' ) ) {
		wp_send_json_error( [], 501 );
		exit;
	}

	$url  = esc_url_raw( wp_unslash( $_POST['url'] ) );
	$raw  = wp_remote_retrieve_body( wp_safe_remote_get( $url ) );
	$html = new \DOMDocument();
	libxml_use_internal_errors( true );
	$html->loadHTML( $raw );
	$xpath = new \DOMXPath( $html );

	$payload = [
		'article'  => [],
		'authors'  => [],
		'og'       => [],
		'sailthru' => [],
	];

	/**
	 * Stray Meta "name" Tags.
	 */
	$authors = $xpath->query( '//meta[ @name="author" ]' );
	foreach ( $authors as $node ) {
		$a = explode( ' ', $node->getAttribute( 'content' ), 2 );
		$a = [
			'given'  => $a[0],
			'family' => $a[1],
		];
		if ( ! is_int( array_search( $a, $payload['authors'], true ) ) ) {
			$payload['authors'][] = $a;
		}
	}

	$issued = $xpath->query( '//meta[ @name="pubdate" ]' );
	foreach ( $issued as $node ) {
		$payload['issued'] = $node->getAttribute( 'content' );
	}

	/**
	 * Open Graph Tags.
	 */
	$opengraph = $xpath->query( '//meta[ starts-with( @property, "og:" ) ]' );
	foreach ( $opengraph as $node ) {
		$expl                  = explode( ':', $node->getAttribute( 'property' ), 2 );
		$key                   = str_replace( ':', '_', $expl[1] );
		$value                 = $node->getAttribute( 'content' );
		$payload['og'][ $key ] = $value;
	}

	/**
	 * Article Tags.
	 */
	$article = $xpath->query( '//meta[ starts-with( @property, "article:" ) ]' );
	foreach ( $article as $node ) {
		$expl                       = explode( ':', $node->getAttribute( 'property' ), 2 );
		$key                        = $expl[1];
		$value                      = $node->getAttribute( 'content' );
		$payload['article'][ $key ] = $value;
	}

	/**
	 * Sailthru Tags.
	 */
	$sailthru = $xpath->query( '//meta[ starts-with( @name, "sailthru" ) ]' );
	foreach ( $sailthru as $node ) {
		$expl  = explode( '.', $node->getAttribute( 'name' ), 2 );
		$key   = $expl[1];
		$value = $node->getAttribute( 'content' );

		if ( 'author' === $key ) {
			if ( strlen( $value ) > 50 ) {
				continue;
			}
			$a = explode( ' ', $value, 2 );
			$a = [
				'given'  => $a[0],
				'family' => $a[1],
			];
			if ( ! is_int( array_search( $a, $payload['authors'], true ) ) ) {
				$payload['authors'][] = $a;
			}
			continue;
		}

		$payload['sailthru'][ $key ] = $value;
	}

	/**
	 * Itemprop Tags.
	 */
	$issued = $xpath->query( '//*[ @itemprop="datePublished" ]' );
	foreach ( $issued as $iss ) {
		$i = $iss->getAttribute( 'datetime' );
		if ( ! empty( $i ) ) {
			$payload['issued'] = $i;
			continue;
		}
		$i = $iss->getAttribute( 'content' );
		if ( ! empty( $i ) ) {
			$payload['issued'] = $i;
			continue;
		}
	}

	$authors = $xpath->query( '//*[ @itemprop="author" ][ not( ancestor::*[ @itemtype="http://schema.org/Comment" ] ) ]' );
	foreach ( $authors as $author ) {
		// @codingStandardsIgnoreStart
		// snake_case is out of my control here.
		if ( 'meta' === $author->nodeName ) {
			continue;
		}
		$a = explode( ' ', $author->textContent, 2 );
		// @codingStandardsIgnoreEnd
		$a = [
			'given'  => $a[0],
			'family' => $a[1],
		];
		if ( ! is_int( array_search( $a, $payload['authors'], true ) ) ) {
			$payload['authors'][] = $a;
		}
	}

	$title = $xpath->query( '//*[ @itemprop="headline" ]' );
	foreach ( $title as $t ) {
		// @codingStandardsIgnoreStart
		// snake_case is out of my control here.
		$payload['title'] = $t->textContent;
		// @codingStandardsIgnoreEnd
	}

	/**
	 * ABT Tags.
	 */
	$abt = $xpath->query( '//meta[ starts-with( @property, "abt:" ) ]' );
	foreach ( $abt as $node ) {
		$expl  = explode( ':', $node->getAttribute( 'property' ), 2 );
		$key   = $expl[1];
		$value = $node->getAttribute( 'content' );
		if ( 'author' === $key ) {
			$a = explode( '|', $value, 2 );
			$a = [
				'given'  => $a[0],
				'family' => $a[1],
			];
			if ( ! is_int( array_search( $a, $payload['authors'], true ) ) ) {
				$payload['authors'][] = $a;
			}
		}
		$payload['abt'][ $key ] = $value;
	}

	// Last ditch effort to get a title of the site.
	if ( ! $payload['title'] ) {
		$title = trim( preg_replace( '/\s+/', ' ', $raw ) );
		preg_match( '/\<title\>( .* )\<\/title\>/i', $title, $title );
		$payload['title'] = $title[1];
	}

	wp_send_json( $payload );
}
add_action( 'wp_ajax_get_website_meta', __NAMESPACE__ . '\get_website_meta' );


/**
 * Fetch and return citation style JSON.
 */
function get_style_json() {
	wp_send_json( get_citation_styles() );
}
add_action( 'wp_ajax_get_style_json', __NAMESPACE__ . '\get_style_json' );
