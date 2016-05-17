<?php

/*
 *	Plugin Name: Academic Blogger's Toolkit
 *	Plugin URI: https://wordpress.org/plugins/academic-bloggers-toolkit/
 *	Description: A plugin extending the functionality of Wordpress for academic blogging
 *	Version: 3.1.5
 *	Author: Derek P Sifford
 *	Author URI: https://github.com/dsifford
 *	License: GPL3 or later
 *  Text Domain: academic-bloggers-toolkit
 */

// Assign Global Variables

$plugin_url = WP_PLUGIN_URL . '/academic-bloggers-toolkit';
$abt_options = array();


function abt_add_options_link ($links) {
	$mylinks = array(
		'<a href="' . admin_url( 'options-general.php?page=abt-options' ) . '">' . __('Plugin Settings', 'academic-bloggers-toolkit') . '</a>',
	);
	return array_merge($links, $mylinks);
}
add_filter('plugin_action_links_' . plugin_basename(__FILE__), 'abt_add_options_link');

function abt_css_override(){
	$abt_options = get_option( 'abt_options' );
	$custom_css = '';
	if ( isset ($abt_options['custom_css']) && !empty($abt_options['custom_css']) ) {
		$custom_css .= $abt_options['custom_css']."\r\n";
		echo '<style id="custom_css">' . $custom_css . '</style>';
	}
}
add_action('wp_head', 'abt_css_override');


function abt_enqueue_frontend_scripts() {
	wp_enqueue_style( 'dashicons' );
	wp_enqueue_style( 'abt_frontend_styles', plugins_url('academic-bloggers-toolkit/lib/css/frontend.css'), 'dashicons' );
	wp_enqueue_script('abt_frontend_js', plugins_url('academic-bloggers-toolkit/lib/js/Frontend.js') );
	wp_localize_script('abt_frontend_js', 'ABT_Options', get_option('abt_options'));
}
add_action('wp_enqueue_scripts', 'abt_enqueue_frontend_scripts');


function abt_enqueue_admin_scripts($hook) {
    if ($hook == 'page.php' || $hook == 'post.php' || $hook == 'post-new.php') {
        wp_enqueue_style('abt_styles', plugins_url('academic-bloggers-toolkit/lib/css/admin.css'));
    }
}
add_action('admin_enqueue_scripts', 'abt_enqueue_admin_scripts');


// Tidy Requires
require('lib/backend.php');
require('lib/options-page.php');


// Uninstall Hook - Clean database of Plugin entries
function abt_uninstall() {
	delete_option( 'abt_citation_options' );
	delete_option( 'abt_css_options' );
	delete_option( 'abt_options' );
}
if ( function_exists('register_uninstall_hook') ) {
	register_uninstall_hook(__FILE__, 'abt_uninstall');
}

?>
