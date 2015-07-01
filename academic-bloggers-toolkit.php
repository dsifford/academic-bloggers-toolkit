<?php 

/*
 *	Plugin Name: Academic Blogger's Toolkit
 *  Plugin URI: null
 *	Description: A Wordpress plugin extending the functionality of Wordpress for Academic Blogging
 *	Version: 1.0
 *	Author: Derek P Sifford
 *	Author URI: http://www.twitter.com/flightmed1
 *	License: GPL3
 *	License URI: https://www.gnu.org/licenses/gpl-3.0.html
*/

// Assign Global Variables

$plugin_url = WP_PLUGIN_URL . '/academic-bloggers-toolkit';
$options = array();


// Enqueue Stylesheets

function abt_enqueue_styles() {

	wp_enqueue_style( 'abt_shortcodes_stylesheet', plugins_url('academic-bloggers-toolkit/inc/css/shortcodes.css') );

}
add_action( 'wp_enqueue_scripts', 'abt_enqueue_styles');


// Tidy Requires

require('inc/shortcodes.php');
require('inc/tinymce-init.php');
require('inc/peer-review.php');
require('inc/options-page.php');


?>