<?php

function call_abt_reference_box() {
    new ABT_Backend();
}


if (is_admin()) {
    add_action('load-post.php', 'call_abt_reference_box');
    add_action('load-post-new.php', 'call_abt_reference_box');
}


/**
 * Main Backend Class
 * @since 3.0.0
 */
class ABT_Backend {

    /**
     * Initiates the TinyMCE plugins, adds the reference list metabox, and enqueues backend JS.
     * @since 3.0.0
     */
    public function __construct() {
        add_action('admin_head', array($this, 'init_tinymce'));
        add_action('add_meta_boxes', array($this, 'add_metabox'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_js'));
    }

    public function add_metabox($post_type) {
        if ( in_array($post_type, array('post', 'page')) ) {
			add_meta_box(
				'abt_reflist',
				'Reference List',
				array($this, 'render_metabox'),
				'post',
				'side',
				'high'
			);
		}
    }

    public function render_metabox() {
        echo "<div id='abt-reflist' style='margin: 0 -12px -12px -12px;'></div>";
    }

    public function enqueue_js() {
        wp_register_script('abt_reflist', plugins_url('academic-bloggers-toolkit/lib/js/Reflist.js') );
        wp_register_script('abt_citeproc', plugins_url('academic-bloggers-toolkit/vendor/citeproc.js') );
        wp_enqueue_script( 'abt_citeproc', false, array(), false, true );
    	wp_enqueue_script( 'abt_reflist', false, array(), false, true );
    }

    public function init_tinymce() {

        if ('true' == get_user_option('rich_editing')) {
            add_filter('mce_external_plugins', array($this, 'register_tinymce_plugin'));
            add_filter('mce_buttons', array($this, 'register_tinymce_buttons'));
        }

    }

    public function register_tinymce_plugin($plugin_array) {
        $plugin_array['abt_main_menu'] = plugins_url('academic-bloggers-toolkit/lib/js/tinymce-entrypoint.js');
        $plugin_array['noneditable'] = plugins_url('academic-bloggers-toolkit/vendor/noneditable.js');
        return $plugin_array;
    }

    public function register_tinymce_buttons($buttons) {
        array_push($buttons, 'abt_main_menu');
        return $buttons;
    }

}







 ?>
