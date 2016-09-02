<?php

/*
 *	Plugin Name: Academic Blogger's Toolkit
 *	Plugin URI: https://wordpress.org/plugins/academic-bloggers-toolkit/
 *	Description: A plugin extending the functionality of Wordpress for academic blogging
 *	Version: 4.2.0
 *	Author: Derek P Sifford
 *	Author URI: https://github.com/dsifford
 *	License: GPL3 or later
 *  Text Domain: academic-bloggers-toolkit
 */

define('ABT_VERSION', '4.2.0');


/**
 * Adds .csl files to the accepted mime types for WordPress
 * @param  [array] $mimes Existing mime types
 * @return [array]        Existing mime types + csl
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
function abt_refactor_depreciated_options() {
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
    ];

    $newOptions
    ['VERSION'] = ABT_VERSION;

    update_option('abt_options', $newOptions);
}
add_action('admin_init', 'abt_refactor_depreciated_options');


/**
 * Adds link on the plugin page to the options page.
 * @param [array] $links Array of links
 */
function abt_add_options_link ($links) {
    $url = admin_url('options-general.php?page=abt-options');
    $text = __('Plugin Settings', 'academic-bloggers-toolkit');
	$abt_links = [
        "<a href='$url'>$text</a>",
	];
	return array_merge($links, $abt_links);
}
add_filter('plugin_action_links_' . plugin_basename(__FILE__), 'abt_add_options_link');


/**
 * Appends the changelog script to the document footer on the editor pages
 */
function abt_append_changelog_script() {
    global $pagenow, $post_type;

    $not_editor_page = !in_array($pagenow, ['post.php', 'post-new.php']);
    $invalid_post_type = in_array($post_type, ['attachment', 'acf']);

    if ($not_editor_page || $invalid_post_type) return;

    echo '<script type="text/javascript">var el=document.createElement("SPAN");el.id="abt_changelog",document.querySelector("#abt_reflist > h2").appendChild(el);var HW_config={selector:"#abt_changelog",account:"LJ4gE7"};</script><script async src="//cdn.headwayapp.co/widget.js"></script>';
}
add_action('admin_footer', 'abt_append_changelog_script');


/**
 * Adds CSS overrides
 */
function abt_css_override(){
	$abt_options = get_option('abt_options');
	if (isset($abt_options['custom_css']) && !empty($abt_options['custom_css'])) {
		$custom_css = $abt_options['custom_css'];
		echo "<style id='custom_css'>$custom_css\r\n</style>";
	}
}
add_action('wp_head', 'abt_css_override');


/**
 * Enqueues frontend JS and CSS
 */
function abt_frontend_scripts() {
    wp_enqueue_style('dashicons');
	wp_enqueue_style('abt_frontend_styles', plugins_url('academic-bloggers-toolkit/lib/css/frontend.css'), ['dashicons'], ABT_VERSION);

    if (is_singular()) {
        wp_enqueue_script('abt-bundle', plugins_url('academic-bloggers-toolkit/vendor/vendor.bundle.js'), [], ABT_VERSION);
        wp_enqueue_script('abt_frontend_js', plugins_url('academic-bloggers-toolkit/lib/js/Frontend.js'), ['abt-bundle'], ABT_VERSION);
    }
}
add_action('wp_enqueue_scripts', 'abt_frontend_scripts');


require_once('lib/php/backend.php');
require_once('lib/php/options-page.php');

?>
