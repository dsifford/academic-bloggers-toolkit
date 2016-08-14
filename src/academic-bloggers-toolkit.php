<?php

/*
 *	Plugin Name: Academic Blogger's Toolkit
 *	Plugin URI: https://wordpress.org/plugins/academic-bloggers-toolkit/
 *	Description: A plugin extending the functionality of Wordpress for academic blogging
 *	Version: 3.4.3
 *	Author: Derek P Sifford
 *	Author URI: https://github.com/dsifford
 *	License: GPL3 or later
 *  Text Domain: academic-bloggers-toolkit
 */

$ABT_VERSION = '3.4.3';

/**
 * Update notification for breaking changes.
 */
function abt_update_notification() {
    global $ABT_VERSION;
    $options = get_option('abt_options');
    if ($options['VERSION'] && $options['VERSION'] === $ABT_VERSION) return;
    $options['VERSION'] = $ABT_VERSION;
    update_option('abt_options', $options);
    ?>
    <div class="notice notice-warning is-dismissible">
        <h2>Warning: Breaking Changes!</h2>
        <p>This update <strong>fully depreciates</strong> the Peer Review component of this plugin.</p>
        <p><strong>Why is this going away?</strong><br />The way that the peer review component works is fundamentally against the beliefs of this plugin. Specifically, the belief that no plugin should become a dependency to a WordPress installation after its use. Unfortunately, the peer review component does just that. Uninstalling this plugin after using the peer review component will cause all peer reviews to vanish. This is not okay, and I apologise for this oversight.</p>
        <p><strong>What does this mean for you?</strong><br/>Unfortunately, if you have invested any length of time in using the peer review boxes, you are now dependent on <a href='https://github.com/dsifford/abt-depreciated-peer-review' target='_blank'>this add-on plugin</a>, which can be installed by following the directions on that page.</p>
        <p><strong>Will a better form of peer review component ever return?</strong><br />Right now, it's too early to know for sure. The dynamics of how that component works is, at its core, fundamentally broken. It should be the responsibility of the <em>reviewer</em>, not the post author, to complete and attach peer reviews. If anybody has any ideas on a better workflow for managing peer reviews, feel free to reach out to me by creating an issue in the <a href='https://github.com/dsifford/academic-bloggers-toolkit' target='_blank'>main GitHub repository</a>. I'd be happy to talk about it.
        <p><strong>You're a monster, and you violated my trust!</strong><br />I apologize for the inconvenience. I tried for a few days to make something better from what we currently have but, at the end of the day, it's just too broken.
        <p>Again, sorry for the inconvenience this may cause. Now that I'm able to focus my attention on the reference list, stay tuned for further stability improvements and new features. As always, feel free to contact me with any comments, questions, or suggestions.</p>
        <p>Respectfully,<br />Derek P Sifford</p>
    </div>
    <?php
}
add_action('admin_notices', 'abt_update_notification');


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
    global $ABT_VERSION;
	wp_enqueue_style('abt_frontend_styles', plugins_url('academic-bloggers-toolkit/lib/css/frontend.css'), [], $ABT_VERSION);

    if (is_singular()) {
        wp_enqueue_script('abt_frontend_js', plugins_url('academic-bloggers-toolkit/lib/js/Frontend.js'), [], $ABT_VERSION);
    }
}
add_action('wp_enqueue_scripts', 'abt_frontend_scripts');

require_once('lib/php/backend.php');
require_once('lib/php/options-page.php');

?>
