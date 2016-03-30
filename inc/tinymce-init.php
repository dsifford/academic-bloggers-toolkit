<?php

/*
 * * * * * * * * * * * * * * *
 *	Custom TinyMCE Buttons * *
 * * * * * * * * * * * * * * *
*/

// Filter Functions with Hooks
function abt_custom_mce_buttons() {
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
add_action( 'admin_head', 'abt_custom_mce_buttons' );

// Function for new button
function custom_tinymce_plugin( $plugin_array ) {
  $plugin_array['abt_main_menu'] = plugins_url('academic-bloggers-toolkit/inc/js/tinymce-entrypoint.js');
  return $plugin_array;
}

// Register new button in the editor
function register_mce_button( $buttons ) {
  array_push( $buttons, 'abt_main_menu');
  return $buttons;
}


 ?>
