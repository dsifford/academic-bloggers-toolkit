<?php

/*
 *	Plugin Name: Academic Blogger's Toolkit
 *	Plugin URI: https://wordpress.org/plugins/academic-bloggers-toolkit/
 *	Description: A plugin extending the functionality of Wordpress for academic blogging
 *	Version: 3.0.0
 *	Author: Derek P Sifford
 *	Author URI: https://github.com/dsifford
 *	License: GPL3 or later
 */

// Assign Global Variables

$plugin_url = WP_PLUGIN_URL . '/academic-bloggers-toolkit';
$abt_options = array();


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
	wp_enqueue_style( 'abt_frontend_styles', plugins_url('academic-bloggers-toolkit/lib/css/frontend.css') );
	wp_register_script('abt_frontend_js', plugins_url('academic-bloggers-toolkit/lib/js/frontend.js') );
	wp_enqueue_script( 'abt_frontend_js' );
}
add_action('wp_enqueue_scripts', 'abt_enqueue_frontend_scripts');


function abt_enqueue_admin_scripts($hook) {
    if ($hook == 'page.php' || $hook == 'post.php' || $hook == 'post-new.php') {
        wp_enqueue_style('abt_styles', plugins_url('academic-bloggers-toolkit/lib/css/admin.css'));
    }
}
add_action('admin_enqueue_scripts', 'abt_enqueue_admin_scripts');


// Tidy Requires
require('lib/shortcodes.php');
require('lib/peer-review.php');
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
