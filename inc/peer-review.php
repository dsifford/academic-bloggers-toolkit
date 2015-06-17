<?php 

function abt_peer_review_meta() {
	add_meta_box( 'abt_peer_review', __( 'Add Peer Review(s)', 'abt-text-domain' ), 'abt_peer_review_callback', 'post', 'normal', 'high' );
}
add_action( 'add_meta_boxes', 'abt_peer_review_meta' );

function abt_peer_review_callback( $post ) {
	wp_nonce_field( basename( __file__ ), 'abt_nonce' );
	$abt_stored_meta = get_post_meta( $post->ID );
 	?>

 	<div>
		<table class="form-table">
			<tr valign="top">
				<td><label for="meta-text-reviewer-name" class="abt-row-title"><?php _e( 'Peer Reviewer Name', 'abt-text-domain' ) ?></label></td>
				<td><input type="text" class="large-text" name="meta-text-reviewer-name" id="meta-text-reviewer-name" value="<?php if ( isset( $abt_stored_meta['meta-text-reviewer-name'] ) ) echo $abt_stored_meta['meta-text-reviewer-name'][0]; ?>" /></td>
			</tr>
			<tr valign="top" class="alternate">
				<td><label for="meta-text-reviewer-background" class="abt-row-title"><?php _e( 'Peer Reviewer Background', 'abt-text-domain' ) ?></label></td>
				<td><input type="text" class="large-text" name="meta-text-reviewer-background" id="meta-text-reviewer-background" value="<?php if ( isset( $abt_stored_meta['meta-text-reviewer-name'] ) ) echo $abt_stored_meta['meta-text-reviewer-name'][0]; ?>" /></td>
			</tr>
			<tr valign="top">
				<td scope="row"><label for="tablecell"><?php esc_attr_e(
							'Peer Review', 'wp_admin_style'
						); ?></label></td>
				<td><textarea id="" name="" cols="80" rows="5" class="large-text"></textarea><br></td>
			</tr>
			<tr valign="top" class="alternate">
				<td scope="row"><label for="meta-image" class="prfx-row-title"><?php _e( 'Example File Upload', 'prfx-textdomain' )?></label></td>
				<td>
					<input type="text" name="meta-image" id="meta-image" value="<?php if ( isset ( $prfx_stored_meta['meta-image'] ) ) echo $prfx_stored_meta['meta-image'][0]; ?>" />
   					<input type="button" id="meta-image-button" class="button" value="<?php _e( 'Choose or Upload an Image', 'prfx-textdomain' )?>" />
				</td>
			</tr>
		</table>

		
 		
 		
 	</div>

 	<?php
}

/**
 * Saves the custom meta input
 */
function abt_meta_save( $post_id ) {
 
    // Checks save status
    $is_autosave = wp_is_post_autosave( $post_id );
    $is_revision = wp_is_post_revision( $post_id );
    $is_valid_nonce = ( isset( $_POST[ 'abt_nonce' ] ) && wp_verify_nonce( $_POST[ 'abt_nonce' ], basename( __FILE__ ) ) ) ? 'true' : 'false';
 
    // Exits script depending on save status
    if ( $is_autosave || $is_revision || !$is_valid_nonce ) {
        return;
    }
 
    // Checks for input and sanitizes/saves if needed
    if( isset( $_POST[ 'meta-text-reviewer-name' ] ) ) {
        update_post_meta( $post_id, 'meta-text-reviewer-name', sanitize_text_field( $_POST[ 'meta-text-reviewer-name' ] ) );
    }
 
}
add_action( 'save_post', 'abt_meta_save' );

function insert_the_meta( $content ) {
	if ( is_single() || is_page() ) {
	
		$meta_value = get_post_meta( get_the_ID(), 'meta-text-reviewer-name', true );
		
		// if ( !empty( $meta_value ) ) {
		
			echo $content . '
			Test test test test test test test test<br>
			' . $meta_value;
		
		// }
	
	}
}
add_action( 'the_content', 'insert_the_meta');


/**
 * Loads the image management javascript
 */
function prfx_image_enqueue() {
    global $typenow;
    if( $typenow == 'post' ) {
        wp_enqueue_media();
 
        // Registers and enqueues the required javascript.
        wp_register_script( 'meta-box-image', plugin_dir_url( __FILE__ ) . 'meta-box-image.js', array( 'jquery' ) );
        wp_localize_script( 'meta-box-image', 'meta_image',
            array(
                'title' => __( 'Choose or Upload an Image', 'prfx-textdomain' ),
                'button' => __( 'Use this image', 'prfx-textdomain' ),
            )
        );
        wp_enqueue_script( 'meta-box-image' );
    }
}
add_action( 'admin_enqueue_scripts', 'prfx_image_enqueue' );

// Checks for input and saves if needed
if( isset( $_POST[ 'meta-image' ] ) ) {
    update_post_meta( $post_id, 'meta-image', $_POST[ 'meta-image' ] );
}

?>