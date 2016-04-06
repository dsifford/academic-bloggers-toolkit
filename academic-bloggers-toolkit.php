<?php

/*
 *	Plugin Name: Academic Blogger's Toolkit
 *	Plugin URI: https://wordpress.org/plugins/academic-bloggers-toolkit/
 *	Description: A plugin extending the functionality of Wordpress for academic blogging
 *	Version: 2.4.1
 *	Author: Derek P Sifford
 *	Author URI: https://github.com/dsifford
 *	License: GPL3 or later
 */

// Assign Global Variables

$plugin_url = WP_PLUGIN_URL . '/academic-bloggers-toolkit';
$abt_options = array();


// Enqueue Stylesheets

function abt_enqueue_styles() {
	wp_enqueue_style( 'abt_frontend_styles', plugins_url('academic-bloggers-toolkit/inc/css/frontend.css') );
}
add_action( 'wp_enqueue_scripts', 'abt_enqueue_styles');

// Tidy Requires

require('inc/shortcodes.php');
require('inc/tinymce-init.php');
require('inc/peer-review.php');
require('inc/options-page.php');

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
