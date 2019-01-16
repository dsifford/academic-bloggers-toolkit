<?php
/**
 * Admin-related functionality
 *
 * @package ABT
 */

namespace ABT\Admin;

defined( 'ABSPATH' ) || exit;

use function ABT\Utils\{
	get_citation_styles,
	get_handle,
	is_block_editor,
};

/**
 * Enqueue admin scripts.
 */
function enqueue_scripts(): void {
	global $post;
	if ( is_block_editor() ) {
		wp_enqueue_style( get_handle( 'editor-blocks', 'style' ) );
		wp_enqueue_style( get_handle( 'editor-formats', 'style' ) );
		wp_enqueue_style( get_handle( 'editor', 'style' ) );

		wp_enqueue_script( get_handle( 'editor-stores', 'script' ) );
		wp_enqueue_script( get_handle( 'editor-blocks', 'script' ) );
		wp_enqueue_script( get_handle( 'editor-formats', 'script' ) );
		wp_enqueue_script( get_handle( 'editor', 'script' ) );

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
		'_abt_state',
		[
			'show_in_rest'  => true,
			'single'        => true,
			'type'          => 'string',
			'auth_callback' => function() {
				return current_user_can( 'edit_posts' );
			},
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

	if ( ! array_key_exists( '_abt_state', $meta ) ) {
		$state = (object) [
			'references' => [],
			'style'      => get_option( ABT_OPTIONS_KEY )['citation_style'],
		];

		if ( array_key_exists( '_abt-reflist-state', $meta ) ) {
			$legacy_meta = json_decode( $meta['_abt-reflist-state'][0] );
			foreach ( $legacy_meta->CSL as $id => $data ) { // phpcs:ignore
				$state->references[] = $data;
			}
			$state->style = $legacy_meta->cache->style;
		}

		add_post_meta(
			$post_id,
			'_abt_state',
			wp_slash( wp_json_encode( $state ) ),
			true
		);
	}
}
