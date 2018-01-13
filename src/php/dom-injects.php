<?php

namespace ABT\DOM;

defined( 'ABSPATH' ) || exit;

/**
 * Injects post author metadata into the <head> of posts so that others using
 * the plugin can easily extract author information.
 */
function inject_author_meta() {
	global $post;
	if ( ! $post || ! is_singular() ) {
		return;
	}

	$author_ids = [ $post->post_author ];
	if ( function_exists( 'get_coauthors' ) ) {
		$coauthor_ids = array_map(
			function( $coauthor ) {
				return $coauthor->ID;
			},
			get_coauthors( $post->ID )
		);
		$author_ids = array_merge( $author_ids, $coauthor_ids );
	}

	$authors = get_users(
		[
			'include' => $author_ids,
		]
	);

	foreach ( $authors as $author ) {
		$parsed = $author->first_name . '|' . $author->last_name;
		?>
			<meta property="abt:author" content="<?php echo esc_attr( $parsed ); ?>" />
		<?php
	}
}
add_action( 'wp_head', 'ABT\DOM\inject_author_meta', 1 );
