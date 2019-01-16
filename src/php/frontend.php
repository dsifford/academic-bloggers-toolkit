<?php
/**
 * Functionality related to rendering frontend content.
 *
 * @package ABT
 */

namespace ABT\Frontend;

defined( 'ABSPATH' ) || exit;

use function ABT\Utils\get_handle;

/**
 * Safely adds JSON data into a page to be used by scripts.
 *
 * @param string $id A unique ID for the data.
 * @param mixed  $data The data to be JSON encoded.
 */
function add_inline_json_script( string $id, $data ): void {
	add_action(
		'wp_footer',
		function () use ( $id, $data ) {
			?>
				<script
					id="<?php echo esc_attr( $id ); ?>"
					type="application/json"
					><?php echo wp_json_encode( $data ); ?></script>
			<?php
		}
	);
}

/**
 * Save a reference to the full bibliography as a JS global for parsing tooltips in paged posts.
 *
 * @param WP_Post $post The post.
 */
function collect_bibliography( $post ): void {
	if ( is_singular() && has_block( 'abt/bibliography', $post ) ) {
		$blocks    = parse_blocks( $post->post_content );
		$bib_index = array_search( 'abt/bibliography', array_column( $blocks, 'blockName' ), true );
		if ( is_int( $bib_index ) ) {
			add_inline_json_script( 'abt-bibliography-json', $blocks[ $bib_index ]['innerHTML'] );
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
		$base_handle = has_blocks( $post ) ? 'frontend' : 'legacy-frontend';
		wp_enqueue_style( get_handle( $base_handle, 'style' ) );
		wp_enqueue_script( get_handle( $base_handle, 'script' ) );
	} else {
		wp_enqueue_style( get_handle( 'frontend', 'style' ) );
	}
}
add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\enqueue_scripts' );

