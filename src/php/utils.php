<?php
/**
 * Utility functions used throughout the backend.
 *
 * @package ABT
 */

declare(strict_types=1);

namespace ABT\Utils;

/**
 * Safely adds JSON data into a page to be used by scripts.
 *
 * @param string $id A unique ID for the data.
 * @param mixed  $data The data to be JSON encoded.
 * @throws \RuntimeException If the provided action is already done and over with.
 */
function add_json_script( string $id, $data ) {
	$prefix = is_admin() ? 'admin_' : 'wp_';
	$action = $prefix . 'footer';
	if ( did_action( $action ) ) {
		throw new \RuntimeException( 'Action already fired for JSON data with ID ' . $id );
	}
	add_action(
		$action,
		function () use ( $id, $data ) {
			?>
				<script
					id="<?php echo esc_attr( $id ); ?>"
					type="application/json"
					><?php echo wp_json_encode( $data ); ?></script>
			<?php
		}
	);
}

/**
 * Create and queue an admin notice.
 *
 * @param string $message The mesage to display.
 * @param string $kind    Optional. The notice kind. Accepts 'error', 'info',
 *                        'success', 'warning'. Default 'info'.
 */
function create_admin_notice( string $message, string $kind = 'info' ) {
	if ( is_admin() ) {
		add_action(
			'admin_notices',
			function () use ( $message, $kind ) {
				?>
				<div class="notice notice-<?php echo esc_attr( $kind ); ?> is-dismissible">
					<p><strong><?php esc_html_e( 'Notice', 'academic-bloggers-toolkit' ); ?>:</strong> <?php echo esc_html( $message ); ?></p>
				</div>
				<?php
			}
		);
	}
}

/**
 * Parses and returns ./citation-styles.json
 */
function get_citation_styles() {
	return json_decode(
		file_get_contents( // phpcs:ignore
			ABT_ROOT_PATH . '/citation-styles.json'
		)
	);
}

/**
 * Parses and returns ./dependencies.json
 */
function get_dependencies() {
	return json_decode(
		file_get_contents( // phpcs:ignore
			ABT_ROOT_PATH . '/dependencies.json'
		),
		true
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
function register_script( string $relpath, array $deps = [] ) {
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
		$handle = get_handle( $relpath, 'script' );
		wp_register_script(
			$handle,
			ABT_ROOT_URI . $script_suffix,
			$deps['scripts'] ?? [],
			filemtime( ABT_ROOT_PATH . $script_suffix ),
			true
		);
		if ( in_array( 'wp-i18n', $deps['scripts'] ?? [], true ) ) {
			wp_set_script_translations(
				$handle,
				'academic-bloggers-toolkit',
				basename( ABT_ROOT_PATH ) . '/languages'
			);
		}
	}
}
