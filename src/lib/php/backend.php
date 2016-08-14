<?php

require_once(dirname(__FILE__) . '/i18n.php');

function call_abt_reference_box() {
    new ABT_Backend();
}

if (is_admin()) {
    add_action('load-post.php', 'call_abt_reference_box');
    add_action('load-post-new.php', 'call_abt_reference_box');
}

/**
 * Main Backend Class.
 */
class ABT_Backend {

    /**
     * Returns an array of citation styles from citationstyles.php
     */
    private function get_citation_styles() {
        include dirname(__FILE__) . '/../../vendor/citationstyles.php';
        return $citation_styles;
    }

    /**
     * Returns an array of a few select wordpress constants (for use in JS).
     */
    private function localize_wordpress_constants() {
        return [
            'abt_url' => plugins_url() . '/academic-bloggers-toolkit',
            'plugins_url' => plugins_url(),
            'wp_upload_dir' => wp_upload_dir(),
            'home_url' => home_url(),
        ];
    }

    /**
     * Initiates the TinyMCE plugins, adds the reference list metabox, and enqueues backend JS.
     */
    public function __construct() {
        add_action('admin_head', [$this, 'init_tinymce']);
        add_filter('mce_css', [$this, 'load_tinymce_css']);
        add_action('add_meta_boxes', [$this, 'add_metaboxes']);
        add_action('save_post', [$this, 'save_meta']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_scripts']);
    }

    /**
     * Instantiates the TinyMCE plugin.
     */
    public function init_tinymce() {
        if ('true' == get_user_option('rich_editing')) {
            add_filter('mce_external_plugins', [$this, 'register_tinymce_plugins']);
            // add_filter('mce_buttons', [$this, 'register_tinymce_buttons']);
        }
    }

    /**
     * Registers the TinyMCE plugins.
     *
     * @param array $plugin_array Array of TinyMCE plugins
     * @return array Array of TinyMCE plugins with plugins added
     */
    public function register_tinymce_plugins($plugin_array) {
        $plugin_array['academic_bloggers_toolkit'] = plugins_url('academic-bloggers-toolkit/lib/js/tinymce/index.js');
        $plugin_array['noneditable'] = plugins_url('academic-bloggers-toolkit/vendor/noneditable.js');
        return $plugin_array;
    }

    // NOTE: This is not currently in use.
    // /**
    //  * Registers the TinyMCE button on the editor.
    //  *
    //  * @param array $buttons Array of buttons
    //  * @return array Array of buttons with button added
    //  */
    // public function register_tinymce_buttons($buttons) {
    //     array_push($buttons, 'abt_main_menu');
    //     return $buttons;
    // }

    /**
     * Loads the required stylesheet into TinyMCE (required for proper citation parsing)
     * @param  string $mce_css  CSS string
     * @return string          CSS string + custom CSS appended.
     */
    public function load_tinymce_css($mce_css) {
        if (!empty($mce_css))
		    $mce_css .= ',';
        $mce_css .= plugins_url('academic-bloggers-toolkit/lib/css/citations.css');
	    return $mce_css;
    }

    /**
     * Adds metaboxes to posts and pages.
     *
     * @param string $post_type The post type
     */
    public function add_metaboxes($post_type) {
        if ($post_type === 'attachment') return;

        $all_types = get_post_types();
        add_meta_box(
            'abt_reflist',
            __('Reference List', 'academic-bloggers-toolkit'),
            [$this, 'render_reference_list'],
            $all_types,
            'side',
            'high'
        );
    }

    /**
     * Renders the HTML for React to mount into.
     */
    public function render_reference_list($post) {
        global $ABT_i18n;

        wp_nonce_field(basename(__file__), 'abt_nonce');

        $reflist_state = json_decode(get_post_meta($post->ID, '_abt-reflist-state', true), true);
        $abt_options = get_option('abt_options');
        if (empty($reflist_state)) {
            $reflist_state = [
                'cache' => [
                    'style' => isset($abt_options['abt_citation_style']) ? $abt_options['abt_citation_style'] : 'american-medical-association',
                    'links' => isset($abt_options['display_options']['links']) ? $abt_options['display_options']['links'] : 'always',
                    'locale' => get_locale(),
                ],
                'citationByIndex' => [],
                'CSL' => (object)[],
            ];
        }

        $reflist_state['bibOptions'] = [
            'heading' => isset($abt_options['display_options']['bib_heading']) ? $abt_options['display_options']['bib_heading'] : null,
            'style' => isset($abt_options['display_options']['bibliography']) ? $abt_options['display_options']['bibliography'] : 'fixed',
        ];

        // Fix legacy post meta
        if (array_key_exists('processorState', $reflist_state)) {
            $reflist_state['CSL'] = $reflist_state['processorState'];
            unset($reflist_state['processorState']);
        }

        if (array_key_exists('citations', $reflist_state)) {
            $reflist_state['citationByIndex'] = $reflist_state['citations']['citationByIndex'];
            unset($reflist_state['citations']);
        }

        wp_localize_script('abt_reflist', 'ABT_Reflist_State', $reflist_state);
        wp_localize_script('abt_reflist', 'ABT_i18n', $ABT_i18n);
        wp_localize_script('abt_reflist', 'ABT_CitationStyles', $this->get_citation_styles());
        wp_localize_script('abt_reflist', 'ABT_wp', $this->localize_wordpress_constants());

        echo "<div id='abt-reflist' style='margin: 0 -12px -12px -12px;'></div>";
    }

    /**
     * Saves the Peer Review meta fields to the database.
     *
     * @param string $post_id The post ID
     */
    public function save_meta($post_id) {
        $is_autosave = wp_is_post_autosave($post_id);
        $is_revision = wp_is_post_revision($post_id);
        $is_valid_nonce = (isset($_POST[ 'abt_nonce' ]) && wp_verify_nonce($_POST['abt_nonce'], basename(__FILE__))) ? true : false;

        if ($is_autosave || $is_revision || !$is_valid_nonce) return;

        $reflist_state = $_POST['abt-reflist-state'];
        update_post_meta($post_id, '_abt-reflist-state', $reflist_state);
    }

    /**
     * Registers and enqueues all required scripts.
     */
    public function enqueue_admin_scripts() {
        global $post_type;
        global $ABT_VERSION;

        if ($post_type === 'attachment') return;

        // wp_enqueue_media();
        wp_dequeue_script('autosave');
        wp_enqueue_style('dashicons');
        wp_enqueue_style('abt-admin-css', plugins_url('academic-bloggers-toolkit/lib/css/admin.css'), ['dashicons'], $ABT_VERSION);
        wp_enqueue_script('abt_citeproc', plugins_url('academic-bloggers-toolkit/vendor/citeproc.js'), [], $ABT_VERSION, true);
        wp_enqueue_script('abt_reflist', plugins_url('academic-bloggers-toolkit/lib/js/reference-list/index.js'), ['abt_citeproc'], $ABT_VERSION, true);
    }

}
