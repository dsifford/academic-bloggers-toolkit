<?php

/**
 *	Plugin Name: Academic Blogger's Toolkit
 *	Plugin URI: https://wordpress.org/plugins/academic-bloggers-toolkit/
 *	Description: A plugin extending the functionality of Wordpress for academic blogging
 *	Version: 4.11.2
 *	Author: Derek P Sifford
 *	Author URI: https://github.com/dsifford
 *  Text Domain: academic-bloggers-toolkit
 *	License: GPL3 or later.
 */

namespace ABT;

if (!defined('ABSPATH')) {
    exit(1);
}

define('ABT_VERSION', '4.11.2');
define('ABT_ROOT_URI', plugin_dir_url(__FILE__));
define('ABT_ROOT_PATH', plugin_dir_path(__FILE__));

/**
 * Load plugin translations.
 */
function textdomain() {
    load_plugin_textdomain('academic-bloggers-toolkit', false, dirname(plugin_basename(__FILE__)) . '/languages');
}
add_action('plugins_loaded', 'ABT\textdomain');

/**
 * Adds .csl files to the accepted mime types for WordPress.
 *
 * @param string[] $mimes Existing mime types
 *
 * @return string[] Existing mime types + csl
 */
function enable_csl_mime($mimes) {
    $mimes['csl'] = 'text/xml';
    return $mimes;
}
add_filter('upload_mimes', 'ABT\enable_csl_mime');


/**
 * Cleans up options during uninstall.
 */
function uninstall() {
    delete_option('abt_options');
}
if (function_exists('register_uninstall_hook')) {
    register_uninstall_hook(__FILE__, 'ABT\uninstall');
}


/**
 * Refactors the defined plugin options.
 *
 * Current schema configuration can be found here:
 * http://www.jsoneditoronline.org/?id=8f65b4f64daaf41e5ed94c4a006ba264
 */
function refactor_options() {
    $options = get_option('abt_options');
    if ($options['VERSION'] === ABT_VERSION) {
        return;
    }

    $newOptions = [];

    $newOptions['citation_style'] = [
        'prefer_custom' => isset($options['citation_style']['prefer_custom']) ? $options['citation_style']['prefer_custom'] : false,
        'style' => (!empty($options['citation_style']['style']) ? $options['citation_style']['style'] : (!empty($options['abt_citation_style']) ? $options['abt_citation_style'] : 'american-medical-association')),
        'custom_url' => !empty($options['citation_style']['custom_url']) ? $options['citation_style']['custom_url'] : '',
    ];

    $newOptions['custom_css'] = !empty($options['custom_css']) ? $options['custom_css'] : '';

    $newOptions['display_options'] = [
        'bibliography' => !empty($options['display_options']['bibliography']) ? $options['display_options']['bibliography'] : 'fixed',
        'links' => !empty($options['display_options']['links']) ? $options['display_options']['links'] : 'always',
        'bib_heading' => !empty($options['display_options']['bib_heading']) ? $options['display_options']['bib_heading'] : '',
        'bib_heading_level' => !empty($options['display_options']['bib_heading_level']) ? $options['display_options']['bib_heading_level'] : 'h3',
    ];

    $newOptions['VERSION'] = ABT_VERSION;

    update_option('abt_options', $newOptions);
}
add_action('admin_init', 'ABT\refactor_options');


/**
 * Adds link on the plugin page to the options page.
 *
 * @param string[] $links Array of links
 */
function add_options_link($links) {
    $url = admin_url('options-general.php?page=abt-options');
    $text = __('Plugin Settings', 'academic-bloggers-toolkit');
    return array_merge($links, ["<a href='$url'>$text</a>"]);
}
add_filter('plugin_action_links_' . plugin_basename(__FILE__), 'ABT\add_options_link');


/**
 * Adds donation link to the plugin meta.
 *
 * @param mixed[] $plugin_meta
 * @param string  $plugin_file
 */
function add_donate_link($plugin_meta, $plugin_file) {
    if (plugin_basename(__FILE__) === $plugin_file) {
        $plugin_meta[] = sprintf(
            '&hearts; <a href="%s">%s</a>',
            'https://donorbox.org/academic-bloggers-toolkit',
            __('Donate', 'academic-bloggers-toolkit')
        );
    }
    return $plugin_meta;
}
add_filter('plugin_row_meta', 'ABT\add_donate_link', 10, 2);


/**
 * Enqueues frontend JS and CSS.
 */
function frontend_enqueues() {
    wp_enqueue_style('abt-css', plugins_url('academic-bloggers-toolkit/css/frontend.css'), [], ABT_VERSION);

    if (is_singular()) {
        wp_enqueue_script('abt-frontend', plugins_url('academic-bloggers-toolkit/js/frontend.js'), [], ABT_VERSION, true);
    }
}
add_action('wp_enqueue_scripts', 'ABT\frontend_enqueues');

require_once __DIR__ . '/php/dom-injects.php';
require_once __DIR__ . '/php/backend.php';
require_once __DIR__ . '/php/options-page.php';
require_once __DIR__ . '/php/endpoints.php';
