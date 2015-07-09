<?php

// Add Plugin Options Menu
add_action( 'admin_menu', 'abt_add_to_menu' );
function abt_add_to_menu() {

	add_options_page(
		"Academic Blogger's Toolkit Options",
		"Academic Blogger's Toolkit",
		'manage_options',
		'abt-options',
		'abt_options_page'
	);

}



// CSS overrides
add_action('wp_head', 'abt_css_override');
function abt_css_override(){

	$options = get_option( 'abt_css_options' );

	$custom_css = '';

	if ( isset ( $options['custom_css'] ) ) {

		$custom_css .= $options['custom_css']."\r\n";

	}

  echo '<style id="custom_css">'.$custom_css.'</style>';
}

// Load Options Page
function abt_options_page() {

	// Permissions Check
	if ( !current_user_can( 'manage_options' ) ) {

		wp_die( 'You do not have sufficient permissions to access this page. ');

	}

	// Form Submits -- Custom CSS Form
	if ( isset( $_POST['abt_custom_css_editor_form_submitted'] ) ) {

		$hidden_field = esc_html( $_POST['abt_custom_css_editor_form_submitted'] );

		if ( $hidden_field == 'Y' ) {

			// Grab form input variables
			$custom_css = esc_html( $_POST['abt_custom_css_editor'] );
			$css_options['custom_css'] = $custom_css;

			// Update the 'css_options' array in the database
			update_option( 'abt_css_options', $css_options );

		}

	}

	// Form Submits -- Citation Style Form
	if ( isset( $_POST['abt_citation_style_form_submitted'] ) ) {

		$hidden_field_2 = esc_html( $_POST['abt_citation_style_form_submitted'] );

		if ( $hidden_field_2 == 'Y' ) {

			// Grab form input variables
			$abt_citation_style = esc_html( $_POST['abt_citation_style'] );
			$citation_options['abt_citation_style'] = $abt_citation_style;

			// Update the 'citation_options' array in the database
			update_option( 'abt_citation_options', $citation_options );

		}

	}

	// Form Submits -- Tag Manager Form
	if ( isset( $_POST['abt_google_tag_manager_field_submitted'] ) ) {

		$hidden_field_3 = esc_html( $_POST['abt_google_tag_manager_field_submitted'] );

		if ( $hidden_field_3 == 'Y' ) {

			// Grab form input variables
			$abt_google_tag_manager_code = $_POST['abt_google_tag_manager_code'];
			$abt_options['abt_google_tag_manager_code'] = $abt_google_tag_manager_code;

			// Update the 'abt_options' array in the database
			update_option( 'abt_options', $abt_options );

		}

	}

	// Callback options
	$css_options = get_option( 'abt_css_options' );
	$citation_options = get_option( 'abt_citation_options' );
	$abt_options = get_option( 'abt_options' );

	if ( $css_options != '' ) {

		$abt_saved_css = isset( $css_options['custom_css'] ) ? esc_attr( $css_options['custom_css'] ) : '';

	}

	if ( $citation_options != '' ) {

		$selected = isset( $citation_options['abt_citation_style'] ) ? $citation_options['abt_citation_style'] : '';

	}

	if ( $abt_options != '' ) {

		$abt_google_tag_manager_code = isset( $abt_options['abt_google_tag_manager_code'] ) ? $abt_options['abt_google_tag_manager_code'] : '';

	}

	require('options-page-wrapper.php');

}

// Extract and Add Tag Manager Code to Body
function abt_integrate_tag_manager_body() {

	$abt_options = get_option( 'abt_options' );

	if ( isset ($abt_options['abt_google_tag_manager_code'] ) && $abt_options['abt_google_tag_manager_code'] != '' ) {

		$abt_google_tag_manager_code = $abt_options['abt_google_tag_manager_code'];
		$abt_google_tag_manager_code = stripslashes(html_entity_decode($abt_google_tag_manager_code, ENT_QUOTES));
		preg_match_all("/<noscript>[\s\S]*<\/noscript>/m", $abt_google_tag_manager_code, $no_script_tag);
		$no_script_tag = $no_script_tag[0][0];

		$abt_google_tag_manager_code = preg_replace("/<noscript>[\s\S]*<\/noscript>/m", "", $abt_google_tag_manager_code);

		echo $no_script_tag;

	}


}
add_action( 'wp_footer', 'abt_integrate_tag_manager_body', 9999);


// Extract and Add Tag Manager Code to Head
function abt_integrate_tag_manager_head() {

	$abt_options = get_option( 'abt_options' );

	if ( isset ($abt_options['abt_google_tag_manager_code'] ) && $abt_options['abt_google_tag_manager_code'] != '' ) {

		$abt_google_tag_manager_code = $abt_options['abt_google_tag_manager_code'];
		$abt_google_tag_manager_code = stripslashes(html_entity_decode($abt_google_tag_manager_code, ENT_QUOTES));
		$abt_google_tag_manager_code = preg_replace("/<noscript>[\s\S]*<\/noscript>/m", "", $abt_google_tag_manager_code);

		echo $abt_google_tag_manager_code . "\r\n";

	}

}
add_action( 'wp_head', 'abt_integrate_tag_manager_head', 9999 );



?>
