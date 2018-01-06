<!-- Feedback Box -->
<div class="postbox">
	<h2><?php esc_html_e( 'Please send your feedback!', 'academic-bloggers-toolkit' ); ?></h2>
	<div class="inside">
	<?php
		echo wp_kses(
			sprintf(
				/* translators: %s: github url */
				__( 'If you experience a bug or would like to request a new feature, please visit the <a href="%s">GitHub Repository</a> and submit an issue.', 'academic-bloggers-toolkit' ),
				'https://github.com/dsifford/academic-bloggers-toolkit'
			),
			[
				'a' => [
					'href' => [],
				],
			]
		)
	?>
	</div>
</div>

<!-- Plugin Requirements -->
<div class="postbox">
	<h2><?php esc_html_e( 'Plugin Requirements Check', 'academic-bloggers-toolkit' ); ?></h2>
	<div class="inside">
		<table class="widefat">
			<tr>
				<th>
					<strong><?php esc_html_e( 'PHP Version', 'academic-bloggers-toolkit' ); ?></strong>
				</th>
				<td>
					<?php echo esc_html( PHP_VERSION ); ?>
				</td>
				<td>
				<?php if ( version_compare( PHP_VERSION, '7.0', '<' ) ) : ?>
					<strong style="color: red;"><?php esc_html_e( 'PHP version should be at least 7.0', 'academic-bloggers-toolkit' ); ?></strong>
				<?php endif; ?>
				</td>
			</tr>
			<tr class="alternate">
				<th>
					<strong>
					<?php
						echo wp_kses(
							sprintf(
								/* translators: %s: dom */
								__( 'PHP %s Extension', 'academic-bloggers-toolkit' ),
								'<code>dom</code>'
							),
							[
								'code' => [],
							]
						);
					?>
					</strong>
				</th>
				<td>
				<?php if ( extension_loaded( 'dom' ) ) : ?>
					<?php esc_html_e( 'Enabled', 'academic-bloggers-toolkit' ); ?>
				<?php else : ?>
					<strong style="color: red;"><?php esc_html_e( 'Disabled', 'academic-bloggers-toolkit' ); ?></strong>
				<?php endif; ?>
				</td>
				<td>
				<?php if ( ! extension_loaded( 'dom' ) ) : ?>
					<p>
					<?php
						echo wp_kses(
							sprintf(
								/* translators: %s: dom */
								__( 'The %s PHP extension is required for some plugin features.', 'academic-bloggers-toolkit' ),
								'<code>dom</code>'
							),
							[
								'code' => [],
							]
						);
					?>
					</p>
					<p>
						<a href="http://php.net/manual/en/intro.dom.php"><?php esc_html_e( 'Click here for installation instructions', 'academic-bloggers-toolkit' ); ?></a>
					</p>
				<?php endif; ?>
				</td>
			</tr>

			<tr>
				<th>
					<strong>
					<?php
						echo wp_kses(
							sprintf(
								/* translators: %s: libxml */
								__( 'PHP %s Extension', 'academic-bloggers-toolkit' ),
								'<code>libxml</code>'
							),
							[
								'code' => [],
							]
						);
					?>
					</strong>
				</th>
				<td>
				<?php if ( extension_loaded( 'libxml' ) ) : ?>
					<?php esc_html_e( 'Enabled', 'academic-bloggers-toolkit' ); ?>
				<?php else : ?>
					<strong style="color: red;"><?php esc_html_e( 'Disabled', 'academic-bloggers-toolkit' ); ?></strong>
				<?php endif; ?>
				</td>
				<td>
				<?php if ( ! extension_loaded( 'libxml' ) ) : ?>
					<p>
					<?php
						echo wp_kses(
							sprintf(
								/* translators: %s: libxml */
								__( 'The %s PHP extension is required for some plugin features.', 'academic-bloggers-toolkit' ),
								'<code>libxml</code>'
							),
							[
								'code' => [],
							]
						);
					?>
					</p>
					<p>
						<a href="http://php.net/manual/en/intro.libxml.php"><?php esc_html_e( 'Click here for installation instructions', 'academic-bloggers-toolkit' ); ?></a>
					</p>
				<?php endif; ?>
				</td>
			</tr>
			<tr class="alternate">
				<th>
					<strong><?php esc_html_e( 'Recommended Browsers', 'academic-bloggers-toolkit' ); ?></strong>
				</th>
				<td colspan="2">
					<?php esc_html_e( 'Google Chrome, Mozilla Firefox, Apple Safari, or Microsoft Edge.', 'academic-bloggers-toolkit' ); ?>
				</td>
			</tr>
		</table>
		<p>
			<?php
				echo wp_kses(
					sprintf(
						/* translators: 1: LimitRequestBody, 2: SubstituteMaxLineLength */
						__( 'Note: Be sure that your server does not have %1$s or %2$s configured in your php.ini file or .htaccess file. Both can cause issues.', 'academic-bloggers-toolkit' ),
						'<code>LimitRequestBody</code>',
						'<code>SubstituteMaxLineLength</code>'
					),
					[
						'code' => [],
					]
				);
			?>
		</p>
	</div>
</div>

<!-- Default Citation Style -->
<form method="post">
	<?php wp_nonce_field( $form_actions->citation_style, $form_nonce ); ?>
	<div class="postbox">
		<h2><?php esc_html_e( 'Default Citation Style', 'academic-bloggers-toolkit' ); ?></h2>
		<div id="style-form-root" class="inside"></div>
	</div>
	<div class="abt-submit-row">
		<input
			type="submit"
			value="<?php esc_attr_e( 'Update', 'academic-bloggers-toolkit' ); ?>"
			aria-label="Update citation options"
			class="button-primary"
		/>
	</div>
</form>

<!-- Display Options -->
<form method="post">
	<?php wp_nonce_field( $form_actions->display_options, $form_nonce ); ?>
	<div class="postbox">
		<h2><?php esc_html_e( 'Display Options', 'academic-bloggers-toolkit' ); ?></h2>
		<div id="display-options-form-root" class="inside"></div>
	</div>
	<div class="abt-submit-row">
		<input
			type="submit"
			value="<?php esc_attr_e( 'Update', 'academic-bloggers-toolkit' ); ?>"
			aria-label="Update display options"
			class="button-primary"
		/>
	</div>
</form>

<!-- Override CSS -->
<form method="post">
	<?php wp_nonce_field( $form_actions->custom_css, $form_nonce ); ?>
	<div class="postbox">
		<h2><?php esc_html_e( 'Override CSS', 'academic-bloggers-toolkit' ); ?></h2>
		<div class="inside" style="margin: 0; padding: 0;">
			<div class="custom-css__container">
				<textarea name="custom_css" id="custom_css" ><?php echo $options->custom_css; // WPCS: XSS ok. ?></textarea>
				<div class="custom-css__selectors">
					<h3><?php esc_html_e( 'CSS Selectors used by this plugin', 'academic-bloggers-toolkit' ); ?></h3>
					<dl>
						<dt><?php esc_html_e( 'Inline Citations', 'academic-bloggers-toolkit' ); ?></dt>
						<dd>
						<?php foreach ( [ '.abt-citation' ] as $selector ) : ?>
							<code><?php echo esc_html( $selector ); ?></code>
						<?php endforeach; ?>
						</dd>
					</dl>
					<dl>
						<dt><?php esc_html_e( 'Citation Tooltips', 'academic-bloggers-toolkit' ); ?></dt>
						<dd>
						<?php foreach ( [ '.abt-tooltip', '.abt_tooltip__callout', '.abt-tooltip__close-button' ] as $selector ) : ?>
							<code><?php echo esc_html( $selector ); ?></code>
						<?php endforeach; ?>
						</dd>
					</dl>
					<dl>
						<dt><?php esc_html_e( 'Bibliography', 'academic-bloggers-toolkit' ); ?></dt>
						<dd>
						<?php foreach ( [ '.abt-bibliography', '.abt-bibliography__heading', '.abt-bibliography__container > div' ] as $selector ) : ?>
							<code><?php echo esc_html( $selector ); ?></code>
						<?php endforeach; ?>
						</dd>
					</dl>
					<dl>
						<dt><?php esc_html_e( 'Static Publication Lists', 'academic-bloggers-toolkit' ); ?></dt>
						<dd>
						<?php foreach ( [ '.abt-static-bib', '.abt-static-bib > div' ] as $selector ) : ?>
							<code><?php echo esc_html( $selector ); ?></code>
						<?php endforeach; ?>
						</dd>
					</dl>
					<dl>
						<dt><?php esc_html_e( 'Footnotes', 'academic-bloggers-toolkit' ); ?></dt>
						<dd>
						<?php foreach ( [ '#abt-footnote', '.abt-footnote__heading', '.abt-footnote__item', '.abt-footnote-number' ] as $selector ) : ?>
							<code><?php echo esc_html( $selector ); ?></code>
						<?php endforeach; ?>
						</dd>
					</dl>
				</div>
			</div>
		</div>
	</div>
	<div class="abt-submit-row">
		<input
			type="submit"
			value="<?php esc_attr_e( 'Update', 'academic-bloggers-toolkit' ); ?>"
			aria-label="Update custom CSS"
			class="button-primary"
		/>
	</div>
</form>

<!-- How to -->
<div class="postbox">
	<h2><?php esc_html_e( 'How do I', 'academic-bloggers-toolkit' ); ?>...</h2>
	<div class="inside">
		<div class="how-to__container">
			<div class="how-to__item">
				<h3><?php esc_html_e( 'Make my tooltips a different color?', 'academic-bloggers-toolkit' ); ?></h3>
				<p
					data-height="300"
					data-theme-id="dark"
					data-slug-hash="pboYoZ"
					data-default-tab="css,result"
					data-user="dsifford"
					data-embed-version="2"
					data-pen-title="Tooltips"
					data-preview="true"
					class="codepen"
				></p>
			</div>
			<div class="how-to__item">
				<h3><?php esc_html_e( 'Apply style to the bibliography list?', 'academic-bloggers-toolkit' ); ?></h3>
				<p
					data-height="300"
					data-theme-id="dark"
					data-slug-hash="JKjzGj"
					data-default-tab="result"
					data-user="dsifford"
					data-embed-version="2"
					data-pen-title="Bibliography"
					data-preview="true"
					class="codepen"
				></p>
			</div>
			<div class="how-to__item">
				<h3><?php esc_html_e( 'Apply style to the inline citations', 'academic-bloggers-toolkit' ); ?></h3>
				<p
					data-height="300"
					data-theme-id="dark"
					data-slug-hash="xErGdq"
					data-default-tab="result"
					data-user="dsifford"
					data-embed-version="2"
					data-pen-title="Inline Citations"
					data-preview="true"
					class="codepen"
				></p>
			</div>
		</div>
	</div>
</div>
