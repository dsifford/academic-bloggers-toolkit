<?php

// Add Plugin Options Menu
function abt_add_to_menu() {

	add_options_page(
		"Academic Blogger's Toolkit Options",
		"Academic Blogger's Toolkit",
		'manage_options',
		'abt-options',
		'abt_options_page'
	);

}
add_action( 'admin_menu', 'abt_add_to_menu' );


// Load Options Page
function abt_options_page() {

	// Permissions Check
	if ( !current_user_can( 'manage_options' ) ) {

		wp_die( 'You do not have sufficient permissions to access this page. ');

	}

	$abt_options = get_option('abt_options');

	// Are hidden form fields set? If so, save them as variables
	$hidden_field_1 = isset( $_POST['abt_custom_css_editor_form_submitted'] ) ? esc_html( $_POST['abt_custom_css_editor_form_submitted'] ) : '';
	$hidden_field_2 = isset( $_POST['abt_citation_style_form_submitted'] ) ? esc_html( $_POST['abt_citation_style_form_submitted'] ) : '';

	// Form Submits -- If form is submitted, set data as variables within the 'abt_options' array in the database
	if ( $hidden_field_1 == 'Y' ) {

		$abt_options['custom_css'] = esc_html( $_POST['abt_custom_css_editor'] );
		update_option( 'abt_options', $abt_options );

	}

	if ( $hidden_field_2 == 'Y' ) {

		$abt_options['abt_citation_style'] = esc_html( $_POST['abt_citation_style'] );
		update_option( 'abt_options', $abt_options );

	}


	// Check if options are set. If they are, save them as variables
	$abt_saved_css = isset( $abt_options['custom_css'] ) ? esc_attr( $abt_options['custom_css'] ) : '';
	$selected = isset( $abt_options['abt_citation_style'] ) ? $abt_options['abt_citation_style'] : '';


	?>

	<div class="wrap">
	<div id="icon-options-general" class="icon32"></div>
	<h2><?php esc_attr_e("Academic Blogger's Toolkit Options", 'wp_admin_style'); ?></h2>
	<div id="poststuff">
		<div id="post-body" class="metabox-holder columns-2">
			<div id="post-body-content">
				<div class="meta-box-sortables ui-sortable">
					<div class="postbox">
						<h3><span><?php esc_attr_e('Override CSS', 'wp_admin_style'); ?></span></h3>
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
											<th colspan="2">CSS classes used in this plugin:</th>
										</tr>
										<tr>
											<td><strong>Inline Citations:</strong></td>
											<td><code>.abt_cite</code></td>
										</tr>
										<tr>
											<td><strong>Peer Review Boxes:</strong></td>
											<td><code>.abt_PR_heading, .abt_PR_info, .abt_PR_headshot, .abt_chat_bubble</code></td>
										</tr>
										<tr>
											<td><strong>Citation Tooltips:</strong></td>
											<td><code>.abt_tooltip, .abt_tooltip_arrow, .abt_tooltip_touch_close</code></td>
										</tr>
									</table>
								</td>
							</tr>
						</table>
					</div>
					<div class="postbox">
						<h3><span><?php esc_attr_e('How do I....', 'wp_admin_style'); ?></span></h3>
						<div class="inside">
							<div style="display: flex; flex-wrap: wrap;">
								<div style="padding: 10px; flex-grow: 1; flex-shrink: 0;">
									<h4>Make my tooltips a different color?</h4>
									<div style="font-family: monospace; background: #eaeaea; padding: 5px; white-space: pre-line;"
									>.abt_tooltip {
										&nbsp;&nbsp;background-color: magenta !important;
										&nbsp;&nbsp;border: solid lime 2px;
										}
										.abt_arrow_up {
										&nbsp;&nbsp;border-color: transparent transparent magenta !important;
										}
										.abt_arrow_down {
										&nbsp;&nbsp;border-color: magenta transparent transparent !important;
										}
									</div>
								</div>
								<div style="padding: 10px; flex-grow: 1; flex-shrink: 0;">
									<h4>Make my citations superscript?</h4>
									<div style="font-family: monospace; background: #eaeaea; padding: 5px; white-space: pre-line;"
									>.abt_cite {
									&nbsp;&nbsp;vertical-align: super;
									&nbsp;&nbsp;font-size: 0.8em;
									}
									</div>
								</div>
								<div style="padding: 10px; flex-grow: 1; flex-shrink: 0;">
									<h4>Apply style to the bibliography list?</h4>
									<div style="font-family: monospace; background: #eaeaea; padding: 5px; white-space: pre-line;"
									>#abt-smart-bib {
									&nbsp;&nbsp;vertical-align: super;
									&nbsp;&nbsp;font-size: 0.8em;
									&nbsp;&nbsp;list-style-type: upper-roman;
									&nbsp;&nbsp;padding: 20px 40px;
									&nbsp;&nbsp;border: solid;
									&nbsp;&nbsp;border-radius: 3px;
									}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div id="postbox-container-1" class="postbox-container">
				<div class="meta-box-sortables">
					<div class="postbox">
						<h3><span><?php esc_attr_e(
                                    'Please send your feedback!', 'wp_admin_style'
                                ); ?></span></h3>
						<div class="inside">
							<p><?php _e(
                                    "If you experience a bug or would like to request a new feature, please visit my <a href='https://github.com/dsifford/academic-bloggers-toolkit/issues' target='_blank'>GitHub Repository</a> and leave a comment. I'll do my best to get it handled in a timely manner.<br><br>Comments can also be sent to me on twitter <a href='http://www.twitter.com/flightmed1' target='_blank'>@flightmed1</a>.",
                                    'wp_admin_style'
                                ); ?></p>
						</div>
					</div>
				</div>
				<div class="meta-box-sortables">
					<div class="postbox">
						<h3><span><?php esc_attr_e('Preferred Citation Style', 'wp_admin_style'); ?></span></h3>
						<div class="inside">
							<form method="post" name="abt_citation_style_form" action="">
								<input type="hidden" name="abt_citation_style_form_submitted" value="Y">
								<select name="abt_citation_style" id="abt_citation_style">
									<option value="ama" <?php selected($selected, 'ama'); ?>>American Medical Association (AMA)</option>
									<option value="apa" <?php selected($selected, 'apa'); ?>>American Psychological Association (APA)</option>
								</select>
								<input class="button-primary" type="submit" name="abt_custom_css_submit" value="Update" />
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
		<br class="clear">
	</div>
</div>
<?php

}



?>
