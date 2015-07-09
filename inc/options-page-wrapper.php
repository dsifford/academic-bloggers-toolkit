<div class="wrap">
	<div id="icon-options-general" class="icon32"></div>
	<h2><?php esc_attr_e( "Academic Blogger's Toolkit Options", 'wp_admin_style' ); ?></h2>

	<div id="poststuff">

		<div id="post-body" class="metabox-holder columns-2">

			<!-- main content -->
			<div id="post-body-content">

				<div class="meta-box-sortables ui-sortable">

<!-- BEGIN CSS OVERRIDE POSTBOX -->

					<div class="postbox">

						<h3><span><?php esc_attr_e( 'Override CSS', 'wp_admin_style' ); ?></span></h3>

						<table class="form-table">
							<tr valign="top">
								<td scope="row" width="50%">
									<form method="post" name="abt_custom_css_editor_form" action="">
									<input type="hidden" name="abt_custom_css_editor_form_submitted" value="Y">
									<textarea name="abt_custom_css_editor" id="abt_custom_css_editor" class="large-text" cols="80" rows="10" style="font-family: monospace;"><?php echo $abt_saved_css ?></textarea><br>
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

<!-- END CSS OVERRIDE SECTION -->

<!-- BEGIN PREFERRED CITATION STYLE POSTBOX -->

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

<!-- END PREFERRED CITATION STYLE POSTBOX -->

<!-- BEGIN GOOGLE ANALYTICS INTEGRATION POSTBOX -->

					<div class="postbox">

						<h3><span><?php esc_attr_e( 'Google Analytics Tools', 'wp_admin_style' ); ?></span></h3>

						<div class="inside">
							<table>
								<tr>
									<th style="text-align: left; font-size: 1.1em;">
										Tag Manager Integration
									</th>
									<th style="text-align: left; font-size: 1.1em;">
										Configuration
									</th>
								</tr>
								<tr>
									<td>
										<form method="post" name="abt_google_tag_manager_field">
											<input type="hidden" name="abt_google_tag_manager_field_submitted" value="Y">
											<textarea id="abt_google_tag_manager_code" name="abt_google_tag_manager_code" cols="75" rows="9" style="font-family: monospace;" placeholder=""><?php echo $abt_saved_google_tag_manager_field ?><?php echo stripslashes($abt_google_tag_manager_code); ?></textarea><br>
											<input class="button-primary" type="submit" name="abt_google_tag_manager_submit" value="Update" />
										</form>
									</td>
									<td><div style="height: 175px; overflow-y: scroll;">
										<h3>Prerequisites:</h3>
										<ol>
											<li>An account set up with <a href="https://www.google.com/analytics/" target="_blank">Google Analytics</a> (keep <code>Tracking ID</code> handy).</li>
											<li>A new account (or fresh container) set up with <a href="https://tagmanager.google.com/" target="_blank">Google Tag Manager</a>.</li>
										</ol>
										<h3>Setting Up Link Tracking:</h3>
										<ol>
											<li>Paste the Google Tag Manager code in the box on the left.</li>
											<li>In the Google Tag Manager account window, click the <code>Variables</code> tab and be sure all <code>Clicks</code> variables are selected. Next, create a new <code>User-Defined Variable</code> with the following settings:</li>
												<ul>
													<li><strong>Name:</strong> gaProperty</li>
													<li><strong>Type:</strong> Constant</li>
													<li><strong>Value:</strong> (your Google Analytics Tracking ID)</li>
												</ul>
											<li>Click the <code>Tags</code> tab and set up a new tab (Note: I focus on link event tracking here, but most others should work as well). When the New Tag dialog window opens, select the following settings:</li>
												<ul style="margin-left: 15px;">
													<li><strong>Product:</strong> Google Analytics</li>
													<li><strong>Tag Type:</strong> Universal Analytics</li>
													<li><strong>Configure Tag:</strong></li>
														<ul style="margin-left: 25px;">
															<li><strong>Tracking ID:</strong> Click the box and select <code>gaProperty</code></li>
															<li><strong>Track Type:</strong> Event</li>
															<li><strong>Category:</strong> Any name you'd like (this helps you keep track of what's what)</li>
															<li><strong>Action:</strong> Something that describes what this tracking event does (eg 'Track Downloaded PDFs')</li>
															<li><strong>Label:</strong> Click the box and select anything you'd like</li>
															<li><strong>Value:</strong> Leave blank</li>
															<li><strong>Non-interaction Hit:</strong> Keep false</li>
														</ul>
													<li><strong>Fire On:</strong> Click -- Create a new Trigger (or select an existing if you have it set up) with the following settings:</li>
														<ul style="margin-left: 25px;">
															<li><strong>Event: </strong>Click</li>
															<li><strong>Targets:</strong> Just links (keep existing settings)</li>
															<li><strong>Enable When:</strong> <code>Page URL</code> <code>matches RegEx</code> <code>.*</code></li>
															<li><strong>Fire On: </strong><code>Click ID</code> <code>equals</code> choose whatever tag you'd like here, but be sure it matches the <code>Custom Tag ID</code> set in the post editor.</li>
														</ul>
												</ul>
											<li>Save the settings and click <code>Publish</code></li>
										</ol>
										</div>
										<p style="margin: 0; padding: 0; margin-top: 15px;">Additional help and setup information can be found <a href="https://support.google.com/tagmanager/" target="_blank">here</a>.</p>
									</td>
								</tr>
							</table>
						</div>
						<!-- .inside -->

					</div>

<!-- END GOOGLE ANALYTICS INTEGRATION POSTBOX -->

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
