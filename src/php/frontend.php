<?php
/**
 * Functionality related to rendering frontend content.
 *
 * @package ABT
 */

namespace ABT\Frontend;

defined( 'ABSPATH' ) || exit;

use function ABT\Utils\enqueue_script;

/**
 * Save a reference to the full bibliography as a JS global for parsing tooltips in paged posts.
 *
 * @param WP_Post $post The post.
 */
function collect_bibliography( $post ): void {
	if ( is_singular() ) {
		preg_match(
			'/<!-- (?P<tag>wp:abt\/bibliography) -->(?P<content>.+?)<!-- \/(?P=tag) -->/s',
			$post->post_content,
			$matches
		);
		if ( $matches['content'] ) {
			// Add inline script here.
			wp_add_inline_script(
				'abt-frontend-script',
				'var ABT_FRONTEND = ABT_FRONTEND || {}; ' .
				'ABT_FRONTEND.bibliography = ' . wp_json_encode( $matches['content'] ) . ';',
				'before'
			);
		}
	}
}
add_action( 'the_post', __NAMESPACE__ . '\collect_bibliography' );

/**
 * Enqueues frontend CSS and JS.
 */
function enqueue_scripts() {
	global $post;

	if ( ! has_blocks( $post ) ) {
		return;
	}

	enqueue_script(
		'frontend',
		[
			'scripts' => [
				'wp-dom-ready',
			],
		]
	);
}
add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\enqueue_scripts' );

/**
 * Enqueues legacy frontend CSS and JS.
 */
function enqueue_legacy_scripts() {
	global $post;

	if ( has_blocks( $post ) ) {
		return;
	}

	wp_enqueue_style(
		'abt-frontend-legacy-styles',
		ABT_ROOT_URI . '/bundle/frontend-legacy.css',
		[],
		filemtime( ABT_ROOT_PATH . '/bundle/frontend-legacy.css' )
	);

	if ( is_singular() ) {
		wp_enqueue_script(
			'abt-frontend-legacy-script',
			ABT_ROOT_URI . '/bundle/frontend-legacy.js',
			[],
			filemtime( ABT_ROOT_PATH . '/bundle/frontend-legacy.js' ),
			true
		);
	}
}
add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\enqueue_legacy_scripts' );
