<?php 

function abt_peer_review_meta() {
	add_meta_box( 'abt_peer_review', __( 'Add Peer Review(s)', 'abt-textdomain' ), 'abt_peer_review_callback', 'post', 'normal', 'high' );
}
add_action( 'add_meta_boxes', 'abt_peer_review_meta' );



function abt_peer_review_callback( $post ) {
	wp_nonce_field( basename( __file__ ), 'abt_nonce' );
 	
	$values = get_post_custom( $post->ID );
	
	// Value for Select Box
		$selected = isset( $values['reviewer_selector'] ) ? esc_attr( $values['reviewer_selector'][0] ) : '';
	
	// Values for Peer Review Box Heading
		$peer_review_box_heading_1 = isset( $values['peer_review_box_heading_1'] ) ? esc_attr( $values['peer_review_box_heading_1'][0] ) : '';
		$peer_review_box_heading_2 = isset( $values['peer_review_box_heading_2'] ) ? esc_attr( $values['peer_review_box_heading_2'][0] ) : '';
		$peer_review_box_heading_3 = isset( $values['peer_review_box_heading_3'] ) ? esc_attr( $values['peer_review_box_heading_3'][0] ) : '';

	// Values for First Reviewer
		$reviewer_name_1 = isset( $values['reviewer_name_1'] ) ? esc_attr( $values['reviewer_name_1'][0] ) : '';
		$reviewer_background_1 = isset( $values['reviewer_background_1'] ) ? esc_attr( $values['reviewer_background_1'][0] ) : '';
		$peer_review_content_1 = isset( $values['peer_review_content_1'] ) ? esc_attr( $values['peer_review_content_1'][0] ) : '';
		$peer_review_image_1 = isset( $values['reviewer_headshot_image_1'] ) ? esc_attr( $values['reviewer_headshot_image_1'][0] ) : '';

	// Values for First Author Response
		$author_name_1 = isset( $values['author_name_1'] ) ? esc_attr( $values['author_name_1'][0] ) : '';
		$author_background_1 = isset( $values['author_background_1'] ) ? esc_attr( $values['author_background_1'][0] ) : '';
		$author_content_1 = isset( $values['author_content_1'] ) ? esc_attr( $values['author_content_1'][0] ) : '';
		$author_image_1 = isset( $values['author_headshot_image_1'] ) ? esc_attr( $values['author_headshot_image_1'][0] ) : '';

	// Values for Second Reviewer
		$reviewer_name_2 = isset( $values['reviewer_name_2'] ) ? esc_attr( $values['reviewer_name_2'][0] ) : '';
		$reviewer_background_2 = isset( $values['reviewer_background_2'] ) ? esc_attr( $values['reviewer_background_2'][0] ) : '';
		$peer_review_content_2 = isset( $values['peer_review_content_2'] ) ? esc_attr( $values['peer_review_content_2'][0] ) : '';
		$peer_review_image_2 = isset( $values['reviewer_headshot_image_2'] ) ? esc_attr( $values['reviewer_headshot_image_2'][0] ) : '';

	// Values for Second Author Response
		$author_name_2 = isset( $values['author_name_2'] ) ? esc_attr( $values['author_name_2'][0] ) : '';
		$author_background_2 = isset( $values['author_background_2'] ) ? esc_attr( $values['author_background_2'][0] ) : '';
		$author_content_2 = isset( $values['author_content_2'] ) ? esc_attr( $values['author_content_2'][0] ) : '';
		$author_image_2 = isset( $values['author_headshot_image_2'] ) ? esc_attr( $values['author_headshot_image_2'][0] ) : '';

	// Values for Third Reviewer
		$reviewer_name_3 = isset( $values['reviewer_name_3'] ) ? esc_attr( $values['reviewer_name_3'][0] ) : '';
		$reviewer_background_3 = isset( $values['reviewer_background_3'] ) ? esc_attr( $values['reviewer_background_3'][0] ) : '';
		$peer_review_content_3 = isset( $values['peer_review_content_3'] ) ? esc_attr( $values['peer_review_content_3'][0] ) : '';
		$peer_review_image_3 = isset( $values['reviewer_headshot_image_3'] ) ? esc_attr( $values['reviewer_headshot_image_3'][0] ) : '';

	// Values for Third Author Response
		$author_name_3 = isset( $values['author_name_3'] ) ? esc_attr( $values['author_name_3'][0] ) : '';
		$author_background_3 = isset( $values['author_background_3'] ) ? esc_attr( $values['author_background_3'][0] ) : '';
		$author_content_3 = isset( $values['author_content_3'] ) ? esc_attr( $values['author_content_3'][0] ) : '';
		$author_image_3 = isset( $values['author_headshot_image_3'] ) ? esc_attr( $values['author_headshot_image_3'][0] ) : '';
	
	?>
	<div id="peer_review_metabox_wrapper">
	<select name="reviewer_selector" id="reviewer_selector">
		<option value="0" <?php selected( $selected, '0' ); ?>>Select Number of Reviewers</option>
		<option value="1" <?php selected( $selected, '1' ); ?>>One Reviewer</option>
		<option value="2" <?php selected( $selected, '2' ); ?>>Two Reviewers</option>
		<option value="3" <?php selected( $selected, '3' ); ?>>Three Reviewers</option>
	</select>

	<div id="tabs-1">
		<table class="form-table" style="border-top: solid 2px #dedede;">
			<tr valign="top" class="alternate">
				<td width="20%"><label for="peer_review_box_heading_1" class="abt-row-title" width="20%"><?php esc_attr_e( 'Heading for Peer Review', 'abt-textdomain' ) ?></label></td>
				<td><input type="text" class="large-text" name="peer_review_box_heading_1" id="peer_review_box_heading_1" value="<?php echo $peer_review_box_heading_1; ?>" /></td>
			</tr>
			<tr valign="top">
				<td width="20%"><label for="reviewer_name_1" class="abt-row-title" width="20%"><?php esc_attr_e( 'Peer Reviewer Name', 'abt-textdomain' ) ?></label></td>
				<td><input type="text" class="large-text" name="reviewer_name_1" id="reviewer_name_1" value="<?php echo $reviewer_name_1; ?>" /></td>
			</tr>
			<tr valign="top" class="alternate">
				<td width="20%"><label for="reviewer_background_1" class="abt-row-title" width="20%"><?php esc_attr_e( 'Peer Reviewer Background', 'abt-textdomain' ) ?></label></td>
				<td><input type="text" class="large-text" name="reviewer_background_1" id="reviewer_background_1" value="<?php echo $reviewer_background_1; ?>" /></td>
			</tr>
			<tr valign="top">
				<td scope="row" width="20%"><label for="peer_review_content_1" width="20%"><?php esc_attr_e( 'Peer Review', 'abt-textdomain' ); ?></label></td>
				<td><textarea id="peer_review_content_1" name="peer_review_content_1" cols="80" rows="5" class="large-text"><?php echo $peer_review_content_1; ?></textarea><br></td>
			</tr>
			<tr valign="top" class="alternate">
				<td scope="row" width="20%"><label for="reviewer_headshot_image_1" class="abt-row-title" width="20%"><?php esc_attr_e( 'Peer Reviewer Photo', 'abt-textdomain' )?></label></td>
				<td>
					<input type="text" name="reviewer_headshot_image_1" id="reviewer_headshot_image_1" value="<?php echo $peer_review_image_1; ?>" />
						<input type="button" id="reviewer_headshot_image_button_1" class="button" value="<?php esc_attr_e( 'Choose or Upload an Image', 'abt-textdomain' )?>" />
				</td>
			</tr>
			<tr valign="top">
				<td scope="row" colspan="2"><input class="button-primary" type="button" id="author_response_button_1" value="<?php esc_attr_e( 'Toggle Author Response' ); ?>" /></td>
			</tr>
		</table>
		<table class="form-table" id="author_response_1">
			<tr valign="top" class="alternate" style="border-top: solid 2px #dedede;">
				<td width="20%"><label for="author_name_1" class="abt-row-title"><?php esc_attr_e( 'Author Name', 'abt-textdomain' ) ?></label></td>
				<td><input type="text" class="large-text" name="author_name_1" id="author_name_1" value="<?php echo $author_name_1; ?>" /></td>
			</tr>
			<tr valign="top">
				<td width="20%"><label for="author_background_1" class="abt-row-title"><?php esc_attr_e( 'Author Background', 'abt-textdomain' ) ?></label></td>
				<td><input type="text" class="large-text" name="author_background_1" id="author_background_1" value="<?php echo $author_background_1; ?>" /></td>
			</tr>
			<tr valign="top" class="alternate">
				<td scope="row" width="20%"><label for="author_content_1"><?php esc_attr_e( 'Author Response', 'wp_admin_style' ); ?></label></td>
				<td><textarea id="author_content_1" name="author_content_1" cols="80" rows="5" class="large-text"><?php echo $author_content_1; ?></textarea><br></td>
			</tr>
			<tr valign="top">
				<td scope="row" width="20%"><label for="author_headshot_image_1" class="abt-row-title"><?php esc_attr_e( 'Author Photo', 'abt-textdomain' )?></label></td>
				<td>
					<input type="text" name="author_headshot_image_1" id="author_headshot_image_1" value="<?php echo $author_image_1; ?>" />
						<input type="button" id="author_headshot_image_button_1" class="button" value="<?php esc_attr_e( 'Choose or Upload an Image', 'abt-textdomain' )?>" />
				</td>
			</tr>
		</table>
	</div>
	
	<div id="tabs-2">
		<table class="form-table">
			<tr valign="top" class="alternate" style="border-top: solid 2px #dedede;">
				<td width="20%"><label for="peer_review_box_heading_2" class="abt-row-title" width="20%"><?php esc_attr_e( 'Heading for Peer Review', 'abt-textdomain' ) ?></label></td>
				<td><input type="text" class="large-text" name="peer_review_box_heading_2" id="peer_review_box_heading_2" value="<?php echo $peer_review_box_heading_2; ?>" /></td>
			</tr>
			<tr valign="top">
				<td width="20%"><label for="reviewer_name_2" class="abt-row-title"><?php esc_attr_e( 'Peer Reviewer Name', 'abt-textdomain' ) ?></label></td>
				<td><input type="text" class="large-text" name="reviewer_name_2" id="reviewer_name_2" value="<?php echo $reviewer_name_2; ?>" /></td>
			</tr>
			<tr valign="top" class="alternate">
				<td width="20%"><label for="reviewer_background_2" class="abt-row-title"><?php esc_attr_e( 'Peer Reviewer Background', 'abt-textdomain' ) ?></label></td>
				<td><input type="text" class="large-text" name="reviewer_background_2" id="reviewer_background_2" value="<?php echo $reviewer_background_2; ?>" /></td>
			</tr>
			<tr valign="top">
				<td scope="row" width="20%"><label for="peer_review_content_2"><?php esc_attr_e( 'Peer Review', 'wp_admin_style' ); ?></label></td>
				<td><textarea id="peer_review_content_2" name="peer_review_content_2" cols="80" rows="5" class="large-text"><?php echo $peer_review_content_2; ?></textarea><br></td>
			</tr>
			<tr valign="top" class="alternate">
				<td scope="row" width="20%"><label for="reviewer_headshot_image_2" class="abt-row-title"><?php esc_attr_e( 'Peer Reviewer Photo', 'abt-textdomain' )?></label></td>
				<td>
					<input type="text" name="reviewer_headshot_image_2" id="reviewer_headshot_image_2" value="<?php echo $peer_review_image_2; ?>" />
						<input type="button" id="reviewer_headshot_image_button_2" class="button" value="<?php esc_attr_e( 'Choose or Upload an Image', 'abt-textdomain' )?>" />
				</td>
			</tr>
			<tr valign="top">
				<td scope="row" colspan="2"><input class="button-primary" type="button" id="author_response_button_2" value="<?php esc_attr_e( 'Toggle Author Response' ); ?>" /></td>
			</tr>
		</table>
		<table class="form-table" id="author_response_2">
			<tr valign="top" class="alternate" style="border-top: solid 2px #dedede;">
				<td width="20%"><label for="author_name_2" class="abt-row-title"><?php esc_attr_e( 'Author Name', 'abt-textdomain' ) ?></label></td>
				<td><input type="text" class="large-text" name="author_name_2" id="author_name_2" value="<?php echo $author_name_2; ?>" /></td>
			</tr>
			<tr valign="top">
				<td width="20%"><label for="author_background_2" class="abt-row-title"><?php esc_attr_e( 'Author Background', 'abt-textdomain' ) ?></label></td>
				<td><input type="text" class="large-text" name="author_background_2" id="author_background_2" value="<?php echo $author_background_2; ?>" /></td>
			</tr>
			<tr valign="top" class="alternate">
				<td scope="row" width="20%"><label for="author_content_2"><?php esc_attr_e( 'Author Response', 'wp_admin_style' ); ?></label></td>
				<td><textarea id="author_content_2" name="author_content_2" cols="80" rows="5" class="large-text"><?php echo $author_content_2; ?></textarea><br></td>
			</tr>
			<tr valign="top">
				<td scope="row" width="20%"><label for="author_headshot_image_2" class="abt-row-title"><?php esc_attr_e( 'Author Photo', 'abt-textdomain' )?></label></td>
				<td>
					<input type="text" name="author_headshot_image_2" id="author_headshot_image_2" value="<?php echo $author_image_2; ?>" />
						<input type="button" id="author_headshot_image_button_2" class="button" value="<?php esc_attr_e( 'Choose or Upload an Image', 'abt-textdomain' )?>" />
				</td>
			</tr>
		</table>
	</div>

	<div id="tabs-3">
		<table class="form-table">
			<tr valign="top" class="alternate" style="border-top: solid 2px #dedede;">
				<td width="20%"><label for="peer_review_box_heading_3" class="abt-row-title" width="20%"><?php esc_attr_e( 'Heading for Peer Review', 'abt-textdomain' ) ?></label></td>
				<td><input type="text" class="large-text" name="peer_review_box_heading_3" id="peer_review_box_heading_3" value="<?php echo $peer_review_box_heading_3; ?>" /></td>
			</tr>
			<tr valign="top">
				<td width="20%"><label for="reviewer_name_3" class="abt-row-title"><?php esc_attr_e( 'Peer Reviewer Name', 'abt-textdomain' ) ?></label></td>
				<td><input type="text" class="large-text" name="reviewer_name_3" id="reviewer_name_3" value="<?php echo $reviewer_name_3; ?>" /></td>
			</tr>
			<tr valign="top" class="alternate">
				<td width="20%"><label for="reviewer_background_3" class="abt-row-title"><?php esc_attr_e( 'Peer Reviewer Background', 'abt-textdomain' ) ?></label></td>
				<td><input type="text" class="large-text" name="reviewer_background_3" id="reviewer_background_3" value="<?php echo $reviewer_background_3; ?>" /></td>
			</tr>
			<tr valign="top">
				<td scope="row" width="20%"><label for="peer_review_content_3"><?php esc_attr_e( 'Peer Review', 'wp_admin_style' ); ?></label></td>
				<td><textarea id="peer_review_content_3" name="peer_review_content_3" cols="80" rows="5" class="large-text"><?php echo $peer_review_content_3; ?></textarea><br></td>
			</tr>
			<tr valign="top" class="alternate">
				<td scope="row" width="20%"><label for="reviewer_headshot_image_3" class="abt-row-title"><?php esc_attr_e( 'Peer Reviewer Photo', 'abt-textdomain' )?></label></td>
				<td>
					<input type="text" name="reviewer_headshot_image_3" id="reviewer_headshot_image_3" value="<?php echo $peer_review_image_3; ?>" />
						<input type="button" id="reviewer_headshot_image_button_3" class="button" value="<?php esc_attr_e( 'Choose or Upload an Image', 'abt-textdomain' )?>" />
				</td>
			</tr>
			<tr valign="top">
				<td scope="row" colspan="2"><input class="button-primary" type="button" id="author_response_button_3" value="<?php esc_attr_e( 'Toggle Author Response' ); ?>" /></td>
			</tr>
		</table>
		<table class="form-table" id="author_response_3">
			<tr valign="top" class="alternate" style="border-top: solid 2px #dedede;">
				<td width="20%"><label for="author_name_3" class="abt-row-title"><?php esc_attr_e( 'Author Name', 'abt-textdomain' ) ?></label></td>
				<td><input type="text" class="large-text" name="author_name_3" id="author_name_3" value="<?php echo $author_name_3; ?>" /></td>
			</tr>
			<tr valign="top">
				<td width="20%"><label for="author_background_3" class="abt-row-title"><?php esc_attr_e( 'Author Background', 'abt-textdomain' ) ?></label></td>
				<td><input type="text" class="large-text" name="author_background_3" id="author_background_3" value="<?php echo $author_background_3; ?>" /></td>
			</tr>
			<tr valign="top" class="alternate">
				<td scope="row" width="20%"><label for="author_content_3"><?php esc_attr_e( 'Author Response', 'wp_admin_style' ); ?></label></td>
				<td><textarea id="author_content_3" name="author_content_3" cols="80" rows="5" class="large-text"><?php echo $author_content_3; ?></textarea><br></td>
			</tr>
			<tr valign="top">
				<td scope="row" width="20%"><label for="author_headshot_image_3" class="abt-row-title"><?php esc_attr_e( 'Author Photo', 'abt-textdomain' )?></label></td>
				<td>
					<input type="text" name="author_headshot_image_3" id="author_headshot_image_3" value="<?php echo $author_image_3; ?>" />
						<input type="button" id="author_headshot_image_button_3" class="button" value="<?php esc_attr_e( 'Choose or Upload an Image', 'abt-textdomain' )?>" />
				</td>
			</tr>
		</table>
	</div>
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

	// Begin Saving Meta Variables

	
	// Selector Variable
		if( isset( $_POST['reviewer_selector'] ) ) {
			update_post_meta( $post_id, 'reviewer_selector', esc_attr( $_POST[ 'reviewer_selector' ] ) );
		}

	// Variables for Review Box Heading
		if( isset( $_POST['peer_review_box_heading_1'] ) ) {
			update_post_meta( $post_id, 'peer_review_box_heading_1', esc_attr( $_POST[ 'peer_review_box_heading_1' ] ) );
		}
		if( isset( $_POST['peer_review_box_heading_2'] ) ) {
			update_post_meta( $post_id, 'peer_review_box_heading_2', esc_attr( $_POST[ 'peer_review_box_heading_2' ] ) );
		}
		if( isset( $_POST['peer_review_box_heading_3'] ) ) {
			update_post_meta( $post_id, 'peer_review_box_heading_3', esc_attr( $_POST[ 'peer_review_box_heading_3' ] ) );
		}

	// Variables for First Reviewer
		if( isset( $_POST[ 'reviewer_name_1' ] ) ) {
			update_post_meta( $post_id, 'reviewer_name_1', sanitize_text_field( $_POST[ 'reviewer_name_1' ] ) );
		}

		if( isset( $_POST[ 'reviewer_background_1' ] ) ) {
			update_post_meta( $post_id, 'reviewer_background_1', sanitize_text_field( $_POST[ 'reviewer_background_1' ] ) );
		}

		if( isset( $_POST[ 'peer_review_content_1' ] ) ) {
			update_post_meta( $post_id, 'peer_review_content_1', esc_attr( $_POST[ 'peer_review_content_1' ] ) );
		}

		if( isset( $_POST[ 'reviewer_headshot_image_1' ] ) ) {
			update_post_meta( $post_id, 'reviewer_headshot_image_1', $_POST[ 'reviewer_headshot_image_1' ] );
		}

	// Variables for First Author Response
		if( isset( $_POST[ 'author_name_1' ] ) ) {
			update_post_meta( $post_id, 'author_name_1', sanitize_text_field( $_POST[ 'author_name_1' ] ) );
		}

		if( isset( $_POST[ 'author_background_1' ] ) ) {
			update_post_meta( $post_id, 'author_background_1', sanitize_text_field( $_POST[ 'author_background_1' ] ) );
		}

		if( isset( $_POST[ 'author_content_1' ] ) ) {
			update_post_meta( $post_id, 'author_content_1', esc_attr( $_POST[ 'author_content_1' ] ) );
		}

		if( isset( $_POST[ 'author_headshot_image_1' ] ) ) {
			update_post_meta( $post_id, 'author_headshot_image_1', $_POST[ 'author_headshot_image_1' ] );
		}

	// Variables for Second Reviewer
		if( isset( $_POST[ 'reviewer_name_2' ] ) ) {
			update_post_meta( $post_id, 'reviewer_name_2', sanitize_text_field( $_POST[ 'reviewer_name_2' ] ) );
		}

		if( isset( $_POST[ 'reviewer_background_2' ] ) ) {
			update_post_meta( $post_id, 'reviewer_background_2', sanitize_text_field( $_POST[ 'reviewer_background_2' ] ) );
		}

		if( isset( $_POST[ 'peer_review_content_2' ] ) ) {
			update_post_meta( $post_id, 'peer_review_content_2', esc_attr( $_POST[ 'peer_review_content_2' ] ) );
		}
		if( isset( $_POST[ 'reviewer_headshot_image_2' ] ) ) {
			update_post_meta( $post_id, 'reviewer_headshot_image_2', $_POST[ 'reviewer_headshot_image_2' ] );
		}

	// Variables for Second Author Response
		if( isset( $_POST[ 'author_name_2' ] ) ) {
			update_post_meta( $post_id, 'author_name_2', sanitize_text_field( $_POST[ 'author_name_2' ] ) );
		}

		if( isset( $_POST[ 'author_background_2' ] ) ) {
			update_post_meta( $post_id, 'author_background_2', sanitize_text_field( $_POST[ 'author_background_2' ] ) );
		}

		if( isset( $_POST[ 'author_content_2' ] ) ) {
			update_post_meta( $post_id, 'author_content_2', esc_attr( $_POST[ 'author_content_2' ] ) );
		}

		if( isset( $_POST[ 'author_headshot_image_2' ] ) ) {
			update_post_meta( $post_id, 'author_headshot_image_2', $_POST[ 'author_headshot_image_2' ] );
		}


	// Variables for Third Reviewer
		if( isset( $_POST[ 'reviewer_name_3' ] ) ) {
			update_post_meta( $post_id, 'reviewer_name_3', sanitize_text_field( $_POST[ 'reviewer_name_3' ] ) );
		}

		if( isset( $_POST[ 'reviewer_background_3' ] ) ) {
			update_post_meta( $post_id, 'reviewer_background_3', sanitize_text_field( $_POST[ 'reviewer_background_3' ] ) );
		}

		if( isset( $_POST[ 'peer_review_content_3' ] ) ) {
			update_post_meta( $post_id, 'peer_review_content_3', esc_attr( $_POST[ 'peer_review_content_3' ] ) );
		}
		if( isset( $_POST[ 'reviewer_headshot_image_3' ] ) ) {
			update_post_meta( $post_id, 'reviewer_headshot_image_3', $_POST[ 'reviewer_headshot_image_3' ] );
		}

	// Variables for Third Author Response
		if( isset( $_POST[ 'author_name_3' ] ) ) {
			update_post_meta( $post_id, 'author_name_3', sanitize_text_field( $_POST[ 'author_name_3' ] ) );
		}

		if( isset( $_POST[ 'author_background_3' ] ) ) {
			update_post_meta( $post_id, 'author_background_3', sanitize_text_field( $_POST[ 'author_background_3' ] ) );
		}

		if( isset( $_POST[ 'author_content_3' ] ) ) {
			update_post_meta( $post_id, 'author_content_3', esc_attr( $_POST[ 'author_content_3' ] ) );
		}

		if( isset( $_POST[ 'author_headshot_image_3' ] ) ) {
			update_post_meta( $post_id, 'author_headshot_image_3', $_POST[ 'author_headshot_image_3' ] );
		}
 
}
add_action( 'save_post', 'abt_meta_save' );


function insert_the_meta( $text ) {
	
	if ( is_single() || is_page() ) {
		
		global $post;
		
		// Gather Variables
		$meta_master = get_post_meta( get_the_id() );

		// Set Reviewer Name Variables		
		for ( $i = 1; $i < 4; $i++ ) { 

			${'peer_review_box_heading_' . $i} = $meta_master['peer_review_box_heading_' . $i][0];
			${'reviewer_name_' . $i} = $meta_master['reviewer_name_' . $i][0];
			${'reviewer_background_' . $i} = $meta_master['reviewer_background_' . $i][0];
			${'peer_review_content_' . $i} = $meta_master['peer_review_content_' . $i][0];
			${'reviewer_headshot_image_' . $i} = $meta_master['reviewer_headshot_image_' . $i][0];

		}

		// Set Author Resonse Name Variables
		for ( $i = 1; $i < 4; $i++ ) { 
			
			${'author_name_' . $i} = $meta_master['author_name_' . $i][0];
			${'author_background_' . $i} = $meta_master['author_background_' . $i][0];
			${'author_content_' . $i} = $meta_master['author_content_' . $i][0];
			${'author_headshot_image_' . $i} = $meta_master['author_headshot_image_' . $i][0];
		
		}

		// Loop through and create peer review 'blocks'
		if ( $post->post_type == 'post' && $meta_master != '' ) { 
			
			for ( $i = 1; $i < 4; $i++ ) { 

				if ( ${'author_name_' . $i} != '' ) {
				
					${'author_block_' . $i} =
						'<div class="abt_chat_bubble">' . ${'author_content_' . $i} . '</div>' .
						'<div class="abt_PR_info"><img src="' . ${'author_headshot_image_' . $i} . '" width="100px" class="abt_PR_headshot">' .
							'<strong>' . ${'author_name_' . $i} . '</strong><br />' . 
							${'author_background_' . $i} . 
						'</div>';
				
				}
				
				if ( ${'reviewer_name_' . $i} != '' ) {
				
					${'reviewer_block_' . $i} =
						'<h3>' . ${'peer_review_box_heading_' . $i} . '</h3>' .
							'<div>' .
								'<div class="abt_chat_bubble">' . ${'peer_review_content_' . $i} . '</div>' .
								'<div class="abt_PR_info"><img src="' . ${'reviewer_headshot_image_' . $i} . '" width="100px" class="abt_PR_headshot">' .
									'<strong>' . ${'reviewer_name_' . $i} . '</strong><br />' . 
									${'reviewer_background_' . $i} . 
								'</div>' .
								( isset(${'author_block_' . $i}) ? ${'author_block_' . $i} : '' ) .
							'</div>';
				
				}
			}

			// Final logic check to make sure there is at least one peer review block available
			if ( $reviewer_block_1 != '' ) {
			
				$text .= 
						'<div id="abt_PR_boxes">' .
							$reviewer_block_1 . 
							( ( $reviewer_block_2 != '' ) ? $reviewer_block_2 : '' ) .
							( ( $reviewer_block_3 != '' ) ? $reviewer_block_3 : '' ) .
						'</div>';
			
			}

			return $text;

		}
	}
}
add_filter( 'the_content', 'insert_the_meta');


// Scripts for Peer Review Boxes

function abt_peer_review_js_enqueue() {

		wp_register_script('peer_review', plugin_dir_url( __FILE__ ) . 'peer-review.js', array( 'jquery', 'jquery-ui-accordion' ) );

		wp_enqueue_script('jquery');
		wp_enqueue_script('jquery-ui-accordion');
		wp_enqueue_script( 'peer_review' );

}
add_action('wp_enqueue_scripts', 'abt_peer_review_js_enqueue');





/**
 * Loads the image management javascript
 */
function abt_image_enqueue() {
    global $typenow;
    if( $typenow == 'post' ) {
        wp_enqueue_media();
 
        // Registers and enqueues the required javascript.
        wp_register_script( 'meta-box-image', plugin_dir_url( __FILE__ ) . 'meta-box-image.js', array( 'jquery' ) );
        wp_localize_script( 'meta-box-image', 'meta_image',
            array(
                'title' => __( 'Choose or Upload an Image', 'abt-textdomain' ),
                'button' => __( 'Use this image', 'abt-textdomain' ),
            )
        );
        wp_enqueue_script( 'meta-box-image' );
    }
}
add_action( 'admin_enqueue_scripts', 'abt_image_enqueue' );

?>
