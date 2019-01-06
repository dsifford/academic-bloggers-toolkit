<?php
/**
 * Admin-related functionality
 *
 * @package ABT
 */

namespace ABT\Admin;

defined( 'ABSPATH' ) || exit;

use function ABT\Utils\{
	enqueue_script,
	get_citation_styles,
	is_block_editor,
};

/**
 * Enqueue admin scripts.
 */
function enqueue_scripts(): void {
	global $post;
	if ( is_block_editor() ) {
		enqueue_script(
			'editor',
			[
				'scripts' => [
					'citeproc',
					'lodash',
					'wp-api-fetch',
					'wp-blocks',
					'wp-components',
					'wp-compose',
					'wp-data',
					'wp-edit-post',
					'wp-editor',
					'wp-element',
					'wp-i18n',
					'wp-keycodes',
					'wp-plugins',
					'wp-polyfill',
					'wp-rich-text',
					'wp-url',
				],
			]
		);
		init_editor_state( $post->ID );
	}
}
add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\enqueue_scripts' );

/**
 * Register post meta to store editor state.
 */
function register_metadata(): void {
	register_meta(
		'post',
		'abt_state',
		[
			'show_in_rest' => true,
			'single'       => true,
			'type'         => 'string',
		]
	);
}
add_action( 'init', __NAMESPACE__ . '\register_metadata' );

/**
 * Prepares editor state and returns the value.
 *
 * If editor state doesn't exist, this function initializes a new blank state
 * and converts any existing old legacy editor state to the current format.
 *
 * If state exists, decode it from json and return the value.
 *
 * @param int $post_id The post id.
 */
function init_editor_state( int $post_id ): void {
	$meta = get_post_meta( $post_id );

	if ( ! array_key_exists( 'abt_state', $meta ) ) {
		$state = (object) [
			'references' => [],
			'style'      => get_option( ABT_OPTIONS_KEY )['citation_style'],
		];

		if ( array_key_exists( '_abt-reflist-state', $meta ) ) {
			$legacy_meta = json_decode( $meta['_abt-reflist-state'][0] );
			// phpcs:ignore
			foreach ( $legacy_meta->CSL as $id => $data ) {
				$state->references[] = $data;
			}
			$state->style = $legacy_meta->cache->style;
		}

		add_post_meta(
			$post_id,
			'abt_state',
			wp_slash( wp_json_encode( $state ) ),
			true
		);
	}
}
