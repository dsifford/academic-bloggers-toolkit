<?php

// Add Plugin Options Menu
function abt_add_to_menu() {

	add_options_page(
		"Academic Blogger's Toolkit Options",
		"Academic Blogger's Toolkit",
		'manage_options',
		'abt-options',
		'abt_options_page'
	);

}
add_action( 'admin_menu', 'abt_add_to_menu' );


// CSS overrides
function abt_css_override(){

	$abt_options = get_option( 'abt_options' );

	$custom_css = '';

	if ( isset ( $abt_options['custom_css'] ) && $abt_options['custom_css'] != '' ) {

		$custom_css .= $abt_options['custom_css']."\r\n";

		echo '<style id="custom_css">' . $custom_css . '</style>';

	}

}
add_action('wp_head', 'abt_css_override');


// Load Options Page
function abt_options_page() {

	// Permissions Check
	if ( !current_user_can( 'manage_options' ) ) {

		wp_die( 'You do not have sufficient permissions to access this page. ');

	}

	$abt_options = get_option('abt_options');

	// Are hidden form fields set? If so, save them as variables
	$hidden_field_1 = isset( $_POST['abt_custom_css_editor_form_submitted'] ) ? esc_html( $_POST['abt_custom_css_editor_form_submitted'] ) : '';
	$hidden_field_2 = isset( $_POST['abt_citation_style_form_submitted'] ) ? esc_html( $_POST['abt_citation_style_form_submitted'] ) : '';
	$hidden_field_3 = isset( $_POST['abt_google_tag_manager_field_submitted'] ) ? esc_html( $_POST['abt_google_tag_manager_field_submitted'] ) : '';

	// Form Submits -- If form is submitted, set data as variables within the 'abt_options' array in the database
	if ( $hidden_field_1 == 'Y' ) {

		$abt_options['custom_css'] = esc_html( $_POST['abt_custom_css_editor'] );
		update_option( 'abt_options', $abt_options );

	}

	if ( $hidden_field_2 == 'Y' ) {

		$abt_options['abt_citation_style'] = esc_html( $_POST['abt_citation_style'] );
		update_option( 'abt_options', $abt_options );

	}

	if ( $hidden_field_3 == 'Y' ) {

		$abt_options['abt_google_tag_manager_code'] = $_POST['abt_google_tag_manager_code'];
		update_option( 'abt_options', $abt_options );

	}


	// Check if options are set. If they are, save them as variables
	$abt_saved_css = isset( $abt_options['custom_css'] ) ? esc_attr( $abt_options['custom_css'] ) : '';
	$selected = isset( $abt_options['abt_citation_style'] ) ? $abt_options['abt_citation_style'] : '';
	$abt_google_tag_manager_code = isset( $abt_options['abt_google_tag_manager_code'] ) ? $abt_options['abt_google_tag_manager_code'] : '';

	// Set Placeholder Text Variable for Tag Manager Textarea
	$abt_google_tag_manager_placeholder =
											"<!-- Google Tag Manager -->\n" .
											"<noscript><iframe src=\"//www.googletagmanager.com/ns.html?id=GTM-XXXX\"\n" .
											"height=\"0\" width=\"0\" style=\"display:none;visibility:hidden\"></iframe></noscript>\n" .
											"<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':\n" .
											"new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],\n" .
											"j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=\n" .
											"'//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);\n" .
											"})(window,document,'script','dataLayer','GTM-XXXX');</script>\n" .
											"<!-- End Google Tag Manager -->";

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
