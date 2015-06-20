<?php 

function abt_peer_review_meta() {
	add_meta_box( 'abt_peer_review', __( 'Add Peer Review(s)', 'abt-textdomain' ), 'abt_peer_review_callback', 'post', 'normal', 'high' );
}
add_action( 'add_meta_boxes', 'abt_peer_review_meta' );



function abt_peer_review_callback( $post ) {
	wp_nonce_field( basename( __file__ ), 'abt_nonce' );
 	
	$values = get_post_custom( $post->ID );
	
	// Variable for Select Box
		$selected = isset( $values['reviewer_selector'] ) ? esc_attr( $values['reviewer_selector'][0] ) : '';
	
	// Loop through and set variables

		for ( $i = 1; $i < 4; $i++ ) { 
			
			// Variables for Peer Review Box Headings
			${'peer_review_box_heading_' . $i} = isset( $values['peer_review_box_heading_' . $i] ) ? esc_attr( $values['peer_review_box_heading_' . $i][0] ) : '';
		
			// Reviewer Variables
			${'reviewer_name_' . $i} = isset( $values['reviewer_name_' . $i] ) ? esc_attr( $values['reviewer_name_' . $i][0] ) : '';
			${'reviewer_twitter_' . $i} = isset( $values['reviewer_twitter_' . $i] ) ? esc_attr( $values['reviewer_twitter_' . $i][0] ) : '';
			${'reviewer_background_' . $i} = isset( $values['reviewer_background_' . $i] ) ? esc_attr( $values['reviewer_background_' . $i][0] ) : '';
			${'peer_review_content_' . $i} = isset( $values['peer_review_content_' . $i] ) ? esc_attr( $values['peer_review_content_' . $i][0] ) : '';
			${'peer_review_image_' . $i} = isset( $values['reviewer_headshot_image_' . $i] ) ? esc_attr( $values['reviewer_headshot_image_' . $i][0] ) : '';

			// Author Variables
			${'author_name_' . $i} = isset( $values['author_name_' . $i] ) ? esc_attr( $values['author_name_' . $i][0] ) : '';
			${'author_twitter_' . $i} = isset( $values['author_twitter_' . $i] ) ? esc_attr( $values['author_twitter_' . $i][0] ) : '';
			${'author_background_' . $i} = isset( $values['author_background_' . $i] ) ? esc_attr( $values['author_background_' . $i][0] ) : '';
			${'author_content_' . $i} = isset( $values['author_content_' . $i] ) ? esc_attr( $values['author_content_' . $i][0] ) : '';
			${'author_image_' . $i} = isset( $values['author_headshot_image_' . $i] ) ? esc_attr( $values['author_headshot_image_' . $i][0] ) : '';

		}
	
	?>
	<div id="peer_review_metabox_wrapper">
	<select name="reviewer_selector" id="reviewer_selector">
		<option value="0" <?php selected( $selected, '0' ); ?>>Select Number of Reviewers</option>
		<option value="1" <?php selected( $selected, '1' ); ?>>One Reviewer</option>
		<option value="2" <?php selected( $selected, '2' ); ?>>Two Reviewers</option>
		<option value="3" <?php selected( $selected, '3' ); ?>>Three Reviewers</option>
	</select>

	<!-- Loop through and create 3 input tables -->

	<?php for ( $i = 1; $i < 4; $i++ ) : ?>

		<div id="tabs-<?php echo $i; ?>">
			<table class="form-table" style="border-top: solid 2px #dedede;">
				<tr valign="top" class="alternate">
					<td width="20%"><label for="peer_review_box_heading_<?php echo $i; ?>" class="abt-row-title" width="20%"><?php esc_attr_e( 'Heading for Peer Review', 'abt-textdomain' ) ?></label></td>
					<td colspan="3"><input type="text" class="large-text" name="peer_review_box_heading_<?php echo $i; ?>" id="peer_review_box_heading_<?php echo $i; ?>" value="<?php echo ${'peer_review_box_heading_' . $i}; ?>" /></td>
				</tr>
				<tr valign="top">
					<td width="20%"><label for="reviewer_name_<?php echo $i; ?>" class="abt-row-title" width="20%"><?php esc_attr_e( 'Peer Reviewer Name', 'abt-textdomain' ) ?></label></td>
					<td><input type="text" class="large-text" name="reviewer_name_<?php echo $i; ?>" id="reviewer_name_<?php echo $i; ?>" value="<?php echo ${'reviewer_name_' . $i}; ?>" /></td>
					<td width="1px"><label for="reviewer_twitter_<?php echo $i; ?>" class="abt-row-title" width="20%"><?php esc_attr_e( 'Twitter&nbsp;Handle', 'abt-textdomain' ) ?></label></td>
					<td><input type="text" class="large-text"  name="reviewer_twitter_<?php echo $i; ?>" id="reviewer_twitter_<?php echo $i; ?>" value="<?php echo ${'reviewer_twitter_' . $i}; ?>" /></td>
				</tr>
				<tr valign="top" class="alternate">
					<td width="20%"><label for="reviewer_background_<?php echo $i; ?>" class="abt-row-title" width="20%"><?php esc_attr_e( 'Peer Reviewer Background', 'abt-textdomain' ) ?></label></td>
					<td colspan="3"><input type="text" class="large-text" name="reviewer_background_<?php echo $i; ?>" id="reviewer_background_<?php echo $i; ?>" value="<?php echo ${'reviewer_background_' . $i}; ?>" /></td>
				</tr>
				<tr valign="top">
					<td scope="row" width="20%"><label for="peer_review_content_<?php echo $i; ?>" width="20%"><?php esc_attr_e( 'Peer Review', 'abt-textdomain' ); ?></label></td>
					<td colspan="3"><textarea id="peer_review_content_<?php echo $i; ?>" name="peer_review_content_<?php echo $i; ?>" cols="80" rows="5" class="large-text"><?php echo ${'peer_review_content_' . $i}; ?></textarea><br></td>
				</tr>
				<tr valign="top" class="alternate">
					<td scope="row" width="20%"><label for="reviewer_headshot_image_<?php echo $i; ?>" class="abt-row-title" width="20%"><?php esc_attr_e( 'Peer Reviewer Photo', 'abt-textdomain' )?></label></td>
					<td colspan="3">
						<input type="text" name="reviewer_headshot_image_<?php echo $i; ?>" id="reviewer_headshot_image_<?php echo $i; ?>" value="<?php echo ${'peer_review_image_' . $i}; ?>" />
							<input type="button" id="reviewer_headshot_image_button_<?php echo $i; ?>" class="button" value="<?php esc_attr_e( 'Choose or Upload an Image', 'abt-textdomain' )?>" />
					</td>
				</tr>
				<tr valign="top">
					<td scope="row" colspan="2"><input class="button-primary" type="button" id="author_response_button_<?php echo $i; ?>" value="<?php esc_attr_e( 'Toggle Author Response' ); ?>" /></td>
				</tr>
			</table>
			<table class="form-table" id="author_response_<?php echo $i; ?>">
				<tr valign="top" class="alternate" style="border-top: solid 2px #dedede;">
					<td width="20%"><label for="author_name_<?php echo $i; ?>" class="abt-row-title"><?php esc_attr_e( 'Author Name', 'abt-textdomain' ) ?></label></td>
					<td><input type="text" class="large-text" name="author_name_<?php echo $i; ?>" id="author_name_<?php echo $i; ?>" value="<?php echo ${'author_name_' . $i}; ?>" /></td>
					<td width="1px"><label for="author_twitter_<?php echo $i; ?>" class="abt-row-title" width="20%"><?php esc_attr_e( 'Twitter&nbsp;Handle', 'abt-textdomain' ) ?></label></td>
					<td><input type="text" class="large-text"  name="author_twitter_<?php echo $i; ?>" id="author_twitter_<?php echo $i; ?>" value="<?php echo ${'author_twitter_' . $i}; ?>" /></td>
				</tr>
				<tr valign="top">
					<td width="20%"><label for="author_background_<?php echo $i; ?>" class="abt-row-title"><?php esc_attr_e( 'Author Background', 'abt-textdomain' ) ?></label></td>
					<td colspan="3"><input type="text" class="large-text" name="author_background_<?php echo $i; ?>" id="author_background_<?php echo $i; ?>" value="<?php echo ${'author_background_' . $i}; ?>" /></td>
				</tr>
				<tr valign="top" class="alternate">
					<td scope="row" width="20%"><label for="author_content_<?php echo $i; ?>"><?php esc_attr_e( 'Author Response', 'wp_admin_style' ); ?></label></td>
					<td colspan="3"><textarea id="author_content_<?php echo $i; ?>" name="author_content_<?php echo $i; ?>" cols="80" rows="5" class="large-text"><?php echo ${'author_content_' . $i}; ?></textarea><br></td>
				</tr>
				<tr valign="top">
					<td scope="row" width="20%"><label for="author_headshot_image_<?php echo $i; ?>" class="abt-row-title"><?php esc_attr_e( 'Author Photo', 'abt-textdomain' )?></label></td>
					<td colspan="3">
						<input type="text" name="author_headshot_image_<?php echo $i; ?>" id="author_headshot_image_<?php echo $i; ?>" value="<?php echo ${'author_image_' . $i}; ?>" />
							<input type="button" id="author_headshot_image_button_<?php echo $i; ?>" class="button" value="<?php esc_attr_e( 'Choose or Upload an Image', 'abt-textdomain' )?>" />
					</td>
				</tr>
			</table>
		</div>

	<?php endfor; ?>
	
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

	// Loop through Reviewers / Authors
		for ( $i = 1; $i < 4; $i++ ) { 
			
			// Box Headings
			if( isset( $_POST['peer_review_box_heading_' . $i] ) ) {
				update_post_meta( $post_id, 'peer_review_box_heading_' . $i, esc_attr( $_POST[ 'peer_review_box_heading_' . $i ] ) );
			}

			// Reviewer Names
			if( isset( $_POST[ 'reviewer_name_' . $i ] ) ) {
				update_post_meta( $post_id, 'reviewer_name_' . $i, sanitize_text_field( $_POST[ 'reviewer_name_' . $i ] ) );
			}

			// Reviewer Twitter Handles
			if( isset( $_POST[ 'reviewer_twitter_' . $i ] ) ) {
				update_post_meta( $post_id, 'reviewer_twitter_' . $i, sanitize_text_field( $_POST[ 'reviewer_twitter_' . $i ] ) );
			}

			// Reviewer Backgrounds
			if( isset( $_POST[ 'reviewer_background_' . $i ] ) ) {
				update_post_meta( $post_id, 'reviewer_background_' . $i, sanitize_text_field( $_POST[ 'reviewer_background_' . $i ] ) );
			}

			// Reviews
			if( isset( $_POST[ 'peer_review_content_' . $i ] ) ) {
				update_post_meta( $post_id, 'peer_review_content_' . $i, esc_attr( $_POST[ 'peer_review_content_' . $i ] ) );
			}

			// Reviewer Headshot Image URLs
			if( isset( $_POST[ 'reviewer_headshot_image_' . $i ] ) ) {
				update_post_meta( $post_id, 'reviewer_headshot_image_' . $i, $_POST[ 'reviewer_headshot_image_' . $i ] );
			}

			// Responding Author Names
			if( isset( $_POST[ 'author_name_' . $i ] ) ) {
				update_post_meta( $post_id, 'author_name_' . $i, sanitize_text_field( $_POST[ 'author_name_' . $i ] ) );
			}

			// Author Twitter Handles
			if( isset( $_POST[ 'author_twitter_' . $i ] ) ) {
				update_post_meta( $post_id, 'author_twitter_' . $i, sanitize_text_field( $_POST[ 'author_twitter_' . $i ] ) );
			}

			// Responding Author Backgrounds
			if( isset( $_POST[ 'author_background_' . $i ] ) ) {
				update_post_meta( $post_id, 'author_background_' . $i, sanitize_text_field( $_POST[ 'author_background_' . $i ] ) );
			}

			// Author Responses
			if( isset( $_POST[ 'author_content_' . $i ] ) ) {
				update_post_meta( $post_id, 'author_content_' . $i, esc_attr( $_POST[ 'author_content_' . $i ] ) );
			}

			// Responding Author Headshot Image URLs
			if( isset( $_POST[ 'author_headshot_image_' . $i ] ) ) {
				update_post_meta( $post_id, 'author_headshot_image_' . $i, $_POST[ 'author_headshot_image_' . $i ] );
			}
		
		}
 
}
add_action( 'save_post', 'abt_meta_save' );


function insert_the_meta( $text ) {
	
	if ( is_single() || is_page() ) {
		
		global $post;

		$name = get_the_author_meta( 'display_name', $author );
		$email = get_the_author_meta( 'user_email', $author );
		
		// Gather Variables
		$meta_master = get_post_meta( get_the_id() );

		// Set Peer Review Variables		
		for ( $i = 1; $i < 4; $i++ ) { 

			${'peer_review_box_heading_' . $i} = $meta_master['peer_review_box_heading_' . $i][0];
			${'reviewer_name_' . $i} = $meta_master['reviewer_name_' . $i][0];
			${'reviewer_twitter_' . $i} = $meta_master['reviewer_twitter_' . $i][0];
			${'reviewer_background_' . $i} = $meta_master['reviewer_background_' . $i][0];
			${'peer_review_content_' . $i} = $meta_master['peer_review_content_' . $i][0];
			${'reviewer_headshot_image_' . $i} = $meta_master['reviewer_headshot_image_' . $i][0];
			${'author_name_' . $i} = $meta_master['author_name_' . $i][0];
			${'author_twitter_' . $i} = $meta_master['author_twitter_' . $i][0];
			${'author_background_' . $i} = $meta_master['author_background_' . $i][0];
			${'author_content_' . $i} = $meta_master['author_content_' . $i][0];
			${'author_headshot_image_' . $i} = $meta_master['author_headshot_image_' . $i][0];

		}

		// Format Twitter Handles
		for ( $i = 1; $i < 4; $i++ ) { 
			
			// Check if the variable exists or is not blank
			if ( ${'reviewer_twitter_' . $i} != null && ${'reviewer_twitter_' . $i} != '' ) {
			
				// Loop through to remove '@' symbol from Twitter handles if they are present
				if ( ${'reviewer_twitter_' . $i}[0] == "@" ) {

					${'reviewer_twitter_' . $i} = substr( ${'reviewer_twitter_' . $i} , 1);
				
				}

				// Set the styled twitter links
				${'reviewer_twitter_' . $i} = '<img style="vertical-align: middle;" src="https://g.twimg.com/Twitter_logo_blue.png" width="10px" height="10px"><a href="http://www.twitter.com/' . ${'reviewer_twitter_' . $i} . '" target="_blank">@' . ${'reviewer_twitter_' . $i} . '</a>' ;

			}
			
			// Check if the variable exists or is not blank
			if ( ${'author_twitter_' . $i} != null && ${'author_twitter_' . $i} != '' ) {
			
				// Loop through to remove '@' symbol from Twitter handles if they are present
				if ( ${'author_twitter_' . $i}[0] == "@" ) {

					${'author_twitter_' . $i} = substr( ${'author_twitter_' . $i} , 1);
				
				}

				// Set the styled twitter links
				${'author_twitter_' . $i} = '<img style="vertical-align: middle;" src="https://g.twimg.com/Twitter_logo_blue.png" width="10px" height="10px"><a href="http://www.twitter.com/' . ${'author_twitter_' . $i} . '" target="_blank">@' . ${'author_twitter_' . $i} . '</a>' ;

			}	
		
		}

		// Loop through and create peer review 'blocks'
		if ( $post->post_type == 'post' && $meta_master != '' ) { 
			
			for ( $i = 1; $i < 4; $i++ ) { 

				if ( ${'author_name_' . $i} != '' ) {
				
					${'author_block_' . $i} =
						'<div class="abt_chat_bubble">' . ${'author_content_' . $i} . '</div>' .
						'<div class="abt_PR_info"><img src="' . ${'author_headshot_image_' . $i} . '" width="100px" class="abt_PR_headshot">' .
							'<strong>' . ${'author_name_' . $i} . '</strong><br />' . 
							${'author_background_' . $i} . '<br />' .
							${'author_twitter_' . $i} .
						'</div>';
				
				}
				
				if ( ${'reviewer_name_' . $i} != '' ) {
				
					${'reviewer_block_' . $i} =
						'<h3>' . ${'peer_review_box_heading_' . $i} . '</h3>' .
							'<div>' .
								'<div class="abt_chat_bubble">' . ${'peer_review_content_' . $i} . '</div>' .
								'<div class="abt_PR_info"><img src="' . ${'reviewer_headshot_image_' . $i} . '" width="100px" class="abt_PR_headshot">' .
									'<strong>' . ${'reviewer_name_' . $i} . '</strong><br />' . 
									${'reviewer_background_' . $i} . '<br />' .
									${'reviewer_twitter_' . $i} .
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
