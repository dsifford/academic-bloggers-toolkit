<div class="wrap"><h2><?php _e("Academic Blogger's Toolkit Options", 'academic-bloggers-toolkit') ?></h2><div id="poststuff"><div id="post-body" class="metabox-holder"><div id="post-body-content"><div class="meta-box-sortables ui-sortable">


<!-- Feedback Box -->
<div class="postbox">
    <h3><?php _e('Please send your feedback!', 'academic-bloggers-toolkit') ?></h3>
    <div class="inside">
        <?php printf(__("If you experience a bug or would like to request a new feature, please visit the <a href='%s' target='_blank'>GitHub Repository</a> and submit an issue. I'll do my best to get it handled in a timely manner. Comments may also be sent to me on twitter ", 'academic-bloggers-toolkit'), 'https://github.com/dsifford/academic-bloggers-toolkit') ?><a href="http://www.twitter.com/flightmed1" target="_blank">@flightmed1</a>
    </div>
</div>

<div class="postbox">
    <h3><?php _e('Plugin Requirements Check', 'academic-bloggers-toolkit') ?></h3>
    <div class="inside">
        <table class="widefat">

            <!-- PHP VERSION CHECK -->
            <tr>
                <td class="row-title"><?php _e('PHP Version', 'academic-bloggers-toolkit') ?></td>
                <td><?php echo phpversion() ?></td>
                <td>
                    <?php if (version_compare(phpversion(), '5.5', '<')): ?>
                        <span style="font-weight: bold; color: red;"><?php _e('PHP version should be > 5.5 (Recommended Version = 7.0.0)', 'academic-bloggers-toolkit') ?></span>
                    <?php endif; ?>
                </td>
            </tr>

            <!-- PHP DOM EXTENSION CHECK -->
            <tr class="alternate">
                <td class="row-title"><?php printf(__('PHP %s Extension', 'academic-bloggers-toolkit'), '<code>dom</code>') ?></td>
                <td>
                    <?php
                        if (extension_loaded('dom')) {
                            _e('Enabled', 'academic-bloggers-toolkit');
                        }
                        else {
                            echo "<span style='font-weight: bold; color: red;'>" . __('Disabled', 'academic-bloggers-toolkit') . "</span>";
                        }
                    ?>
                </td>
                <td>
                    <?php
                        if (!extension_loaded('dom')) {
                            echo sprintf(__('The %s PHP extension is required for some plugin features.', 'academic-bloggers-toolkit'), '<code>dom</code>') . '<br><a href="http://php.net/manual/en/intro.dom.php" target="_blank">' . __('Click here for installation instructions', 'academic-bloggers-toolkit') . '</a>.';
                        }
                    ?>
                </td>
            </tr>


            <!-- PHP LIBXML EXTENSION CHECK -->
            <tr>
                <td class="row-title"><?php printf(__('PHP %s Extension', 'academic-bloggers-toolkit'), '<code>libxml</code>') ?></td>
                <td>
                    <?php
                        if (extension_loaded('libxml')) {
                            _e('Enabled', 'academic-bloggers-toolkit');
                        }
                        else {
                            echo "<span style='font-weight: bold; color: red;'>" . __('Disabled', 'academic-bloggers-toolkit') . "</span>";
                        }
                    ?>
                </td>
                <td>
                    <?php
                        if (!extension_loaded('libxml')) {
                            echo sprintf(__('The %s PHP extension is required for some plugin features.', 'academic-bloggers-toolkit'), '<code>libxml</code>') . '<br><a href="http://php.net/manual/en/intro.libxml.php" target="_blank">' . __('Click here for installation instructions', 'academic-bloggers-toolkit') . '</a>.';
                        }
                    ?>
                </td>
            </tr>

            <!-- BROWSER CHECK -->
            <tr class="alternate">
                <td class="row-title"><?php _e('Recommended Browsers (in order)', 'academic-bloggers-toolkit') ?></td>
                <td colspan="2"><?php _e('Google Chrome, Mozilla Firefox, or Microsoft Edge.', 'academic-bloggers-toolkit') ?></td>
            </tr>
        </table>
    </div>
</div>

<!-- Citation Style Box -->
<form method="post" name="citation_style_form">
<div class="postbox">
    <h3><?php _e('Default Citation Style', 'academic-bloggers-toolkit') ?></h3>
    <div class="inside">
        <table style="width: 100%;">
            <tr>
                <th style="width: 50%;">
                    <label>
                        <input type="radio" name="citation_style_prefer_custom" value='' <?php checked($citation_style_prefer_custom, false) ?> />
                        <?php _e('Use a predefined citation style by default', 'academic-bloggers-toolkit') ?>
                    </label>
                </th>
                <th style="width: 50%;">
                    <label>
                        <input type="radio" name="citation_style_prefer_custom" value='true' <?php checked($citation_style_prefer_custom, true) ?> />
                        <?php _e('Use custom citation style by default ', 'academic-bloggers-toolkit') ?><a href="https://github.com/dsifford/academic-bloggers-toolkit#using-a-custom-citation-style" target="_blank">[?]</a>
                    </label>
                </th>
            </tr>
            <tr>
                <td>
                    <select id="abt_citation_style" name="citation_style_style" style="width: 100%;" aria-label="select predefined citation style">
                        <?php foreach ($this->citation_styles as $key => $value):?>
                            <option value="<?php echo $value['value'] ?>" <?php selected($citation_style_style, $value['value']); ?>>
                                <?php echo $value['label'] ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </td>
                <td>
                    <input type="text" name="citation_style_custom_url" aria-label="url to custom citation style" value="<?php echo $citation_style_custom_url ?>" class="large-text" />
                </td>
            </tr>
        </table>
    </div>
</div>
<div style="text-align: right; position: relative; top: -15px;">
    <input type="submit" style name="citation_style_options" value="<?php _e('Update', 'academic-bloggers-toolkit') ?>" aria-label="Update citation options submit" class="button-primary" />
</div>
</form>


<!-- Display Options Box -->
<form method="post" name="display_options_form">
<div class="postbox">
    <h3><?php _e('Display Options', 'academic-bloggers-toolkit') ?></h3>
    <div class="inside">
        <table style="width: 100%; height: 100%;">
            <tr>
                <td><label for="display_options_bibliography" style="font-weight: bold;"><?php _e('Bibliography style', 'academic-bloggers-toolkit') ?></label></td>
                <td>
                    <div>
                        <label style="white-space: nowrap; padding: 0 5px;">
                            <input type="radio" name="display_options_bibliography" value="fixed" <?php checked($display_options_bibliography, 'fixed') ?> />
                            <?php _e('Fixed', 'academic-bloggers-toolkit') ?>
                        </label>
                    </div>
                    <div>
                        <label style="white-space: nowrap; padding: 0 5px;">
                            <input type="radio" name="display_options_bibliography" value="toggle" <?php checked($display_options_bibliography, 'toggle') ?> />
                            <?php _e('Toggle', 'academic-bloggers-toolkit') ?>
                        </label>
                    </div>
                </td>
                <td>
                    <div style="text-align: center;"><h3 style="margin: 0;"><?php _e('Interactive Demo', 'academic-bloggers-toolkit') ?></h3></div>
                </td>
            </tr>
            <tr>
                <td style="padding: 15px 0;"><label for="display_options_links" style="font-weight: bold;"><?php _e('Citation Link Style', 'academic-bloggers-toolkit') ?></label></td>
                <td style="padding: 15px 0;">
                    <div>
                        <label style="white-space: nowrap; padding: 0 5px;">
                            <input type="radio" name="display_options_links" value="always" <?php checked($display_options_links, 'always') ?> />
                            <?php _e('whenever possible (subtle)', 'academic-bloggers-toolkit') ?>
                        </label>
                    </div>
                    <div>
                        <label style="white-space: nowrap; padding: 0 5px;">
                            <input type="radio" name="display_options_links" value="always-full-surround" <?php checked($display_options_links, 'always-full-surround') ?> />
                            <?php _e('whenever possible (full surround)', 'academic-bloggers-toolkit') ?>
                        </label>
                    </div>
                    <div>
                        <label style="white-space: nowrap; padding: 0 5px;">
                            <input type="radio" name="display_options_links" value="urls" <?php checked($display_options_links, 'urls') ?> />
                            <?php _e('when the citation has a visible URL', 'academic-bloggers-toolkit') ?>
                        </label>
                    </div>
                    <div>
                        <label style="white-space: nowrap; padding: 0 5px;">
                            <input type="radio" name="display_options_links" value="never" <?php checked($display_options_links, 'never') ?> />
                            <?php _e('never', 'academic-bloggers-toolkit') ?>
                        </label>
                    </div>
                </td>
                <td rowspan="2" width="100%" valign="top">
                    <div style="background: #f5f5f5; box-shadow: 0 1px 1px rgba(0,0,0,.04); border: 1px solid #e5e5e5;">
                    <div id="demo-bib" style="user-select: none; padding: 10px 10px 10px 30px;">
                        <div id="demo-bib-heading-container" class="<?php echo $display_options_bibliography ?>" style="margin-bottom: 1em; <?php echo empty($display_options_bib_heading) ? 'display: none;' : '' ?>">
                            <span id="abt-demo-toggles" style="<?php echo $display_options_bibliography !== 'toggle' ? 'display: none;' : '' ?>">
                                <span id="abt-demo-toggle-open" style="cursor: pointer; position: relative; font-size: 30px; top: -3px; left: -30px;" class="dashicons dashicons-arrow-down"></span>
                                <span id="abt-demo-toggle-shut" style="display: none; cursor: pointer; position: relative; font-size: 30px; top: -3px; left: -30px;" class="dashicons dashicons-arrow-right"></span>
                            </span>
                            <div id="demo-bib-heading" style="display: inline-block; <?php echo $display_options_bibliography === 'toggle' ? 'margin-left: -25px; cursor: pointer;' : '' ?> font-size: 23px; line-height: 23px; font-weight: 600; color: #23282d;"><?php echo $display_options_bib_heading ?></div>
                        </div>
                        <div id="link-style-demo">
                            <div id="always" style="<?php echo $display_options_links != 'always' ? 'display: none;' : '' ?>"><span style="font-weight: bold; margin-right: 8px;">1.</span>Sifford D P. Academic Blogger’s Toolkit: <a href="https://wordpress.org/plugins/academic-bloggers-toolkit/" target="_blank">https://wordpress.org/plugins/academic-bloggers-toolkit/</a>. <i>J WordPress</i>. 2015;12(5):12-24.<span class="abt-url"> [<a href="https://dx.doi.org" target="_blank">Source</a>]</span></div>
                            <div id="always-full-surround" style="<?php echo $display_options_links != 'always-full-surround' ? 'display: none;' : '' ?>"><span style="font-weight: bold; margin-right: 8px;">1.</span><a href="https://dx.doi.org" target="_blank">Sifford D P. Academic Blogger’s Toolkit: https://wordpress.org/plugins/academic-bloggers-toolkit/. <i>J WordPress</i>. 2015;12(5):12-24.</a></div>
                            <div id="urls" style="<?php echo $display_options_links != 'urls' ? 'display: none;' : '' ?>"><span style="font-weight: bold; margin-right: 8px;">1.</span>Sifford D P. Academic Blogger’s Toolkit: <a href="https://wordpress.org/plugins/academic-bloggers-toolkit/" target="_blank">https://wordpress.org/plugins/academic-bloggers-toolkit/</a>. <i>J WordPress</i>. 2015;12(5):12-24.</div>
                            <div id="never" style="<?php echo $display_options_links != 'never' ? 'display: none;' : '' ?>"><span style="font-weight: bold; margin-right: 8px;">1.</span>Sifford D P. Academic Blogger’s Toolkit: https://wordpress.org/plugins/academic-bloggers-toolkit/. <i>J WordPress</i>. 2015;12(5):12-24.</div>
                        </div>
                    </div>
                    </div>
                </td>
            </tr>
            <tr>
                <td><label style="white-space: nowrap; font-weight: bold;" for="display_options_bib_heading"><?php _e('Bibliography Heading', 'academic-bloggers-toolkit') ?></label></td>
                <td><input type="text" name="display_options_bib_heading" id="display_options_bib_heading" value="<?php echo $display_options_bib_heading ?>" style="margin: 0 5px; width: calc(100% - 10px)" /></td>
            </tr>
        </table>
    </div>
</div>
<div style="text-align: right; position: relative; top: -15px;">
    <input type="submit" name="display_options_submit" value="<?php _e('Update', 'academic-bloggers-toolkit') ?>" aria-label="Update display options submit" class="button-primary" />
</div>
</form>


<!-- CSS Overrides Box -->
<form method="post" name="custom_css_form">
<div class="postbox">
    <h3><?php _e('Override CSS', 'academic-bloggers-toolkit') ?></h3>
    <div class="inside">
        <table class="form-table">
            <tr valign="top">
                <td scope="row" width="50%">
                    <textarea name="custom_css" cols="80" rows="20" style="font-family: monospace;" aria-label="Textarea for custom CSS" class="large-text"><?php echo $custom_css ?></textarea>
                </td>
                <td width="50%" style="vertical-align: top;">
                    <table>
                        <tr>
                            <th colspan="2"><?php _e('CSS Selectors used in this plugin', 'academic-bloggers-toolkit') ?></th>
                        </tr>
                        <tr>
                            <td><strong><?php _e('Inline Citations', 'academic-bloggers-toolkit') ?></strong></td>
                            <td><code>.abt-citation</code></td>
                        </tr>
                        <tr>
                            <td><strong><?php _e('Citation Tooltips', 'academic-bloggers-toolkit') ?></strong></td>
                            <td><code>.abt-tooltip, .abt_tooltip__callout, .abt-tooltip__close-button</code></td>
                        </tr>
                        <tr>
                            <td><strong><?php _e('Bibliography', 'academic-bloggers-toolkit') ?></strong></td>
                            <td><code>.abt-bibliography, .abt-bibliography__heading, .abt-bibliography__container > div</code></td>
                        </tr>
                        <tr>
                            <td><strong><?php _e('Static Publication Lists', 'academic-bloggers-toolkit') ?></strong></td>
                            <td><code>.abt-static-bib, .abt-static-bib > div</code></td>
                        </tr>
                        <tr>
                            <td><strong><?php _e('Footnotes', 'academic-bloggers-toolkit') ?></strong></td>
                            <td><code>#abt-footnote, .abt-footnote__heading, .abt-footnote__item, .abt-footnote-number</code></td>
                        </tr>
                    </table>
                    <div style="font-size: 0.8em;"><?php _e('Note: If you are already using a child theme to load CSS, place your CSS overrides there. The box on the left is only a crutch for those who do not have any custom CSS saved yet. Loading CSS this way is very inefficient.', 'academic-bloggers-toolkit') ?></div>
                </td>
            </tr>
        </table>
    </div>
</div>
<div style="text-align: right; position: relative; top: -15px;">
    <input type="submit" name="custom_css_submit" value="<?php _e('Update', 'academic-bloggers-toolkit') ?>" aria-label="Update custom css submit" class="button-primary" />
</div>
</form>


<!-- "How do I" Box -->
<div class="postbox">
    <h3><?php _e('How do I', 'academic-bloggers-toolkit') ?>...</h3>
    <div class="inside">
        <div style="display: flex; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 300px; padding: 0 5px;">
                <strong><?php _e('Make my tooltips a different color?', 'academic-bloggers-toolkit') ?></strong>
                <p data-height="300" data-theme-id="dark" data-slug-hash="pboYoZ" data-default-tab="result" data-user="dsifford" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/dsifford/pen/pboYoZ/">pboYoZ</a> by Derek Sifford (<a href="http://codepen.io/dsifford">@dsifford</a>) on <a href="http://codepen.io">CodePen</a>.</p>
                <script async src="//assets.codepen.io/assets/embed/ei.js"></script>
            </div>
            <div style="flex: 1; min-width: 300px; padding: 0 5px;">
                <strong><?php _e('Apply style to the bibliography list?', 'academic-bloggers-toolkit') ?></strong>
                <p data-height="300" data-theme-id="dark" data-slug-hash="JKjzGj" data-default-tab="result" data-user="dsifford" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/dsifford/pen/JKjzGj/">Bibliography</a> by Derek Sifford (<a href="http://codepen.io/dsifford">@dsifford</a>) on <a href="http://codepen.io">CodePen</a>.</p>
                <script async src="//assets.codepen.io/assets/embed/ei.js"></script>
            </div>
        </div>
    </div>
</div>

</div></div></div></div></div>

<script type='text/javascript'>
    jQuery(document).ready(function($) {
        var linkDemoContainer = $('#link-style-demo')[0];

        var linkDemos = [
            $('#link-style-demo > #always')[0],
            $('#link-style-demo > #always-full-surround')[0],
            $('#link-style-demo > #urls')[0],
            $('#link-style-demo > #never')[0],
        ];

        var toggles = {
            group: $('#abt-demo-toggles')[0],
            open: $('#abt-demo-toggle-open')[0],
            shut: $('#abt-demo-toggle-shut')[0],
        };

        var heading = {
            container: $('#demo-bib-heading-container')[0],
            text: $('#demo-bib-heading')[0],
        };


        $('input[type=radio][name=display_options_links]').change(function() {
            var val = this.value;
            linkDemos.forEach(function(el) {
                if (el.id === val) {
                    el.style.display = '';
                    return;
                }
                el.style.display = 'none';
            });
        });

        $('input[type=radio][name=display_options_bibliography]').change(function() {
            heading.container.className = this.value;
            if (this.value === 'fixed') {
                toggles.group.style.display = 'none';
                toggles.shut.style.display = 'none';
                toggles.open.style.display = '';
                heading.text.style.marginLeft = '';
                heading.text.style.cursor = '';
                return;
            }
            toggles.group.style.display = '';
            toggles.shut.style.display = 'none';
            toggles.open.style.display = '';
            heading.text.style.marginLeft = '-25px';
            heading.text.style.cursor = 'pointer';
        });

        $('#display_options_bib_heading').on('keyup change', function() {
            heading.text.innerText = this.value;
            heading.container.style.display = this.value === '' ? 'none' : '';
        });

        $('#demo-bib-heading-container').click(function(e) {
            e.preventDefault();
            if (this.className === 'fixed') return;
            if (linkDemoContainer.style.display === 'none') {
                linkDemoContainer.style.display = '';
                toggles.shut.style.display = 'none';
                toggles.open.style.display = '';
                heading.container.style.marginBottom = '1em';
                return;
            }
            linkDemoContainer.style.display = 'none';
            toggles.shut.style.display = '';
            toggles.open.style.display = 'none';
            heading.container.style.marginBottom = '';
        });

    });
</script>
