<?php
/**
 * AJAX Endpoints.
 *
 * @package ABT
 */

// phpcs:disable WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase

namespace ABT\Endpoints;

defined( 'ABSPATH' ) || exit;

use function ABT\Utils\get_citation_styles;

/**
 * Fetch and return citation style JSON.
 */
function get_style_json() {
	check_ajax_referer( 'abt-ajax' );
	$styles        = get_citation_styles();
	$current_style = get_option( ABT_OPTIONS_KEY )['citation_style'];
	if ( 'custom' === $current_style['kind'] ) {
		$styles->styles[] = $current_style;
	}
	wp_send_json( $styles );
}
add_action( 'wp_ajax_get_style_json', __NAMESPACE__ . '\get_style_json' );

/**
 * AJAX Method for getting metadata from other websites for citations.
 */
function get_website_meta() {
	if ( ! extension_loaded( 'dom' ) || ! extension_loaded( 'libxml' ) ) {
		wp_send_json_error( [], 501 );
		exit;
	}
	check_ajax_referer( 'abt-ajax' );

	if ( ! isset( $_POST['url'] ) ) {
		wp_send_json_error( [], 400 );
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
		$a = explode( ' ', sanitize_text_field( $node->getAttribute( 'content' ) ), 2 );
		$a = [
			'given'  => $a[0],
			'family' => $a[1],
		];
		if ( ! is_int( array_search( $a, $payload['authors'], true ) ) ) {
			$payload['authors'][] = $a;
		}
	}

	$issued = $xpath->query( '//meta[ @name="pubdate" ]' )->item( 0 );
	if ( $issued ) {
		$payload['issued'] = sanitize_text_field( $issued->getAttribute( 'content' ) );
	}

	/**
	 * Open Graph Tags.
	 */
	$opengraph = $xpath->query( '//meta[ starts-with( @property, "og:" ) ]' );
	foreach ( $opengraph as $node ) {
		$expl                  = explode( ':', $node->getAttribute( 'property' ), 2 );
		$key                   = sanitize_key( str_replace( ':', '_', $expl[1] ) );
		$value                 = sanitize_text_field( $node->getAttribute( 'content' ) );
		$payload['og'][ $key ] = $value;
	}

	/**
	 * Article Tags.
	 */
	$article = $xpath->query( '//meta[ starts-with( @property, "article:" ) ]' );
	foreach ( $article as $node ) {
		$expl                       = explode( ':', $node->getAttribute( 'property' ), 2 );
		$key                        = sanitize_key( $expl[1] );
		$value                      = sanitize_text_field( $node->getAttribute( 'content' ) );
		$payload['article'][ $key ] = $value;
	}

	/**
	 * Sailthru Tags.
	 */
	$sailthru = $xpath->query( '//meta[ starts-with( @name, "sailthru" ) ]' );
	foreach ( $sailthru as $node ) {
		$expl  = explode( '.', $node->getAttribute( 'name' ), 2 );
		$key   = sanitize_key( $expl[1] );
		$value = sanitize_text_field( $node->getAttribute( 'content' ) );

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
	$issued = $xpath->query( '//*[ @itemprop="datePublished" ]' )->item( 0 );
	if ( $issued ) {
		if ( $issued->hasAttribute( 'datetime' ) ) {
			$payload['issued'] = esc_attr( $issued->getAttribute( 'datetime' ) );
		} elseif ( $issued->hasAttribute( 'content' ) ) {
			$payload['issued'] = esc_attr( $issued->getAttribute( 'content' ) );
		}
	}

	$authors = $xpath->query( '//*[ @itemprop="author" ][ not( ancestor::*[ @itemtype="http://schema.org/Comment" ] ) ]' );
	foreach ( $authors as $author ) {
		if ( $author->nodeName === 'meta' ) {
			continue;
		}
		$a = explode( ' ', sanitize_text_field( $author->textContent ), 2 );
		$a = [
			'given'  => $a[0],
			'family' => $a[1],
		];
		if ( ! is_int( array_search( $a, $payload['authors'], true ) ) ) {
			$payload['authors'][] = $a;
		}
	}

	$title = $xpath->query( '//*[ @itemprop="headline" ]' )->item( 0 );
	if ( $title ) {
		$payload['title'] = sanitize_text_field( $title->textContent );
	}

	/**
	 * ABT Tags.
	 */
	$abt = $xpath->query( '//meta[ starts-with( @property, "abt:" ) ]' );
	foreach ( $abt as $node ) {
		$expl  = explode( ':', $node->getAttribute( 'property' ), 2 );
		$key   = sanitize_key( $expl[1] );
		$value = sanitize_text_field( $node->getAttribute( 'content' ) );
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
	}

	// Last ditch effort to get a title of the site.
	if ( ! $payload['title'] ) {
		$title = $xpath->query( '/html/head/title' )->item( 0 );
		if ( $title ) {
			$payload['title'] = sanitize_text_field( $title->textContent );
		}
	}

	wp_send_json( $payload );
}
add_action( 'wp_ajax_get_website_meta', __NAMESPACE__ . '\get_website_meta' );

/**
 * Custom API to update _abt_state meta since current WordPress APIs are broken.
 */
function update_abt_state() {
	check_ajax_referer( 'abt-ajax' );
	if ( ! isset( $_POST['state'], $_POST['post_id'] ) ) {
		wp_send_json_error( 'required fields not sent', 400 );
	}
	$post_id = intval( $_POST['post_id'] );
	$state   = json_decode( wp_unslash( $_POST['state'] ) ); // phpcs:ignore
	if ( is_null( $state ) ) {
		wp_send_json_error( 'state is null', 400 );
	}
	$updated = update_post_meta(
		$post_id,
		'_abt_state',
		wp_slash(
			wp_json_encode( $state )
		)
	);
	wp_send_json_success( $state );
}
add_action( 'wp_ajax_update_abt_state', __NAMESPACE__ . '\update_abt_state' );
