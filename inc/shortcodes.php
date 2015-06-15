<?php 

/*
 * * * * * * * * * * * * * * * * *
 *	In-text citation shortcode * *
 * * * * * * * * * * * * * * * * *
*/

function inline_citation ( $atts ) {
	$a = shortcode_atts( array(
				'num' => 1,
				'return' => FALSE,
		), $atts);
	
	$cite_num = number_format($a['num'], 0);
	
	if ($a['return'] == FALSE) {
		return '<a name="bounceback' . esc_attr($a['num']) . '" class="cite" href="#citation' . esc_attr($a['num']) . '">[' . $cite_num . ']</a>';
	} else {	
		return '<a name="citation' . esc_attr($a['num']) . '" class="cite-return" href="#bounceback' . esc_attr($a['num']) . '">▲</a>';
	}
}
add_shortcode( 'cite', 'inline_citation' );


/*
 * * * * * * * * * * * * * * *
 *	Reference ID Parser  * * *
 * * * * * * * * * * * * * * *
*/

function ref_id_parser ( $atts ) {
	$a = shortcode_atts ( array(
			'id'    => '',
			'style' => '',
		), $atts);
	
	$abt_get_url = 'http://www.ncbi.nlm.nih.gov/pmc/utils/idconv/v1.0/?tool=my_tool&email=my_email%40example.com&ids=' . esc_attr($a['id']) . '&format=json';	

	$response = wp_remote_get( $abt_get_url );
	$tidy_json = json_decode( $response['body'] );
	$ref_ids = ['pmcid', 'pmid', 'doi'];
	// $inputs = array();

	// for ($i=0; $i < 3; $i++) { 
	// 	array_push($inputs, $tidy_json->{'records'}[0]->{$ref_ids[$i]})
	// }

	// return $inputs;

	if ( esc_attr($a['id']) == $tidy_json->{'records'}[0]->{$ref_ids[0]} ) {
	
		print ('pmcid');
	
	}

	if ( esc_attr($a['id']) == $tidy_json->{'records'}[0]->{$ref_ids[1]} ) {
	
		print ('pmid');
	
	}

	if ( esc_attr($a['id']) == $tidy_json->{'records'}[0]->{$ref_ids[2]} ) {
	
		print ('doi');
	
	}

	// return $tidy_json->{'records'}[0]->{'doi'};
	// return $tidy_json->{'records'}[0]->{'doi'};
	// return '<p>' . $tidy_json->$records[0].pmcid . ' aaa</p>';
}
add_shortcode( 'ref', 'ref_id_parser' );


// TODO:


/*
 * * * * * * * * * * * * * * *
 *	Custom TinyMCE Buttons * *
 * * * * * * * * * * * * * * *
*/

// Filter Functions with Hooks
function abt_inline_citation_mce_button() {
  // Check if user have permission
  if ( !current_user_can( 'edit_posts' ) && !current_user_can( 'edit_pages' ) ) {
    return;
  }
  // Check if WYSIWYG is enabled
  if ( 'true' == get_user_option( 'rich_editing' ) ) {
    add_filter( 'mce_external_plugins', 'custom_tinymce_plugin' );
    add_filter( 'mce_buttons', 'register_mce_button' );
  }
}
add_action('admin_head', 'abt_inline_citation_mce_button');

// Function for new button
function custom_tinymce_plugin( $plugin_array ) {
  $plugin_array['abt_inline_citation_mce_button'] = plugins_url('academic-bloggers-toolkit/inc/tinymce-buttons.js');
  return $plugin_array;
}

// Register new button in the editor
function register_mce_button( $buttons ) {
  array_push( $buttons, 'abt_inline_citation_mce_button' );
  return $buttons;
}