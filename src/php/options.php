<?php
/**
 * Options page functionality.
 *
 * @package ABT
 */

declare(strict_types=1);

namespace ABT\Options;

defined( 'ABSPATH' ) || exit;

use function ABT\Utils\get_citation_styles;

/**
 * Registers the plugin options page.
 */
function register_options_page() {
	add_options_page(
		__( "Academic Blogger's Toolkit Options", 'academic-bloggers-toolkit' ),
		__( "Academic Blogger's Toolkit", 'academic-bloggers-toolkit' ),
		'manage_options',
		'abt-options',
		__NAMESPACE__ . '\render_options_page'
	);
}
add_action( 'admin_menu', __NAMESPACE__ . '\register_options_page' );

/**
 * Enqueues options page scripts.
 *
 * @param string $hook The hook suffix of the page being loaded.
 */
function enqueue_scripts( string $hook ) {
	if ( 'settings_page_abt-options' !== $hook ) {
		return;
	}
	wp_enqueue_script( 'codepen' );
	wp_enqueue_style( 'abt-options-page' );
	wp_enqueue_script( 'abt-options-page' );
}
add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\enqueue_scripts' );

/**
 * Renders the options page.
 */
function render_options_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die(
			esc_html__(
				'You do not have sufficient permissions to access this page.',
				'academic-bloggers-toolkit'
			)
		);
	}

	$options = get_option( ABT_OPTIONS_KEY );

	if (
		isset( $_POST[ ABT_NONCE ], $_POST['citation_style'] ) &&
		wp_verify_nonce( sanitize_key( $_POST[ ABT_NONCE ] ), ABT_ACTIONS['SET_CITATION_STYLE'] )
	) {
		// Ignoring because there's no need to sanitize this.
		// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$options['citation_style'] = json_decode( wp_unslash( $_POST['citation_style'] ), true );
		update_option( ABT_OPTIONS_KEY, $options );
	}

	wp_localize_script(
		'abt-options-page',
		'ABT',
		[
			'styles'  => get_citation_styles(),
			'options' => $options,
		]
	);

	// Convert associative array to object because it's just easier to work with.
	$options = json_decode( wp_json_encode( $options ) );

	require_once __DIR__ . '/views/options-page.php';
}
