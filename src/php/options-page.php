<?php

namespace ABT;

defined('ABSPATH') || exit;

class Options {
    public $citation_styles;

    /**
     * Save the array of citation styles to $this->citation_styles and add a
     *   link to the options page in the admin menu.
     */
    public function __construct() {
        $this->citation_styles = $this->get_citation_styles();
        add_action('admin_menu', [$this, 'add_options_page']);
    }

    /**
     * Instantiates the options page.
     */
    public function add_options_page() {
        add_options_page(
            __("Academic Blogger's Toolkit Options", 'academic-bloggers-toolkit'),
            __("Academic Blogger's Toolkit", 'academic-bloggers-toolkit'),
            'manage_options',
            'abt-options',
            [$this, 'ABT_options_page']
        );
    }

    /**
     * Renders the options page.
     */
    public function ABT_options_page() {
        if (!current_user_can('manage_options')) {
            wp_die(__('You do not have sufficient permissions to access this page.', 'academic-bloggers-toolkit'));
        }

        $abt_options = get_option('abt_options');

        $updated_style_options = isset($_POST['citation_style_options']) ? true : false;
        $updated_custom_css = isset($_POST['custom_css_submit']) ? true : false;
        $updated_display_options = isset($_POST['display_options_submit']) ? true : false;

        if ($updated_style_options) {
            $abt_options['citation_style']['style'] = $_POST['citation_style_style'];
            $abt_options['citation_style']['prefer_custom'] = (bool) $_POST['citation_style_prefer_custom'];
            $abt_options['citation_style']['custom_url'] = $this->check_custom_style_url((string) $_POST['citation_style_custom_url']);
        }
        $citation_style_style = $abt_options['citation_style']['style'];
        $citation_style_prefer_custom = $abt_options['citation_style']['prefer_custom'];
        $citation_style_custom_url = $abt_options['citation_style']['custom_url'];

        if ($updated_custom_css) {
            $abt_options['custom_css'] = stripslashes_deep($_POST['custom_css']);
        }
        $custom_css = isset($abt_options['custom_css']) ? $abt_options['custom_css'] : '';

        if ($updated_display_options) {
            $abt_options['display_options']['bibliography'] = esc_html($_POST['display_options_bibliography']);
            $abt_options['display_options']['links'] = esc_html($_POST['display_options_links']);
            $abt_options['display_options']['bib_heading'] = esc_html($_POST['display_options_bib_heading']);
            $abt_options['display_options']['bib_heading_level'] = esc_html($_POST['display_options_bib_heading_level']);
        }
        $display_options_bibliography = isset($abt_options['display_options']['bibliography']) ? $abt_options['display_options']['bibliography'] : '';
        $display_options_links = isset($abt_options['display_options']['links']) ? $abt_options['display_options']['links'] : '';
        $display_options_bib_heading = isset($abt_options['display_options']['bib_heading']) ? $abt_options['display_options']['bib_heading'] : '';
        $display_options_bib_heading_level = isset($abt_options['display_options']['bib_heading_level']) ? $abt_options['display_options']['bib_heading_level'] : '';

        update_option('abt_options', $abt_options);

        include __DIR__ . '/views/options-page.php';
    }

    /**
     * Grabs the citation styles from the vendor array and saves them to
     * $this->citation_styles.
     */
    private function get_citation_styles() {
        $json = json_decode(file_get_contents(ABT_ROOT_PATH . '/vendor/citation-styles.json'), true);
        return $json;
    }

    /**
     * Sanitizes and saves the path to the custom CSL file.
     *
     * This function should receive a URL and produce a PATH if everything
     * checks out. Otherwise, it should return an empty string.
     *
     * If the sanitation fails, a dismissable notice is sent to the user.
     *
     * @param string $url unsanitized URL submitted with the form.
     *
     * @return string sanitized PATH to the CSL file
     */
    private function check_custom_style_url($url) {
        if (file_exists($url) && substr($url, -4) === '.csl' || $url === '') {
            return $url;
        }
        $uploads = wp_upload_dir();
        $file = $uploads['basedir'] . str_replace($uploads['baseurl'], '', $url);
        if (file_exists($file) && substr($file, -4) === '.csl') {
            return $file;
        } ?>
        <div class="notice notice-error is-dismissible">
            <p><?php _e('The provided URL is not a valid file in your WordPress upload directory. Please try again.', 'academic-bloggers-toolkit'); ?></p>
        </div>
        <?php
        return '';
    }
}
new Options;
