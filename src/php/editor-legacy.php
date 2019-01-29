<?php
/**
 * Legacy editor functionality.
 *
 * @package ABT
 */

declare(strict_types=1);

namespace ABT\Legacy\Editor;

defined( 'ABSPATH' ) || exit;

use ABT\Form_Actions;
use function ABT\i18n\generate_translations;
use function ABT\Utils\{
	create_admin_notice,
	get_citation_styles,
	get_handle
};

/**
 * Registers load hooks.
 */
function register() {
	$has_rich_editing = (bool) get_user_option( 'rich_editing' );
	if ( class_exists( '\Classic_Editor' ) ) {
		if ( $has_rich_editing ) {
			add_action( 'load-post.php', __NAMESPACE__ . '\check_classic_state' );
			add_action( 'load-post-new.php', __NAMESPACE__ . '\check_classic_option' );
		} else {
			create_admin_notice(
				__( "Rich editing must be enabled to use the Academic Blogger's Toolkit plugin.", 'academic-bloggers-toolkit' ),
				'warning'
			);
		}
	}
}
add_action( 'init', __NAMESPACE__ . '\register' );

/**
 * Ensures that classic editor is enabled for existing posts.
 */
function check_classic_state() {
	$post_id          = filter_input( INPUT_GET, 'post', FILTER_VALIDATE_INT );
	$saved_mode       = get_post_meta( $post_id, 'classic-editor-remember', true );
	$is_swapping_mode = (
		filter_input( INPUT_GET, 'classic-editor__forget' ) === '' &&
		filter_input( INPUT_SERVER, 'HTTP_CACHE_CONTROL' ) !== 'max-age=0'
	);
	$is_classic       = (
		( $saved_mode !== 'block-editor' && ! $is_swapping_mode ) ||
		( $saved_mode === 'block-editor' && $is_swapping_mode )
	);
	if ( $is_classic ) {
		if ( has_blocks( $post_id ) ) {
			create_admin_notice(
				__(
					"Academic Blogger's Toolkit cannot be used in the Classic Editor once a post has been modified in the Block Editor.",
					'academic-bloggers-toolkit'
				)
			);
		} else {
			load_post();
		}
	}
}

/**
 * Ensures that classic editor is enabled for new posts.
 */
function check_classic_option() {
	if ( get_option( 'classic-editor-replace' ) !== 'block' ) {
		load_post();
	}
}

/**
 * Registers hooks for classic editor.
 */
function load_post() {
	$post_type           = get_current_screen()->post_type;
	$disabled_post_types = apply_filters( 'abt_disabled_post_types', [ 'acf', 'um_form' ] );
	$is_valid_post_type  = ! in_array(
		$post_type,
		array_merge(
			[ 'attachment' ],
			is_array( $disabled_post_types ) ? $disabled_post_types : []
		),
		true
	);
	if ( $is_valid_post_type ) {
		add_action( 'add_meta_boxes', __NAMESPACE__ . '\add_metaboxes' );
		add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\enqueue_scripts' );
		add_action( 'save_post', __NAMESPACE__ . '\save_meta' );
		add_filter(
			'mce_css',
			function( string $mce_css ): string {
				return join(
					',',
					array_filter(
						[
							$mce_css,
							ABT_ROOT_URI . '/bundle/drivers/tinymce.css',
						]
					)
				);
			}
		);
		add_filter(
			'mce_external_plugins',
			function( array $plugins ): array {
				$plugins['noneditable'] = '//cdn.jsdelivr.net/npm/tinymce/plugins/noneditable/plugin.min.js';
				return $plugins;
			}
		);
	}
}

/**
 * Adds metaboxes to posts and pages.
 *
 * @param string $post_type The post type.
 */
function add_metaboxes( string $post_type ) {
	add_meta_box(
		'abt-reflist',
		__( 'Reference List', 'academic-bloggers-toolkit' ),
		function() {
			wp_nonce_field( Form_Actions::SET_LEGACY_EDITOR_STATE, ABT_NONCE );
			?>
				<div id='abt-reflist__root'>
					<div id="abt_preload_container"></div>
				</div>
				<script type="text/javascript">
					( function ( global ) {
						var el = document.createElement( 'span' ); el.id = 'abt_changelog';
						document.querySelector( '#abt-reflist > h2' ).appendChild( el );
						global.HW_config={ selector:'#abt_changelog', account:'LJ4gE7' };
					} )( window );
				</script>
			<?php
		},
		get_post_types(),
		'side',
		'high'
	);
}

/**
 * Saves the Peer Review meta fields to the database.
 *
 * @param int $post_id The post ID.
 */
function save_meta( int $post_id ) {
	if (
		! wp_is_post_autosave( $post_id ) &&
		! wp_is_post_revision( $post_id ) &&
		isset( $_POST['abt-reflist-state'], $_POST[ ABT_NONCE ] ) &&
		wp_verify_nonce( sanitize_key( $_POST[ ABT_NONCE ] ), Form_Actions::SET_LEGACY_EDITOR_STATE )
	) {
		$reflist_state = $_POST['abt-reflist-state']; // phpcs:ignore
		update_post_meta( $post_id, '_abt-reflist-state', $reflist_state );
	}
}

/**
 * Enqueues legacy editor scripts.
 */
function enqueue_scripts() {
	global $post;

	require_once __DIR__ . '/i18n.php';

	$translations = generate_translations();
	$state        = json_decode( get_post_meta( $post->ID, '_abt-reflist-state', true ), true );
	$opts         = get_option( ABT_OPTIONS_KEY );

	if ( empty( $state ) ) {
		$state = [
			'cache'           => [
				'style'  => $opts['citation_style'],
				'locale' => get_locale(),
			],
			'citationByIndex' => [],
			'CSL'             => (object) [],
		];
	}

	$state['displayOptions'] = $opts['display_options'];

	// Legacy checks.
	if ( array_key_exists( 'processorState', $state ) ) {
		$state['CSL'] = $state['processorState'];
		unset( $state['processorState'] );
	}
	if ( array_key_exists( 'citations', $state ) ) {
		$state['citationByIndex'] = $state['citations']['citationByIndex'];
		unset( $state['citations'] );
	}
	if ( is_string( $state['cache']['style'] ) ) {
		$state['cache']['style'] = $opts['citation_style'];
	}

	wp_dequeue_script( 'autosave' );
	wp_enqueue_style( get_handle( 'editor-legacy', 'style' ) );
	wp_enqueue_script( get_handle( 'editor-legacy', 'script' ) );
	wp_localize_script(
		get_handle( 'editor-legacy', 'script' ),
		'ABT',
		[
			'i18n'    => $translations,
			'options' => $opts,
			'state'   => $state,
			'styles'  => get_citation_styles(),
			'wp'      => [
				'abt_url' => ABT_ROOT_URI,
			],
		]
	);
}

