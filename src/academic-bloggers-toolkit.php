<?php

/*
 *	Plugin Name: Academic Blogger's Toolkit
 *	Plugin URI: https://wordpress.org/plugins/academic-bloggers-toolkit/
 *	Description: A plugin extending the functionality of Wordpress for academic blogging
 *	Version: 3.4.0
 *	Author: Derek P Sifford
 *	Author URI: https://github.com/dsifford
 *	License: GPL3 or later
 *  Text Domain: academic-bloggers-toolkit
 */

$ABT_VERSION = '3.4.0';

function abt_add_options_link ($links) {
    $url = admin_url('options-general.php?page=abt-options');
    $text = __('Plugin Settings', 'academic-bloggers-toolkit');
	$abt_links = [
        "<a href='$url'>$text</a>",
	];
	return array_merge($links, $abt_links);
}
add_filter('plugin_action_links_' . plugin_basename(__FILE__), 'abt_add_options_link');

function abt_css_override(){
	$abt_options = get_option('abt_options');
	if (isset($abt_options['custom_css']) && !empty($abt_options['custom_css'])) {
		$custom_css = $abt_options['custom_css'];
		echo "<style id='custom_css'>$custom_css\r\n</style>";
	}
}
add_action('wp_head', 'abt_css_override');

function abt_frontend_scripts() {
    global $ABT_VERSION;
    $abt_options = get_option('abt_options');
    wp_enqueue_style('dashicons');
	wp_enqueue_style('abt_frontend_styles', plugins_url('academic-bloggers-toolkit/lib/css/frontend.css'), ['dashicons'], $ABT_VERSION);

    if (is_singular()) {
        wp_enqueue_script('abt_frontend_js', plugins_url('academic-bloggers-toolkit/lib/js/Frontend.js'), [], $ABT_VERSION);
        wp_localize_script('abt_frontend_js', 'ABT_meta', [
            'prBoxStyle' => isset($abt_options['display_options']['PR_boxes']) ? $abt_options['display_options']['PR_boxes'] : null,
            'bibStyle' => isset($abt_options['display_options']['bibliography']) ? $abt_options['display_options']['bibliography'] : null
        ]);
    }
}
add_action('wp_enqueue_scripts', 'abt_frontend_scripts');


function abt_admin_scripts($hook) {
    global $ABT_VERSION;
    if ($hook == 'page.php' || $hook == 'post.php' || $hook == 'post-new.php') {
        wp_enqueue_style('abt_styles', plugins_url('academic-bloggers-toolkit/lib/css/admin.css'), [], $ABT_VERSION);
    }
}
add_action('admin_enqueue_scripts', 'abt_admin_scripts');

function abt_uninstall() {
	delete_option('abt_options');
}
if (function_exists('register_uninstall_hook')) {
	register_uninstall_hook(__FILE__, 'abt_uninstall');
}

require('lib/php/backend.php');
require('lib/php/options-page.php');

?>
