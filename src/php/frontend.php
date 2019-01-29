<?php
/**
 * Functionality related to rendering frontend content.
 *
 * @package ABT
 */

declare(strict_types=1);

namespace ABT\Frontend;

defined( 'ABSPATH' ) || exit;

use function ABT\Utils\{
	add_json_script,
	get_handle
};
use WP_Post;

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
		$author_ids   = array_merge( $author_ids, $coauthor_ids );
	}

	$authors = get_users(
		[
			'include' => $author_ids,
		]
	);

	foreach ( $authors as $author ) {
		if ( $author->first_name && $author->last_name ) {
			$parsed = $author->first_name . '|' . $author->last_name;
			?>
				<meta property="abt:author" content="<?php echo esc_attr( $parsed ); ?>" />
			<?php
		}
	}
}
add_action( 'wp_head', __NAMESPACE__ . '\inject_author_meta' );

/**
 * Save a reference to the full bibliography as a JS global for parsing tooltips in paged posts.
 *
 * @param WP_Post $post The post.
 */
function collect_bibliography( WP_Post $post ) {
	if ( is_singular() && has_block( 'abt/bibliography', $post ) ) {
		$blocks    = parse_blocks( $post->post_content );
		$bib_index = array_search( 'abt/bibliography', array_column( $blocks, 'blockName' ), true );
		if ( is_int( $bib_index ) ) {
			add_json_script( 'abt-bibliography-json', $blocks[ $bib_index ]['innerHTML'] );
		}
	}
}
add_action( 'the_post', __NAMESPACE__ . '\collect_bibliography' );

/**
 * Enqueues frontend CSS and JS.
 */
function enqueue_scripts() {
	global $post;
	if ( is_singular() ) {
		$base_handle = has_blocks( $post ) ? 'frontend' : 'frontend-legacy';
		wp_enqueue_style( get_handle( $base_handle, 'style' ) );
		wp_enqueue_script( get_handle( $base_handle, 'script' ) );
	} else {
		wp_enqueue_style( get_handle( 'frontend', 'style' ) );
	}
}
add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\enqueue_scripts' );

