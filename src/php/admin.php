<?php
/**
 * Admin-related functionality
 *
 * @package ABT
 */

namespace ABT\Admin;

use function ABT\Utils\enqueue_script;

/**
 * Checks if current page has the block editor loaded.
 */
function is_block_editor(): bool {
	return (
		(
			function_exists( 'get_current_screen' )
			&& get_current_screen()->is_block_editor()
			&& user_can_richedit()
		)
		||
		(
			function_exists( 'is_gutenberg_page' ) && is_gutenberg_page()
		)
	);
}

/**
 * Enqueue admin scripts.
 */
function enqueue_scripts() {
	global $post;
	if ( is_block_editor() ) {
		enqueue_script(
			'editor',
			[
				'scripts' => [
					'lodash',
					'citeproc',
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
		add_post_meta(
			$post->ID,
			'abt_state',
			wp_json_encode(
				[
					'bibliography' => [ (object) [], [] ],
					'citations'    => [],
					'style'        => get_option( ABT_OPTIONS_KEY )['citation_style'],
				]
			),
			true
		);
		wp_localize_script(
			'abt-editor-script',
			'ABT_EDITOR',
			json_decode(
				get_post_meta( $post->ID, 'abt_state', true )
			)
		);
	}
}
add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\enqueue_scripts' );

/**
 * Register post meta to store editor state.
 */
function register_metadata() {
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
