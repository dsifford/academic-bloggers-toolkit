<?php


function abt_tinymce_button() {
  // Check if user have permission
  if ( !current_user_can( 'edit_posts' ) && !current_user_can( 'edit_pages' ) ) {
    return;
  }
  // Check if WYSIWYG is enabled
  if ( 'true' == get_user_option( 'rich_editing' ) ) {
    add_filter( 'mce_external_plugins', 'abt_tinymce_plugin' );
    add_filter( 'mce_buttons', 'register_abt_mce_button' );
  }
}
add_action( 'admin_head', 'abt_tinymce_button' );

// Function for new button
function abt_tinymce_plugin( $plugin_array ) {
  $plugin_array['abt_main_menu'] = plugins_url('academic-bloggers-toolkit/inc/js/tinymce-entrypoint.js');
  return $plugin_array;
}

// Register new button in the editor
function register_abt_mce_button( $buttons ) {
  array_push( $buttons, 'abt_main_menu');
  return $buttons;
}

function abt_enqueue_admin_css($hook) {
    if ($hook == 'page.php' || $hook == 'post.php' || $hook == 'post-new.php') {
        wp_enqueue_style('abt_styles', plugins_url('academic-bloggers-toolkit/inc/css/admin.css') );
    }
}
add_action('admin_enqueue_scripts', 'abt_enqueue_admin_css');

 ?>
