<?php
/**
 * Options page functionality.
 *
 * @package ABT
 */

declare(strict_types=1);

namespace ABT\Options;

defined( 'ABSPATH' ) || exit;

use ABT\Form_Actions;
use function ABT\i18n\generate_translations;
use function ABT\Utils\{
	get_citation_styles,
	get_handle,
};

/**
 * Registers the plugin options page.
 */
function register_options_page(): void {
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
function enqueue_scripts( string $hook ): void {
	if ( 'settings_page_abt-options' !== $hook ) {
		return;
	}
	wp_enqueue_style( get_handle( 'options-page', 'style' ) );
	wp_enqueue_script( get_handle( 'options-page', 'script' ) );
	wp_enqueue_script( 'codepen' );
}
add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\enqueue_scripts' );

/**
 * Renders the options page.
 */
function render_options_page(): void {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die(
			esc_html__(
				'You do not have sufficient permissions to access this page.',
				'academic-bloggers-toolkit'
			)
		);
	}

	require_once __DIR__ . '/i18n.php';

	$options = get_option( ABT_OPTIONS_KEY );

	if (
		isset( $_POST[ ABT_NONCE ], $_POST['style_kind'], $_POST['style_label'], $_POST['style_value'] ) &&
		wp_verify_nonce( sanitize_key( $_POST[ ABT_NONCE ] ), Form_Actions::SET_CITATION_STYLE )
	) {
		$options['citation_style'] = [
			'kind'  => sanitize_key( wp_unslash( $_POST['style_kind'] ) ),
			'label' => sanitize_text_field( wp_unslash( $_POST['style_label'] ) ),
			// Ignoring because this can be XML and it's sanitized elsewhere.
			// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
			'value' => wp_unslash( $_POST['style_value'] ),
		];
		update_option( ABT_OPTIONS_KEY, $options );
	}

	wp_localize_script(
		get_handle( 'options-page', 'script' ),
		'ABT',
		[
			'styles'  => get_citation_styles(),
			'i18n'    => generate_translations(),
			'options' => $options,
		]
	);

	// Convert associative array to object because it's just easier to work with.
	$options = json_decode( wp_json_encode( $options ) );

	require_once __DIR__ . '/views/options-page.php';
}
