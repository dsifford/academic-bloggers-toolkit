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
    ?>
    <script type="text/javascript">var el=document.createElement("SPAN");el.id="abt_changelog",document.querySelector("#abt_reflist > h2").appendChild(el);var HW_config={selector:"#abt_changelog",account:"LJ4gE7"};</script><script async src="//cdn.headwayapp.co/widget.js"></script>
    <?php
}
add_action('admin_footer', 'abt_append_changelog_script');

/**
 * Appends the Rollbar script (allows for distrubuted error reporting)
 */
function abt_append_rollbar_script() {
    global $pagenow, $post_type, $current_user;

    $not_editor_page = !in_array($pagenow, ['post.php', 'post-new.php']);
    $invalid_post_type = in_array($post_type, ['attachment', 'acf']);

    if ($not_editor_page || $invalid_post_type) return;

    $site_name = get_bloginfo();
    $url = get_bloginfo('url');
    $phpversion = phpversion();
    $user_name = $current_user->display_name;
    $user_email = $current_user->user_email;
    $theme = get_template();
    $plugins = wp_json_encode(get_option('active_plugins'));
    $jsvar = "Rollbar.configure({
        payload: {
            site: {
                name: '$site_name',
                php_version: '$phpversion',
                plugins: $plugins,
                theme: '$theme',
                url: '$url',
            },
            user: {
                name: '$user_name',
                email: '$user_email',
            },
        },
    });";
    ?>
    <script id="rollbar-config" type="text/javascript">
    var _rollbarConfig = {
        accessToken: "d4a261f761fb47ecaef17670b3c59f32",
        captureUncaught: false,
        payload: {
            environment: "test"
        }
    };
    !function(r){function e(t){if(o[t])return o[t].exports;var n=o[t]={exports:{},id:t,loaded:!1};return r[t].call(n.exports,n,n.exports,e),n.loaded=!0,n.exports}var o={};return e.m=r,e.c=o,e.p="",e(0)}([function(r,e,o){"use strict";var t=o(1).Rollbar,n=o(2);_rollbarConfig.rollbarJsUrl=_rollbarConfig.rollbarJsUrl||"https://d37gvrvc0wt4s1.cloudfront.net/js/v1.9/rollbar.min.js";var a=t.init(window,_rollbarConfig),i=n(a,_rollbarConfig);a.loadFull(window,document,!_rollbarConfig.async,_rollbarConfig,i)},function(r,e){"use strict";function o(r){return function(){try{return r.apply(this,arguments)}catch(e){try{console.error("[Rollbar]: Internal error",e)}catch(o){}}}}function t(r,e,o){window._rollbarWrappedError&&(o[4]||(o[4]=window._rollbarWrappedError),o[5]||(o[5]=window._rollbarWrappedError._rollbarContext),window._rollbarWrappedError=null),r.uncaughtError.apply(r,o),e&&e.apply(window,o)}function n(r){var e=function(){var e=Array.prototype.slice.call(arguments,0);t(r,r._rollbarOldOnError,e)};return e.belongsToShim=!0,e}function a(r){this.shimId=++c,this.notifier=null,this.parentShim=r,this._rollbarOldOnError=null}function i(r){var e=a;return o(function(){if(this.notifier)return this.notifier[r].apply(this.notifier,arguments);var o=this,t="scope"===r;t&&(o=new e(this));var n=Array.prototype.slice.call(arguments,0),a={shim:o,method:r,args:n,ts:new Date};return window._rollbarShimQueue.push(a),t?o:void 0})}function l(r,e){if(e.hasOwnProperty&&e.hasOwnProperty("addEventListener")){var o=e.addEventListener;e.addEventListener=function(e,t,n){o.call(this,e,r.wrap(t),n)};var t=e.removeEventListener;e.removeEventListener=function(r,e,o){t.call(this,r,e&&e._wrapped?e._wrapped:e,o)}}}var c=0;a.init=function(r,e){var t=e.globalAlias||"Rollbar";if("object"==typeof r[t])return r[t];r._rollbarShimQueue=[],r._rollbarWrappedError=null,e=e||{};var i=new a;return o(function(){if(i.configure(e),e.captureUncaught){i._rollbarOldOnError=r.onerror,r.onerror=n(i);var o,a,c="EventTarget,Window,Node,ApplicationCache,AudioTrackList,ChannelMergerNode,CryptoOperation,EventSource,FileReader,HTMLUnknownElement,IDBDatabase,IDBRequest,IDBTransaction,KeyOperation,MediaController,MessagePort,ModalWindow,Notification,SVGElementInstance,Screen,TextTrack,TextTrackCue,TextTrackList,WebSocket,WebSocketWorker,Worker,XMLHttpRequest,XMLHttpRequestEventTarget,XMLHttpRequestUpload".split(",");for(o=0;o<c.length;++o)a=c[o],r[a]&&r[a].prototype&&l(i,r[a].prototype)}return e.captureUnhandledRejections&&(i._unhandledRejectionHandler=function(r){var e=r.reason,o=r.promise,t=r.detail;!e&&t&&(e=t.reason,o=t.promise),i.unhandledRejection(e,o)},r.addEventListener("unhandledrejection",i._unhandledRejectionHandler)),r[t]=i,i})()},a.prototype.loadFull=function(r,e,t,n,a){var i=function(){var e;if(void 0===r._rollbarPayloadQueue){var o,t,n,i;for(e=new Error("rollbar.js did not load");o=r._rollbarShimQueue.shift();)for(n=o.args,i=0;i<n.length;++i)if(t=n[i],"function"==typeof t){t(e);break}}"function"==typeof a&&a(e)},l=!1,c=e.createElement("script"),d=e.getElementsByTagName("script")[0],p=d.parentNode;c.crossOrigin="",c.src=n.rollbarJsUrl,c.async=!t,c.onload=c.onreadystatechange=o(function(){if(!(l||this.readyState&&"loaded"!==this.readyState&&"complete"!==this.readyState)){c.onload=c.onreadystatechange=null;try{p.removeChild(c)}catch(r){}l=!0,i()}}),p.insertBefore(c,d)},a.prototype.wrap=function(r,e){try{var o;if(o="function"==typeof e?e:function(){return e||{}},"function"!=typeof r)return r;if(r._isWrap)return r;if(!r._wrapped){r._wrapped=function(){try{return r.apply(this,arguments)}catch(e){throw e._rollbarContext=o()||{},e._rollbarContext._wrappedSource=r.toString(),window._rollbarWrappedError=e,e}},r._wrapped._isWrap=!0;for(var t in r)r.hasOwnProperty(t)&&(r._wrapped[t]=r[t])}return r._wrapped}catch(n){return r}};for(var d="log,debug,info,warn,warning,error,critical,global,configure,scope,uncaughtError,unhandledRejection".split(","),p=0;p<d.length;++p)a.prototype[d[p]]=i(d[p]);r.exports={Rollbar:a,_rollbarWindowOnError:t}},function(r,e){"use strict";r.exports=function(r,e){return function(o){if(!o&&!window._rollbarInitialized){var t=window.RollbarNotifier,n=e||{},a=n.globalAlias||"Rollbar",i=window.Rollbar.init(n,r);i._processShimQueue(window._rollbarShimQueue||[]),window[a]=i,window._rollbarInitialized=!0,t.processPayloads()}}}}]);
    <?php echo $jsvar; ?>
    </script>
    <?php
}
add_action('admin_head', 'abt_append_rollbar_script', 1);

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
require_once('lib/php/endpoints.php');

?>
