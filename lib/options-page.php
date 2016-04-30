<?php


 class ABT_Options {

 	public $citation_styles;

 	public function __construct() {
 		$this->get_citation_styles();
 		add_action('admin_menu', array($this,'add_options_page'));
 	}

 	private function get_citation_styles() {
 		include(dirname(__FILE__).'/../vendor/citationstyles.php');
 		$this->citation_styles = $citation_styles;
 	}

 	public function add_options_page() {
 		add_options_page(
 			"Academic Blogger's Toolkit Options",
 			"Academic Blogger's Toolkit",
 			'manage_options',
 			'abt-options',
 			array($this, 'ABT_options_page')
 		);
 	}

 	public function ABT_options_page() {

 		// Permissions Check
 		if ( !current_user_can( 'manage_options' ) ) {
 			wp_die('You do not have sufficient permissions to access this page.');
 		}

 		$abt_options = get_option('abt_options');

 		// Are hidden form fields set? If so, save them as variables
 		$hidden_field_1 = isset( $_POST['abt_custom_css_editor_form_submitted'] ) ? esc_html( $_POST['abt_custom_css_editor_form_submitted'] ) : '';
 		$hidden_field_2 = isset( $_POST['abt_citation_style_form_submitted'] ) ? esc_html( $_POST['abt_citation_style_form_submitted'] ) : '';
 		$hidden_field_3 = isset( $_POST['abt_display_options_form_submitted'] ) ? esc_html( $_POST['abt_display_options_form_submitted'] ) : '';

 		// Form Submits -- If form is submitted, set data as variables within the 'abt_options' array in the database
 		if ($hidden_field_1 == 'Y') {

 			$abt_options['custom_css'] = stripslashes_deep($_POST['abt_custom_css_editor']);
 			update_option( 'abt_options', $abt_options );

 		}

 		if ($hidden_field_2 == 'Y') {

 			$abt_options['abt_citation_style'] = esc_html( $_POST['abt_citation_style'] );
 			update_option( 'abt_options', $abt_options );

 		}

 		if ($hidden_field_3 == 'Y') {
 			$abt_options['display_options']['bibliography'] = esc_html( $_POST['abt_bibliography_display'] );
 			$abt_options['display_options']['PR_boxes'] = esc_html( $_POST['abt_PR_display'] );
 			$abt_options['display_options']['bib_heading'] = esc_html( $_POST['abt_bib_heading'] );
 			update_option( 'abt_options', $abt_options );
 		}


 		// Check if options are set. If they are, save them as variables
 		$abt_saved_css = isset($abt_options['custom_css']) ? $abt_options['custom_css'] : '';
 		$selected_style = isset($abt_options['abt_citation_style']) ? $abt_options['abt_citation_style'] : '';
 		$selected_PR_box_display = isset($abt_options['display_options']['PR_boxes']) ? $abt_options['display_options']['PR_boxes'] : '';
 		$selected_bib_display = isset($abt_options['display_options']['bibliography']) ? $abt_options['display_options']['bibliography'] : '';
 		$bib_heading = isset($abt_options['display_options']['bib_heading']) ? $abt_options['display_options']['bib_heading'] : '';


 		?>
 		    <!-- JADE -->
 		<?php
 	}

 }
 new ABT_Options();
