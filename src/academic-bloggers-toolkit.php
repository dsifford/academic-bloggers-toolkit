<?php
/**
 * Plugin Name: Academic Blogger's Toolkit
 * Plugin URI: https://github.com/dsifford/academic-bloggers-toolkit/
 * Description: A plugin extending the functionality of WordPress for academic blogging
 * Version: {{VERSION}}
 * Author: Derek P Sifford
 * Author URI: https://github.com/dsifford
 * License: GPL3 or later.
 * License URI: https://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain: academic-bloggers-toolkit
 * Domain Path: /languages
 *
 * @package ABT
 */

namespace ABT;

defined( 'ABSPATH' ) || exit;

define( 'ABT_VERSION', '{{VERSION}}' );
define( 'ABT_ROOT_URI', plugins_url( '', __FILE__ ) );
define( 'ABT_ROOT_PATH', dirname( __FILE__ ) );
define( 'ABT_OPTIONS_KEY', 'abt_options' );

/**
 * Load plugin translations.
 */
function textdomain() {
	load_plugin_textdomain( 'academic-bloggers-toolkit', false, basename( ABT_ROOT_PATH ) . '/languages' );
}
add_action( 'plugins_loaded', __NAMESPACE__ . '\textdomain' );

/**
 * Adds .csl files to the accepted mime types for WordPress.
 *
 * @param string[] $mimes Existing mime types.
 *
 * @return string[] Existing mime types + csl
 */
function enable_csl_mime( $mimes ) {
	$mimes['csl'] = 'text/xml';
	return $mimes;
}
add_filter( 'upload_mimes', __NAMESPACE__ . '\enable_csl_mime' );


/**
 * Cleans up options during uninstall.
 */
function uninstall() {
	delete_option( ABT_OPTIONS_KEY );
}
if ( function_exists( 'register_uninstall_hook' ) ) {
	register_uninstall_hook( __FILE__, 'ABT\uninstall' );
}


/**
 * Refactors the defined plugin options.
 *
 * Current schema configuration can be found here:
 * http://www.jsoneditoronline.org/?id=8f65b4f64daaf41e5ed94c4a006ba264
 */
function refactor_options() {
	$options = get_option( ABT_OPTIONS_KEY );
	if ( version_compare( ABT_VERSION, $options['VERSION'], '<=' ) ) {
		return;
	}

	$new_options = [];

	$new_options['citation_style'] = [
		'kind'  => isset( $options['citation_style']['kind'] ) ? $options['citation_style']['kind'] : 'predefined',
		'label' => isset( $options['citation_style']['label'] ) ? $options['citation_style']['label'] : 'American Medical Association',
		'value' => isset( $options['citation_style']['id'] ) ? $options['citation_style']['id'] : 'american-medical-association',
	];

	$new_options['custom_css'] = ! empty( $options['custom_css'] ) ? $options['custom_css'] : '';

	$new_options['display_options'] = [
		'bibliography'      => ! empty( $options['display_options']['bibliography'] ) ? $options['display_options']['bibliography'] : 'fixed',
		'links'             => ! empty( $options['display_options']['links'] ) ? $options['display_options']['links'] : 'always',
		'bib_heading'       => ! empty( $options['display_options']['bib_heading'] ) ? $options['display_options']['bib_heading'] : '',
		'bib_heading_level' => ! empty( $options['display_options']['bib_heading_level'] ) ? $options['display_options']['bib_heading_level'] : 'h3',
	];

	$new_options['VERSION'] = ABT_VERSION;

	update_option( ABT_OPTIONS_KEY, $new_options );
}
add_action( 'admin_init', __NAMESPACE__ . '\refactor_options' );


/**
 * Adds link on the plugin page to the options page.
 *
 * @param string[] $links array of links.
 */
function add_options_link( $links ) {
	$url  = admin_url( 'options-general.php?page=abt-options' );
	$text = __( 'Plugin Settings', 'academic-bloggers-toolkit' );
	return array_merge( $links, [ "<a href='$url'>$text</a>" ] );
}
add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), __NAMESPACE__ . '\add_options_link' );


/**
 * Adds donation link to the plugin meta.
 *
 * @param mixed[] $links The array having default links for the plugin.
 * @param string  $file  The name of the plugin file.
 */
function add_donate_link( $links, $file ) {
	if ( plugin_basename( __FILE__ ) === $file ) {
		$links[] = sprintf(
			'&hearts; <a href="%s">%s</a>',
			'https://donorbox.org/academic-bloggers-toolkit',
			__( 'Donate', 'academic-bloggers-toolkit' )
		);
	}
	return $links;
}
add_filter( 'plugin_row_meta', __NAMESPACE__ . '\add_donate_link', 10, 2 );


/**
 * Enqueues frontend JS and CSS.
 */
function frontend_enqueues() {
	$options    = get_option( ABT_OPTIONS_KEY );
	$custom_css = wp_kses( $options['custom_css'], [ "\'", '\"' ] );

	wp_enqueue_style( 'abt-frontend-styles', ABT_ROOT_URI . '/bundle/frontend.css', [], ABT_VERSION );
	if ( isset( $custom_css ) && ! empty( $custom_css ) ) {
		wp_add_inline_style( 'abt-frontend-styles', $custom_css );
	}

	if ( is_singular() ) {
		wp_enqueue_script( 'abt-frontend-script', ABT_ROOT_URI . '/bundle/frontend.js', [], ABT_VERSION, true );
	}
}
add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\frontend_enqueues' );

/**
 * Registers 3rd party or vendored scripts/styles
 */
function register_third_party_scripts() {
	wp_register_style(
		'abt-fonts',
		add_query_arg(
			[
				'family' => 'Roboto:300,400,500,700',
				'subset' => 'cyrillic,cyrillic-ext,greek,greek-ext,latin-ext,vietnamese',
			],
			'//fonts.googleapis.com/css'
		),
		[],
		ABT_VERSION
	);

	wp_register_script( 'codepen', '//assets.codepen.io/assets/embed/ei.js', [], ABT_VERSION, true );
	wp_register_script( 'citeproc', '//cdn.jsdelivr.net/gh/Juris-M/citeproc-js@1/citeproc.min.js', [], ABT_VERSION, true );
}
add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\register_third_party_scripts', 5 );
add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\register_third_party_scripts', 5 );

/**
 * Grabs the citation styles from the vendor array, decodes the JSON to an
 * associative array and return it.
 */
function get_citation_styles() {
	return json_decode(
		// Ignoring the `file_get_contents` warning here because it's a misfire.
		// the warning is meant for flagging remote calls. This is a local file.
		// phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
		file_get_contents( ABT_ROOT_PATH . '/vendor/citation-styles.json' ),
		true
	);
}

require_once __DIR__ . '/php/utils.php';
require_once __DIR__ . '/php/admin.php';
require_once __DIR__ . '/php/dom-injects.php';
require_once __DIR__ . '/php/class-backend.php';
require_once __DIR__ . '/php/class-options.php';
require_once __DIR__ . '/php/endpoints.php';
