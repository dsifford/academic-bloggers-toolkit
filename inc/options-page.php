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






function abt_options_page() {

	// Permissions Check
	if ( !current_user_can( 'manage_options' ) ) {
		
		wp_die( 'You do not have sufficient permissions to access this page. ');

	}

	if ( isset( $_POST['abt_custom_css_editor_form_submitted'] ) ) {
		
		$hidden_field = esc_html( $_POST['abt_custom_css_editor_form_submitted'] );

		if ( $hidden_field == 'Y' ) {

			// Grab form input variables
			$custom_css = esc_html( $_POST['abt_custom_css_editor'] );
			$css_options['custom_css'] = $custom_css;

			// Update the 'abt_options' array in the database
			update_option( 'abt_css_options', $css_options );

		}

	}

	if ( isset( $_POST['abt_citation_style_form_submitted'] ) ) {

		$hidden_field_2 = esc_html( $_POST['abt_citation_style_form_submitted'] );

		if ( $hidden_field_2 == 'Y' ) {

			// Grab form input variables
			$abt_citation_style = esc_html( $_POST['abt_citation_style'] );
			$citation_options['abt_citation_style'] = $abt_citation_style;

			// Update the 'abt_options' array in the database
			update_option( 'abt_citation_options', $citation_options );

		}

	}

	// Callback options
	$css_options = get_option( 'abt_css_options' );
	$citation_options = get_option( 'abt_citation_options' );

	if ( $css_options != '' ) {
	
		$abt_saved_css = isset( $css_options['custom_css'] ) ? esc_attr( $css_options['custom_css'] ) : '';
		
	}

	if ( $citation_options != '' ) {

		$selected = isset( $citation_options['abt_citation_style'] ) ? $citation_options['abt_citation_style'] : '';

	}

	require('options-page-wrapper.php');

}



?>
