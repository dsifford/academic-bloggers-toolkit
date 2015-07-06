<div class="wrap">

	<div id="icon-options-general" class="icon32"></div>
	<h2><?php esc_attr_e( "Academic Blogger's Toolkit Options", 'wp_admin_style' ); ?></h2>

	<div id="poststuff">

		<div id="post-body" class="metabox-holder columns-2">

			<!-- main content -->
			<div id="post-body-content">

				<div class="meta-box-sortables ui-sortable">

					<div class="postbox">

						<!-- CSS Override Section Begins Here -->

						<h3><span><?php esc_attr_e( 'Override CSS', 'wp_admin_style' ); ?></span></h3>

						<table class="form-table">
							<tr valign="top">
								<td scope="row" width="50%">
									<form method="post" name="abt_custom_css_editor_form" action="">
									<input type="hidden" name="abt_custom_css_editor_form_submitted" value="Y">
									<textarea name="abt_custom_css_editor" id="abt_custom_css_editor" class="large-text" cols="80" rows="10"><?php echo $abt_saved_css ?></textarea><br>
									<input class="button-primary" type="submit" name="abt_custom_css_submit" value="Update" />
									</form>
								</td>
								<td width="50%" style="vertical-align: top;">
									<table>
										<tr>
											<th colspan="2">Classes / IDs used in this plugin:</th>
										</tr>
										<tr>
											<td><strong>Anchor Links:</strong></td>
											<td><code>.cite, .cite-return</code></td>
										</tr>
										<tr>
											<td><strong>Peer Review Boxes:</strong></td>
											<td><code>#abt_PR_boxes, .abt_PR_info, .abt_PR_headshot, .abt_chat_bubble</code></td>
										</tr>
									</table>
								</td>
							</tr>
						</table>


						<!-- .inside -->

					</div>
					<!-- .postbox -->

					<div class="postbox">

						<h3><span><?php esc_attr_e( 'Preferred Citation Style', 'wp_admin_style' ); ?></span></h3>

						<div class="inside">

							<form method="post" name="abt_citation_style_form" action="">

								<input type="hidden" name="abt_citation_style_form_submitted" value="Y">
								<select name="abt_citation_style" id="abt_citation_style">
									<option value="American Medical Association (AMA)" <?php selected( $selected, 'American Medical Association (AMA)' ); ?>>American Medical Association (AMA)</option>
									<option value="American Psychological Association (APA)" <?php selected( $selected, "American Psychological Association (APA)" ); ?>>American Psychological Association (APA)</option>
								</select>
								<input class="button-primary" type="submit" name="abt_custom_css_submit" value="Update" />

							</form>

						</div>
						<!-- .inside -->

					</div>
					<!-- .postbox -->


				</div>
				<!-- .meta-box-sortables .ui-sortable -->

			</div>
			<!-- post-body-content -->


			<!-- sidebar -->
			<div id="postbox-container-1" class="postbox-container">

				<div class="meta-box-sortables">

					<div class="postbox">

						<h3><span><?php esc_attr_e(
									'Please send your feedback!', 'wp_admin_style'
								); ?></span></h3>

						<div class="inside">
							<p><?php _e(
									"If you experience a bug or would like to request a new feature, please visit our <a href='https://trello.com/b/nFxfo6iO/academic-blogger-s-toolkit' target='_blank'>Trello board</a> and leave a comment. We'll do our best to make it happen.<br><br>Comments can also be sent to me on twitter <a href='http://www.twitter.com/flightmed1' target='_blank'>@flightmed1</a>.",
									'wp_admin_style'
								); ?></p>
						</div>
						<!-- .inside -->

					</div>
					<!-- .postbox -->

				</div>
				<!-- .meta-box-sortables -->

			</div>
			<!-- #postbox-container-1 .postbox-container -->

		</div>
		<!-- #post-body .metabox-holder .columns-2 -->

		<br class="clear">
	</div>
	<!-- #poststuff -->

</div> <!-- .wrap -->
