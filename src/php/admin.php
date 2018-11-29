<?php
/**
 * Admin-related functionality
 *
 * @package ABT
 */

namespace ABT\Admin;

use function ABT\Utils\enqueue_script;

/**
 * Enqueue admin scripts.
 */
function enqueue_scripts() {
	if ( function_exists( 'is_gutenberg_page' ) && is_gutenberg_page() ) {
		enqueue_script(
			'editor',
			[
				'scripts' => [
					'citeproc',
					'wp-components',
					'wp-edit-post',
					'wp-element',
					'wp-plugins',
				],
			]
		);
	}
}
add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\enqueue_scripts' );
