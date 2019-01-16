<?php
/**
 * Legacy backend class
 *
 * @package ABT
 */

namespace ABT;

defined( 'ABSPATH' ) || exit;

use function ABT\Utils\{
	create_admin_notice,
	get_citation_styles,
	get_handle,
};

require_once __DIR__ . '/i18n.php';

/**
 * Main Backend Class.
 *
 * @deprecated
 */
class Backend {
	/**
	 * The class singleton instance.
	 *
	 * @var \ABT\Backend
	 */
	private static $instance = null;

	/**
	 * Instantiates the class and calls hooks on load.
	 */
	public static function init() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new \ABT\Backend();
			add_action( 'init', [ self::$instance, 'register' ] );
		}
		return self::$instance;
	}

	/**
	 * Registers hooks for this class.
	 */
	public function register() {
		$has_rich_editing = (bool) get_user_option( 'rich_editing' );
		if ( is_admin() && class_exists( '\Classic_Editor' ) ) {
			if ( $has_rich_editing ) {
				add_action( 'load-post.php', [ $this, 'check_classic_state' ] );
				add_action( 'load-post-new.php', [ $this, 'check_classic_option' ] );
			} else {
				create_admin_notice(
					__( "Rich editing must be enabled to use the Academic Blogger's Toolkit plugin.", 'academic-bloggers-toolkit' ),
					'warning'
				);
			}
		}
	}

	/**
	 * Ensures that classic editor is enabled for existing posts.
	 */
	public function check_classic_state() {
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
					),
				);
			} else {
				$this->load_post();
			}
		}
	}

	/**
	 * Ensures that classic editor is enabled for new posts.
	 */
	public function check_classic_option() {
		if ( get_option( 'classic-editor-replace' ) !== 'block' ) {
			$this->load_post();
		}
	}

	/**
	 * Registers hooks for classic editor.
	 */
	public function load_post() {
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
			add_action( 'add_meta_boxes', [ $this, 'add_metaboxes' ] );
			add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
			add_action( 'save_post', [ $this, 'save_meta' ] );
			add_filter( 'mce_external_plugins', [ $this, 'register_tinymce_plugins' ] );
			add_filter( 'mce_css', [ $this, 'load_tinymce_css' ] );
		}
	}

	/**
	 * Registers the TinyMCE plugins + loads fonts.
	 *
	 * @param string[] $plugin_array array of TinyMCE plugins.
	 *
	 * @return string[] Array of TinyMCE plugins with plugins added
	 */
	public function register_tinymce_plugins( $plugin_array ) {
		$plugin_array['noneditable'] = ABT_ROOT_URI . '/vendor/noneditable.js';
		return $plugin_array;
	}

	/**
	 * Loads the required stylesheet into TinyMCE ( required for proper citation parsing ).
	 *
	 * @param string $mce_css CSS string.
	 *
	 * @return string CSS string + custom CSS appended
	 */
	public function load_tinymce_css( $mce_css ) {
		if ( ! empty( $mce_css ) ) {
			$mce_css .= ',';
		}
		$mce_css .= ABT_ROOT_URI . '/bundle/drivers/tinymce.css';
		return $mce_css;
	}

	/**
	 * Adds metaboxes to posts and pages.
	 *
	 * @param string $post_type The post type.
	 */
	public function add_metaboxes( $post_type ) {
		$all_types = get_post_types();
		add_meta_box(
			'abt-reflist',
			__( 'Reference List', 'academic-bloggers-toolkit' ),
			[ $this, 'render_reference_list' ],
			$all_types,
			'side',
			'high'
		);
	}

	/**
	 * Renders the HTML for React to mount into.
	 */
	public function render_reference_list() {
		wp_nonce_field( basename( __FILE__ ), 'abt_nonce' );
		include __DIR__ . '/views/reference-list.php';
	}

	/**
	 * Saves the Peer Review meta fields to the database.
	 *
	 * @param string $post_id The post ID.
	 */
	public function save_meta( $post_id ) {
		if ( wp_is_post_autosave( $post_id ) || wp_is_post_revision( $post_id ) ) {
			return;
		}
		if (
			isset( $_POST['abt-reflist-state'], $_POST['abt_nonce'] )
			&& wp_verify_nonce( sanitize_key( $_POST['abt_nonce'] ), basename( __FILE__ ) ) ) {
				$reflist_state = $_POST['abt-reflist-state']; // phpcs:ignore
				update_post_meta( $post_id, '_abt-reflist-state', $reflist_state );
		}
	}

	/**
	 * Registers and enqueues all required scripts.
	 */
	public function enqueue_scripts() {
		global $post;

		$translations = i18n\generate_translations();
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
		wp_enqueue_style( get_handle( 'legacy-editor', 'style' ) );
		wp_enqueue_script( get_handle( 'legacy-editor', 'script' ) );
		wp_localize_script(
			get_handle( 'legacy-editor', 'script' ),
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
}
Backend::init();
