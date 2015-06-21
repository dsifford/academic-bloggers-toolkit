<?php 


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



function abt_options_page() {

	if ( !current_user_can( 'manage_options' ) ) {
		
		wp_die( 'You do not have sufficient permissions to access this page. ');

	}

	global $options;
	global $display_json;

	// if ( isset( $_POST['wptreehouse_form_submitted'] ) ) {
		
	// 	$hidden_field = esc_html( $_POST['wptreehouse_form_submitted'] );

	// 	if ( $hidden_field == 'Y' ) {

	// 		$wptreehouse_username = esc_html( $_POST['wptreehouse_username'] );
	// 		$wptreehouse_profile = wptreehouse_badges_get_profile( $wptreehouse_username );

	// 		$options['wptreehouse_username'] = $wptreehouse_username;
	// 		$options['wptreehouse_profile'] = $wptreehouse_profile;
	// 		$options['last_updated']         = time();

	// 		update_option( 'wptreehouse_badges', $options );

	// 	}

	// }

	// $options = get_option( 'wptreehouse_badges' );

	// if ( $options != '' ) {
	
	// 	$wptreehouse_username = $options['wptreehouse_username'];
	// 	$wptreehouse_profile = $options['wptreehouse_profile'];
	
	// }

	require('options-page-wrapper.php');

}





?>
