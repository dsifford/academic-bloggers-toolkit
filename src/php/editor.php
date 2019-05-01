<?php
/**
 * Editor functionality.
 *
 * @package ABT
 */

declare(strict_types=1);

namespace ABT\Editor;

defined( 'ABSPATH' ) || exit;

use function ABT\Utils\add_json_script;

/**
 * Enqueue admin scripts.
 */
function enqueue_scripts() {
	global $post;
	wp_enqueue_style( 'abt-editor' );
	wp_enqueue_script( 'abt-editor' );

	$state = init_editor_state( $post->ID );
	add_json_script( 'abt-editor-state', $state );
}
add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\enqueue_scripts' );

/**
 * Register post meta to store editor state.
 */
function register_metadata() {
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
 * @return mixed The editor state.
 */
function init_editor_state( int $post_id ) {
	$meta = get_post_meta( $post_id );

	if ( ! array_key_exists( '_abt_state', $meta ) || ! has_blocks( $post_id ) ) {
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
	} else {
		$state = json_decode( $meta['_abt_state'][0] );
	}

	return $state;
}
