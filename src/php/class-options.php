<?php

namespace ABT;

defined( 'ABSPATH' ) || exit;

use function ABT\Utils\enqueue_script;

require_once __DIR__ . '/i18n.php';

class Options {
	/**
	 * @var \ABT\Options
	 */
	private static $instance = null;

	private $abt_globals;

	public static function init() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new \ABT\Options();
		}
		return self::$instance;
	}

	/**
	 * Save the array of citation styles to $this->citation_styles and add a
	 *   link to the options page in the admin menu.
	 */
	public function __construct() {
		$this->abt_globals = [
			'styles' => get_citation_styles(),
			'i18n'   => i18n\generate_translations(),
		];
		add_action( 'admin_menu', [ $this, 'add_options_page' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
	}

	public function enqueue_scripts( $hook ) {
		if ( 'settings_page_abt-options' !== $hook ) {
			return;
		}
		enqueue_script( 'options-page' );
		wp_enqueue_script( 'abt-codepen' );

		// Enqueue code editor and settings for manipulating CSS.
		$settings = wp_enqueue_code_editor(
			[
				'type'       => 'text/css',
				'codemirror' => [
					'lineWrapping' => false,
				],
			]
		);

		$this->abt_globals = array_replace_recursive(
			$this->abt_globals,
			[
				'css_editor_settings' => $settings,
				'options'             => get_option( ABT_OPTIONS_KEY ),
			]
		);
	}

	/**
	 * Instantiates the options page.
	 */
	public function add_options_page() {
		add_options_page(
			__( "Academic Blogger's Toolkit Options", 'academic-bloggers-toolkit' ),
			__( "Academic Blogger's Toolkit", 'academic-bloggers-toolkit' ),
			'manage_options',
			'abt-options',
			[ $this, 'render_options_page' ]
		);
	}

	/**
	 * Renders the options page.
	 */
	public function render_options_page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'You do not have sufficient permissions to access this page.', 'academic-bloggers-toolkit' ) );
		}

		$form_nonce   = 'abt-options-nonce';
		$form_actions = (object) [
			'custom_css'      => 'abt-form-update-custom-css',
			'citation_style'  => 'abt-form-update-citation-style',
			'display_options' => 'abt-form-update-display-options',
		];
		$options      = [
			'citation_style'  => [],
			'display_options' => [],
		];

		// @codingStandardsIgnoreStart
		// Ignoring the nonce verification here because it takes place below.
		$post = wp_unslash( $_POST );
		// @codingStandardsIgnoreEnd

		if ( isset( $post[ $form_nonce ] ) ) {
			$nonce = $post[ $form_nonce ];
			switch ( true ) {
				case wp_verify_nonce( $nonce, $form_actions->custom_css ):
					$options['custom_css'] = $post['custom_css'];
					break;
				case wp_verify_nonce( $nonce, $form_actions->citation_style ):
					$options['citation_style']['kind']  = $post['style_kind'];
					$options['citation_style']['label'] = $post['style_label'];
					$options['citation_style']['value'] = $post['style_value'];
					break;
				case wp_verify_nonce( $nonce, $form_actions->display_options ):
					$options['display_options']['bibliography']      = $post['bibliography'];
					$options['display_options']['links']             = $post['links'];
					$options['display_options']['bib_heading']       = sanitize_text_field( $post['bib_heading'] );
					$options['display_options']['bib_heading_level'] = $post['bib_heading_level'];
			}
		}

		$options = array_replace_recursive( get_option( ABT_OPTIONS_KEY ), $options );
		update_option( 'abt_options', $options );

		$this->abt_globals = array_replace_recursive(
			$this->abt_globals,
			[
				'options' => $options,
			]
		);

		wp_localize_script( 'abt-options-page-script', 'ABT', $this->abt_globals );

		// Convert associative array to object because it's just easier to work with.
		$options = json_decode( wp_json_encode( $options ) );
		?>
		<div class="wrap">
			<h1 class="options-page__title">
				<span><?php esc_html_e( "Academic Blogger's Toolkit Options", 'academic-bloggers-toolkit' ); ?></span>
				<a
					class="button-primary"
					href="https://donorbox.org/academic-bloggers-toolkit"
					target="_blank"
					rel="noopener noreferrer"
				>&hearts; Donate</a>
			</h1>
			<div id="poststuff">
				<div id="post-body" class="metabox-holder">
					<div id="post-body-content">
						<div class="meta-box-sortables ui-sortable">
							<?php include __DIR__ . '/views/options-page.php'; ?>
						</div>
					</div>
				</div>
			</div>
		</div>
		<?php
	}
}
Options::init();
