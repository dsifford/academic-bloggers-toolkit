<?php 

add_action( 'abt_email_metrics', 'abt_email_metrics', 10, 1 );
function abt_email_metrics( $post_id ){
	
	// This conditional statement checks to see if the post is NEW and not being updated (working)
	// if( ( $_POST['post_status'] == 'publish' ) && ( $_POST['original_post_status'] != 'publish' ) ) {

		$author_id=$post->post_author;
		
		$name = get_the_author_meta( 'display_name', $author_id );
		$email = get_the_author_meta( 'user_email', $author_id );
		$title = $post->post_title;

		// Get the date 1 month from when this function is triggered (working)
		$future = strtotime('+1 month', time());

		$oneminute = strtotime('+1 minute', time());

		$realtimetest = date('m/d/Y', $future);

		$message = $name . '           ' . $email . '          ' . $realtimetest;

		// $message = sprintf ('Congratulations, %s! Your article “%s” has been published.' . "\n\n" . 'Test variable: %s', $name, $title, $testingtest );
	
	// }
		wp_mail( 'dereksifford@gmail.com', 'THIS IS A TEST', $message );


}

// WORKING!!!

// schedule_post_expiration_event runs when a Post is Published
add_action( 'publish_post', 'automated_email' );
function automated_email( $post_id ) {
 	
 	$oneminute = strtotime('+1 minute', time());
    // Schedule the actual event
    wp_schedule_single_event( $oneminute, 'abt_email_metrics', array( $post_id ) ); 
}



?>
