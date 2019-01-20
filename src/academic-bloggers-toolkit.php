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

declare(strict_types=1);

namespace ABT;

defined( 'ABSPATH' ) || exit;

define( 'ABT_NONCE', 'abt_nonce' );
define( 'ABT_OPTIONS_KEY', 'abt_options' );
define( 'ABT_ROOT_PATH', __DIR__ );
define( 'ABT_ROOT_URI', plugins_url( '', __FILE__ ) );
define( 'ABT_VERSION', '{{VERSION}}' );

require_once __DIR__ . '/php/utils.php';

use function ABT\Utils\register_script;

/**
 * Load plugin translations.
 */
function textdomain(): void {
	load_plugin_textdomain( 'academic-bloggers-toolkit', false, basename( ABT_ROOT_PATH ) . '/languages' );
}
add_action( 'plugins_loaded', __NAMESPACE__ . '\textdomain' );

/**
 * Cleans up options during uninstall.
 */
function uninstall(): void {
	delete_option( ABT_OPTIONS_KEY );
}
register_uninstall_hook( __FILE__, 'ABT\uninstall' );

/**
 * Refactors the defined plugin options.
 *
 * @link https://app.quicktype.io?share=E2qRt1Cg3TR6qmHbXDcY
 */
function refactor_options(): void {
	$options = get_option( ABT_OPTIONS_KEY );
	if ( version_compare( ABT_VERSION, $options['VERSION'] ?? '0', '>' ) ) {
		// Move custom css to customizer if it exists.
		if ( ! empty( $options['custom_css'] ) ) {
			wp_update_custom_css_post(
				wp_get_custom_css_post() . PHP_EOL .
				wp_kses( $options['custom_css'], [ "\'", '\"' ] )
			);
		}
		$new_options = [
			'VERSION'         => ABT_VERSION,
			'citation_style'  => [
				'kind'  => $options['citation_style']['kind'] ?? 'predefined',
				'label' => $options['citation_style']['label'] ?? 'American Medical Association',
				'value' => $options['citation_style']['value'] ?? 'american-medical-association',
			],
			// @deprecated 5.0.0
			'display_options' => [
				'bib_heading'       => $options['display_options']['bib_heading'] ?? '',
				'bib_heading_level' => $options['display_options']['bib_heading_level'] ?? 'h3',
				'bibliography'      => $options['display_options']['bibliography'] ?? 'fixed',
				'links'             => $options['display_options']['links'] ?? 'always',
			],
		];
		update_option( ABT_OPTIONS_KEY, $new_options );
	}
}
add_action( 'admin_init', __NAMESPACE__ . '\refactor_options' );

/**
 * Adds link on the plugin page to the options page.
 *
 * @param string[] $links array of links.
 */
function add_options_link( array $links ): array {
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
function add_donate_link( array $links, string $file ): array {
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
 * Adds an ajax nonce to pages that require it.
 */
function ajax_nonce(): void {
	?>
		<script type="text/javascript">
			var _abt_nonce = <?php echo wp_json_encode( wp_create_nonce( 'abt-ajax' ) ); ?>
		</script>
	<?php
}
add_action( 'load-post-new.php', __NAMESPACE__ . '\ajax_nonce' );
add_action( 'load-post.php', __NAMESPACE__ . '\ajax_nonce' );
add_action( 'load-settings_page_abt-options', __NAMESPACE__ . '\ajax_nonce' );

/**
 * Registers all scripts/styles used by this plugin.
 */
function register_scripts(): void {
	//
	// Admin.
	//
	register_script(
		'editor',
		[
			'scripts' => [
				'lodash',
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
				'wp-url',
			],
		]
	);
	register_script(
		'editor-blocks',
		[
			'scripts' => [
				'citeproc',
				'lodash',
				'wp-blocks',
				'wp-components',
				'wp-compose',
				'wp-data',
				'wp-editor',
				'wp-element',
				'wp-i18n',
				'wp-polyfill',
			],
		]
	);
	register_script(
		'editor-formats',
		[
			'scripts' => [
				'lodash',
				'wp-components',
				'wp-compose',
				'wp-data',
				'wp-editor',
				'wp-element',
				'wp-i18n',
				'wp-keycodes',
				'wp-polyfill',
				'wp-rich-text',
				'wp-rich-text',
				'wp-url',
			],
		]
	);
	register_script(
		'editor-stores',
		[
			'scripts' => [
				'citeproc',
				'lodash',
				'wp-blocks',
				'wp-data',
				'wp-polyfill',
			],
		]
	);

	register_script(
		'options-page',
		[
			'scripts' => [
				'wp-components',
				'wp-element',
				'wp-i18n',
				'wp-polyfill',
			],
		]
	);
	register_script(
		'editor-legacy',
		[
			'scripts' => [
				'citeproc',
				'lodash',
				'wp-dom-ready',
				'wp-element',
				'wp-i18n',
				'wp-polyfill',
			],
			'styles'  => [
				'abt-legacy-fonts',
				'dashicons',
			],
		]
	);

	//
	// Frontend.
	//
	register_script(
		'frontend',
		[
			'scripts' => [
				'wp-dom-ready',
				'wp-polyfill',
			],
		]
	);
	register_script(
		'frontend-legacy',
		[
			'scripts' => [
				'wp-dom-ready',
				'wp-polyfill',
			],
		]
	);

	//
	// Third party.
	//
	wp_register_style(
		'abt-legacy-fonts',
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
	wp_register_script(
		'codepen',
		'//assets.codepen.io/assets/embed/ei.js',
		[],
		ABT_VERSION,
		true
	);
	wp_register_script(
		'citeproc',
		'//cdn.jsdelivr.net/gh/Juris-M/citeproc-js@1/citeproc.min.js',
		[],
		ABT_VERSION,
		true
	);
}
add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\register_scripts', 5 );
add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\register_scripts', 5 );

require_once __DIR__ . '/php/class-form-actions.php';
require_once __DIR__ . '/php/endpoints.php';

if ( is_admin() ) {
	require_once __DIR__ . '/php/editor.php';
	require_once __DIR__ . '/php/editor-legacy.php';
	require_once __DIR__ . '/php/options.php';
} else {
	require_once __DIR__ . '/php/frontend.php';
}

