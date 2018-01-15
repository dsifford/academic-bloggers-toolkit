<?php

namespace ABT;

defined( 'ABSPATH' ) || exit;

require_once __DIR__ . '/i18n.php';

/**
 * Main Backend Class.
 */
class Backend {
	/**
	 * @var \ABT\Backend
	 */
	private static $instance = null;

	/**
	 * Instantiates the class and calls hooks on load.
	 */
	public static function init() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new \ABT\Backend();
		}
		return self::$instance;
	}

	/**
	 * Sets up all actions and filters for the backend class.
	 */
	public function __construct() {
		if ( is_admin() ) {
			add_action( 'load-post.php', [ $this, 'load_post' ] );
			add_action( 'load-post-new.php', [ $this, 'load_post' ] );
		}
	}

	public function load_post() {
		$post_type            = get_current_screen()->post_type;
		$disabled_post_types  = apply_filters( 'abt_disabled_post_types', [ 'acf', 'um_form' ] );
		$is_invalid_post_type = in_array(
			$post_type,
			array_merge(
				[ 'attachment' ],
				is_array( $disabled_post_types ) ? $disabled_post_types : []
			),
			true
		);

		if ( $is_invalid_post_type ) {
			return;
		}
		add_action( 'add_meta_boxes', [ $this, 'add_metaboxes' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'register_scripts' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
		add_action( 'admin_head', [ $this, 'init_tinymce' ] );
		add_action( 'admin_notices', [ $this, 'user_alert' ] );
		add_action( 'save_post', [ $this, 'save_meta' ] );
		add_filter( 'mce_css', [ $this, 'load_tinymce_css' ] );
	}

	/**
	 * Alerts the user that the plugin will not work if he/she doesn't have 'Rich Editing' enabled.
	 */
	public function user_alert() {
		if ( 'true' === get_user_option( 'rich_editing' ) ) {
			return;
		}
		echo wp_kses(
			sprintf(
				'<div class="notice notice-warning is-dismissible"><p><strong>%1s</strong>: %2s</p></div>',
				__( 'Notice', 'academic-bloggers-toolkit' ),
				__( "Rich editing must be enabled to use the Academic Blogger's Toolkit plugin", 'academic-bloggers-toolkit' )
			),
			[
				'div'    => [
					'class' => [],
				],
				'p'      => [],
				'strong' => [],
			]
		);
	}

	/**
	 * Instantiates the TinyMCE plugin.
	 */
	public function init_tinymce() {
		if ( 'true' === get_user_option( 'rich_editing' ) ) {
			add_filter( 'mce_external_plugins', [ $this, 'register_tinymce_plugins' ] );
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
		$plugin_array['noneditable'] = ABT_ROOT_URI . 'vendor/noneditable.js';
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
		$mce_css .= ABT_ROOT_URI . 'css/tinymce.css';
		return $mce_css;
	}

	/**
	 * Adds metaboxes to posts and pages.
	 *
	 * @param string $post_type The post type.
	 */
	public function add_metaboxes( $post_type ) {
		$disabled_post_types = apply_filters( 'abt_disabled_post_types', [ 'acf', 'um_form' ] );
		$all_types           = get_post_types();
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

		// @codingStandardsIgnoreStart
		// Ignoring the next line because the WordPress Standards are still flagging
		// this as unsanitized. They are wrong.
		if (
			isset( $_POST['abt-reflist-state'], $_POST['abt_nonce'] )
			&& wp_verify_nonce( sanitize_key( $_POST['abt_nonce'] ), basename( __FILE__ ) ) ) {
				$reflist_state = $_POST['abt-reflist-state'];
				update_post_meta( $post_id, '_abt-reflist-state', $reflist_state );
		}
		// @codingStandardsIgnoreEnd
	}

	/**
	 * Registers all styles and scripts.
	 */
	public function register_scripts() {
		wp_register_style( 'abt-fonts', '//fonts.googleapis.com/css?family=Roboto:300,400,500,700&subset=cyrillic,cyrillic-ext,greek,greek-ext,latin-ext,vietnamese', [], null );
		wp_register_style( 'abt-reference-list', ABT_ROOT_URI . 'css/reference-list.css', [ 'dashicons', 'abt-fonts' ], ABT_VERSION );

		wp_register_script( 'abt-reference-list', ABT_ROOT_URI . 'js/reference-list.js', [], ABT_VERSION );
		wp_register_script( 'abt-changelog', '//cdn.headwayapp.co/widget.js', [], null, true );
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

		// Begin legacy checks.
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
		// End legacy checks.
		wp_localize_script(
			'abt-reference-list', 'ABT', [
				'i18n'    => $translations,
				'options' => $opts,
				'state'   => $state,
				'styles'  => get_citation_styles(),
				'wp'      => $this->localize_wordpress_constants(),
			]
		);

		wp_dequeue_script( 'autosave' );
		wp_enqueue_style( 'abt-reference-list' );
		wp_enqueue_script( 'abt-reference-list' );
		wp_enqueue_script( 'abt-changelog' );
	}

	/**
	 * Returns an array of a few select WordPress constants (for use in JS).
	 */
	private function localize_wordpress_constants() {
		return [
			'abt_url'       => ABT_ROOT_URI,
			'home_url'      => home_url(),
			'plugins_url'   => plugins_url(),
			'wp_upload_dir' => wp_get_upload_dir(),
			'info'          => [
				'site'     => [
					'language' => get_bloginfo( 'language' ),
					'name'     => get_bloginfo( 'name' ),
					'plugins'  => get_option( 'active_plugins' ),
					'theme'    => get_template(),
					'url'      => get_bloginfo( 'url' ),
				],
				'versions' => [
					'abt'       => ABT_VERSION,
					'php'       => PHP_VERSION,
					'wordpress' => get_bloginfo( 'version' ),
				],
			],
		];
	}
}
\ABT\Backend::init();
