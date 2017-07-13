<?php

/**
 *	Plugin Name: Academic Blogger's Toolkit
 *	Plugin URI: https://wordpress.org/plugins/academic-bloggers-toolkit/
 *	Description: A plugin extending the functionality of Wordpress for academic blogging
 *	Version: 4.10.0
 *	Author: Derek P Sifford
 *	Author URI: https://github.com/dsifford
 *	License: GPL3 or later
 *  Text Domain: academic-bloggers-toolkit
 */

define('ABT_VERSION', '4.10.0');
define('ABT_ROOT_URI', plugin_dir_url(__FILE__));

/**
 * Load plugin translations
 */
function abt_load_plugin_textdomain() {
    load_plugin_textdomain('academic-bloggers-toolkit', false, dirname(plugin_basename(__FILE__)) . '/languages');
}
add_action('plugins_loaded', 'abt_load_plugin_textdomain');

/**
 * Adds .csl files to the accepted mime types for WordPress
 * @param  string[] $mimes Existing mime types
 * @return string[]        Existing mime types + csl
 */
function enable_csl_mime($mimes) {
    $mimes['csl'] = 'text/xml';
    return $mimes;
}
add_filter('upload_mimes', 'enable_csl_mime');


/**
 * Cleans up options during uninstall
 */
function abt_uninstall() {
    delete_option('abt_options');
}
if (function_exists('register_uninstall_hook')) {
    register_uninstall_hook(__FILE__, 'abt_uninstall');
}


/**
 * Refactors the defined plugin options
 *
 * Current schema configuration can be found here:
 *   http://www.jsoneditoronline.org/?id=8f65b4f64daaf41e5ed94c4a006ba264
 */
function abt_refactor_deprecated_options() {
    $options = get_option('abt_options');
    if ($options['VERSION'] === ABT_VERSION) return;

    $newOptions = [];

    $newOptions
    ['citation_style'] = [
        'prefer_custom' => isset($options['citation_style']['prefer_custom']) ? $options['citation_style']['prefer_custom'] : false,
        'style' => (isset($options['citation_style']['style']) ? $options['citation_style']['style'] : (isset($options['abt_citation_style']) ? $options['abt_citation_style'] : 'american-medical-association')),
        'custom_url' => isset($options['citation_style']['custom_url']) ? $options['citation_style']['custom_url'] : '',
    ];

    $newOptions
    ['custom_css'] = isset($options['custom_css']) ? $options['custom_css'] : '';

    $newOptions
    ['display_options'] = [
        'bibliography' => isset($options['display_options']['bibliography']) ? $options['display_options']['bibliography'] : 'fixed',
        'links'        => isset($options['display_options']['links']) ? $options['display_options']['links'] : 'always',
        'bib_heading'  => isset($options['display_options']['bib_heading']) ? $options['display_options']['bib_heading'] : '',
        'bib_heading_level' => isset($options['display_options']['bib_heading_level']) ? $options['display_options']['bib_heading_level'] : 'h3',
    ];

    $newOptions
    ['VERSION'] = ABT_VERSION;

    update_option('abt_options', $newOptions);
}
add_action('admin_init', 'abt_refactor_deprecated_options');


/**
 * Adds link on the plugin page to the options page.
 * @param string[] $links Array of links
 */
function abt_add_options_link($links) {
    $url = admin_url('options-general.php?page=abt-options');
    $text = __('Plugin Settings', 'academic-bloggers-toolkit');
    $abt_links = [
        "<a href='$url'>$text</a>",
    ];
    return array_merge($links, $abt_links);
}
add_filter('plugin_action_links_' . plugin_basename(__FILE__), 'abt_add_options_link');


/**
 * Adds donation link to the plugin meta
 */
function abt_add_donate_link( $plugin_meta, $plugin_file ) {
    if (plugin_basename( __FILE__ ) == $plugin_file) {
        $plugin_meta[] = sprintf(
            '&hearts; <a href="%s">%s</a>',
            'https://donorbox.org/academic-bloggers-toolkit',
            __( 'Donate', 'academic-bloggers-toolkit' )
        );
    }
    return $plugin_meta;
}
add_filter('plugin_row_meta', 'abt_add_donate_link', 10, 2);


/**
 * Enqueues frontend JS and CSS
 */
function abt_frontend_scripts() {
    wp_enqueue_style('dashicons');
    wp_enqueue_style('abt_frontend_styles', ABT_ROOT_URI . '/css/frontend.css', ['dashicons'], ABT_VERSION);

    if (is_singular()) {
        // wp_enqueue_script('abt-bundle', __DIR__ . '/vendor/vendor.bundle.js', [], ABT_VERSION, true);
        wp_enqueue_script('abt_frontend_js', ABT_ROOT_URI . '/js/frontend.js', [/*'abt-bundle'*/], ABT_VERSION, true);
    }
}
add_action('wp_enqueue_scripts', 'abt_frontend_scripts');

require_once(__DIR__ . '/php/dom-injects.php');
require_once(__DIR__ . '/php/backend.php');
require_once(__DIR__ . '/php/options-page.php');
require_once(__DIR__ . '/php/endpoints.php');

?>
