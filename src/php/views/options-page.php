<?php
/**
 * Options Page View
 *
 * @package ABT
 *
 * phpcs:disable Squiz.PHP.CommentedOutCode.Found
 */

defined( 'ABSPATH' ) || exit;

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
					<?php /* Feedback Box {{{ */ ?>
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
					<?php /* }}} */ ?>
					<?php /* Plugin Requirements {{{ */ ?>
					<div class="postbox"> <h2><?php esc_html_e( 'Plugin Requirements Check', 'academic-bloggers-toolkit' ); ?></h2>
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
									<?php if ( version_compare( PHP_VERSION, '7.2', '<' ) ) : ?>
										<strong style="color: red;">
											<?php
												sprintf(
													/* translators: %s: version number */
													__( 'PHP version should be at least %s', 'academic-bloggers-toolkit' ),
													'7.2'
												);
												esc_html_e( 'PHP version should be at least 7.2', 'academic-bloggers-toolkit' );
											?>
										</strong>
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
					<?php /* }}} */ ?>
					<?php /* Default Citation Style {{{ */ ?>
					<form method="post">
						<?php wp_nonce_field( ABT_ACTIONS['SET_CITATION_STYLE'], ABT_NONCE ); ?>
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
					<?php /* }}} */ ?>
					<?php /* How to... {{{ */ ?>
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
										data-default-tab="css,result"
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
										data-default-tab="css,result"
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
					<?php /* }}} */ ?>
				</div>
			</div>
		</div>
	</div>
</div>

<?php /* vim: set fdm=marker fdl=0: */ ?>
