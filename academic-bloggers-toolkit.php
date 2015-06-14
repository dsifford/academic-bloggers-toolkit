<?php 

/*
 *	Plugin Name: Academic Blogger's Toolkit
 *  Plugin URI: http://google.com/
 *	Description: A Wordpress plugin extending the functionality of Wordpress for Academic Blogging
 *	Version: 1.0
 *	Author: Derek P Sifford
 *	Author URI: http://www.twitter.com/flightmed1
 *	License: GPL3
 *	License URI: https://www.gnu.org/licenses/gpl-3.0.html
*/



/*
 *
 *	TODO:
 *	- Citations Shortcode with TinyMCE Integration
 *	- Pubmed PMID/DOI/PMCID Shortcode that converts to formatted citation
 *	- And much more.....
 *
*/


/*
 *
 * Assign Global Variables
 *
*/

$plugin_url = WP_PLUGIN_URL . '/academic-bloggers-toolkit';


/*
 *
 *	Enqueue Styles
 *
*/


function abt_enqueue_styles() {

	wp_enqueue_style( 'abt_shortcodes_stylesheet', plugins_url('academic-bloggers-toolkit/inc/shortcodes.css') );

}
add_action( 'wp_enqueue_scripts', 'abt_enqueue_styles');


// Register Custom Shortcodes with wordpress

require('inc/shortcodes.php');


?>