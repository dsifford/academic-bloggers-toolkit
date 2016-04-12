<?php


function call_abt_tinymce_buttons() {
    new ABT_TinyMCE_Buttons();
}

if (is_admin()) {
    add_action('load-post.php', 'call_abt_tinymce_buttons');
    add_action('load-post-new.php', 'call_abt_tinymce_buttons');
}


/**
 * Responsible for rendering all TinyMCE components
 *
 * @since 2.5.0
 */
class ABT_TinyMCE_Buttons {

    public function __construct() {
        add_action('admin_head', array($this, 'init_tinymce_button'));
    }

    public function init_tinymce_button() {

        if (!current_user_can('edit_posts') && !current_user_can('edit_pages')) {
            return;
        }

        // Check if WYSIWYG is enabled
        if ('true' == get_user_option('rich_editing')) {
            add_filter('mce_external_plugins', array($this, 'register_plugin'));
            add_filter('mce_buttons', array($this, 'register_buttons'));
        }
    }

    public function register_plugin($plugin_array) {
        $plugin_array['abt_main_menu'] = plugins_url('academic-bloggers-toolkit/inc/js/tinymce-entrypoint.js');
        $plugin_array['abt_generate_references'] = plugins_url('academic-bloggers-toolkit/inc/js/tinymce-entrypoint.js');
        return $plugin_array;
    }

    public function register_buttons($buttons) {
        array_push($buttons, 'abt_generate_references', 'abt_main_menu');
        return $buttons;
    }

}
