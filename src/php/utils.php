<?php
/**
 * Utility functions used throughout the backend.
 *
 * @package ABT
 */

namespace ABT\Utils;

/**
 * Utility function that enqueues a script and/or its associated style if it exists.
 *
 * @param string $relpath Path of script/style relative to the bundle directory.
 * @param array  $deps List of script dependencies. Default [].
 *
 * @throws InvalidArgumentException If no script or style can be found for given relpath.
 */
function enqueue_script( string $relpath, array $deps = [] ): void {
	$count         = 0;
	$handle        = 'abt-' . str_replace( '/', '-', $relpath );
	$style_suffix  = "/bundle/$relpath.css";
	$script_suffix = "/bundle/$relpath.js";

	if ( file_exists( ABT_ROOT_PATH . $style_suffix ) ) {
		wp_enqueue_style(
			"$handle-style",
			ABT_ROOT_URI . $style_suffix,
			$deps['styles'] ?? [],
			filemtime( ABT_ROOT_PATH . $style_suffix )
		);
		$count++;
	}
	if ( file_exists( ABT_ROOT_PATH . $script_suffix ) ) {
		wp_enqueue_script(
			"$handle-script",
			ABT_ROOT_URI . $script_suffix,
			$deps['scripts'] ?? [],
			filemtime( ABT_ROOT_PATH . $script_suffix ),
			true
		);
		$count++;
	}
	if ( 0 === $count ) {
		throw new InvalidArgumentException( "No scripts could be located using relpath '$relpath'" );
	}
}

/**
 * Parses and returns /vendor/citation-styles.json
 */
function get_citation_styles() {
	return json_decode(
		file_get_contents( // phpcs:ignore
			ABT_ROOT_PATH . '/vendor/citation-styles.json'
		)
	);
}

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
