<?php


class ABT_Options  {

    public $citation_styles;

    /**
     * Save the array of citation styles to $this->citation_styles and add a
     *   link to the options page in the admin menu.
     */
    public function __construct() {
        $this->get_citation_styles();
        add_action('admin_menu', [$this, 'add_options_page']);
    }

    /**
     * Grabs the citation styles from the vendor array and saves them to
     *   $this->citation_styles
     */
    private function get_citation_styles() {
        include dirname(__FILE__).'/../../vendor/citationstyles.php';
        $this->citation_styles = $citation_styles;
    }

    /**
     * Instantiates the options page.
     */
    public function add_options_page() {
        add_options_page(
            "Academic Blogger's Toolkit Options",
            "Academic Blogger's Toolkit",
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
            wp_die('You do not have sufficient permissions to access this page.');
        }

        $abt_options = get_option('abt_options');

        $hidden_field_1 = isset($_POST['abt_custom_css_editor_form_submitted']) ? esc_html($_POST['abt_custom_css_editor_form_submitted']) : '';
        $hidden_field_2 = isset($_POST['abt_citation_style_form_submitted']) ? esc_html($_POST['abt_citation_style_form_submitted']) : '';
        $hidden_field_3 = isset($_POST['abt_display_options_form_submitted']) ? esc_html($_POST['abt_display_options_form_submitted']) : '';

        if ($hidden_field_1 == 'Y') {
            $abt_options['custom_css'] = stripslashes_deep($_POST['abt_custom_css_editor']);
        }

        if ($hidden_field_2 == 'Y') {
            $abt_options['abt_citation_style'] = esc_html($_POST['abt_citation_style']);
        }

        if ($hidden_field_3 == 'Y') {
            $abt_options['display_options']['bibliography'] = esc_html($_POST['abt_bibliography_display']);
            $abt_options['display_options']['links'] = esc_html($_POST['abt_link_display']);
            $abt_options['display_options']['bib_heading'] = esc_html($_POST['abt_bib_heading']);
        }
        update_option('abt_options', $abt_options);

        $abt_saved_css = isset($abt_options['custom_css']) ? $abt_options['custom_css'] : '';
        $selected_style = isset($abt_options['abt_citation_style']) ? $abt_options['abt_citation_style'] : 'american-medical-association';

        $selected_bib_display = isset($abt_options['display_options']['bibliography']) ? $abt_options['display_options']['bibliography'] : '';
        $selected_link_display = isset($abt_options['display_options']['links']) ? $abt_options['display_options']['links'] : '';
        $bib_heading = isset($abt_options['display_options']['bib_heading']) ? $abt_options['display_options']['bib_heading'] : '';

        ?>
		    <!-- JADE -->
		<?php

    }
}
new ABT_Options();
