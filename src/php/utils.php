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
 * Parses and returns ./vendor/citation-styles.json
 */
function get_citation_styles() {
	return json_decode(
		file_get_contents( // phpcs:ignore
			ABT_ROOT_PATH . '/vendor/citation-styles.json'
		)
	);
}

/**
 * Return a script or style's handle given its path relative to the bundle directory.
 *
 * @param string $relpath The script's path relative to the bundle directory.
 * @param string $kind    Optional. The kind of script for which the handle is
 *                        desired. Accepts 'script', 'style'. Default empty.
 *
 * @throws \InvalidArgumentException If the relative path refers to a non-existent file.
 */
function get_handle( string $relpath, string $kind = null ): string {
	if (
		! is_file( ABT_ROOT_PATH . "/bundle/$relpath.css" ) &&
		! is_file( ABT_ROOT_PATH . "/bundle/$relpath.js" ) ) {
		throw new \InvalidArgumentException(
			"No scripts or styles could be located using relpath '$relpath'"
		);
	}
	if ( $kind && ! in_array( $kind, [ 'script', 'style' ], true ) ) {
		throw new \InvalidArgumentException(
			"Invalid argument \$kind: Expected 'script' or 'style'. Received '$kind'"
		);
	}
	return join(
		'-',
		array_filter(
			[
				'abt',
				str_replace( '/', '-', $relpath ),
				$kind,
			],
			'is_string'
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

/**
 * Utility function that registers a script and/or its associated style if it exists.
 *
 * @param string $relpath Path of script/style relative to the bundle directory.
 * @param array  $deps    Optional. List of script dependencies. Default [].
 *
 * @throws \InvalidArgumentException If the relative path refers to a non-existent file.
 */
function register_script( string $relpath, array $deps = [] ): void {
	$style_suffix  = "/bundle/$relpath.css";
	$script_suffix = "/bundle/$relpath.js";

	if ( file_exists( ABT_ROOT_PATH . $style_suffix ) ) {
		wp_register_style(
			get_handle( $relpath, 'style' ),
			ABT_ROOT_URI . $style_suffix,
			$deps['styles'] ?? [],
			filemtime( ABT_ROOT_PATH . $style_suffix )
		);
	}
	if ( file_exists( ABT_ROOT_PATH . $script_suffix ) ) {
		wp_register_script(
			get_handle( $relpath, 'script' ),
			ABT_ROOT_URI . $script_suffix,
			$deps['scripts'] ?? [],
			filemtime( ABT_ROOT_PATH . $script_suffix ),
			true
		);
	}
}
