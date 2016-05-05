<?php

function call_abt_reference_box() {
    new ABT_Backend();
}

if (is_admin()) {
    add_action('load-post.php', 'call_abt_reference_box');
    add_action('load-post-new.php', 'call_abt_reference_box');
}

/**
 * Main Backend Class.
 *
 * @since 3.0.0
 *
 * @version 0.1.0
 */
class ABT_Backend {

    /**
     * Initiates the TinyMCE plugins, adds the reference list metabox, and enqueues backend JS.
     *
     * @since 3.0.0
     *
     * @version 0.1.0
     */
    public function __construct() {
        add_action('admin_head', array($this, 'init_tinymce'));
        add_action('add_meta_boxes', array($this, 'add_metaboxes'));
        add_action('save_post', array($this, 'save_PR_meta'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_js'));
    }

    /**
     * Adds metaboxes to posts and pages.
     *
     * @since 3.0.0
     *
     * @version 0.1.0
     *
     * @param string $post_type The post type
     */
    public function add_metaboxes($post_type) {
        if (in_array($post_type, array('post', 'page'))) {
            add_meta_box(
                'abt_reflist',
                'Reference List',
                array($this, 'render_reflist'),
                array('post', 'page'),
                'side',
                'high'
            );
            add_meta_box(
                'abt_peer_review',
                __('Add Peer Review(s)', 'abt-textdomain'),
                array($this, 'render_PR_meta'),
                array('post', 'page'),
                'normal',
                'high'
            );
        }
    }

    /**
     * Renders the HTML for React to mount into.
     *
     * @since 3.0.0
     */
    public function render_reflist() {
        echo "<div id='abt-reflist' style='margin: 0 -12px -12px -12px;'></div>";
    }

    /**
     * Pulls the required data from the database and then renders HTML for React
     *   to mount into.
     *
     * @since 3.1.0
     *
     * @param array $post The post multidimensional array
     */
    public function render_PR_meta($post) {
        wp_nonce_field(basename(__file__), 'abt_PR_nonce');

        self::refactor_depreciated_meta($post);

        $meta_fields = unserialize(get_post_meta($post->ID, '_abt-meta', true));

        if (!empty($meta_fields['peer_review'])) {
            for ($i = 1; $i < 4; $i++) {
                if (!empty($meta_fields['peer_review'][$i]['response']['content'])) {
                    $replaced = substr($meta_fields['peer_review'][$i]['response']['content'], 3);
                    $meta_fields['peer_review'][$i]['response']['content'] = preg_replace('/(<br>)|(<br \/>)|(<p>)|(<\/p>)/', "\r", $replaced);
                }
                if (!empty($meta_fields['peer_review'][$i]['review']['content'])) {
                    $replaced = substr($meta_fields['peer_review'][$i]['review']['content'], 3);
                    $meta_fields['peer_review'][$i]['review']['content'] = preg_replace('/(<br>)|(<br \/>)|(<p>)|(<\/p>)/', "\r", $replaced);
                }
            }
            wp_localize_script('abt-PR-metabox', 'ABT_PR_Metabox_Data', $meta_fields['peer_review']);
        } else {
            wp_localize_script('abt-PR-metabox', 'ABT_PR_Metabox_Data', array(
                '1' => array(
                    'heading' => '',
                    'response' => array(),
                    'review' => array(),
                ),
                '2' => array(
                    'heading' => '',
                    'response' => array(),
                    'review' => array(),
                ),
                '3' => array(
                    'heading' => '',
                    'response' => array(),
                    'review' => array(),
                ),
                'selection' => '',
            ));
        }

        echo "<div id='abt-peer-review-metabox'></div>";
    }

    /**
     * Registers and enqueues all required JS.
     *
     * @since 3.0.0
     */
    public function enqueue_js($hook) {
        global $typenow;

        wp_enqueue_media();
        $abt_options = get_option('abt_options');

        wp_enqueue_script('abt-PR-metabox', plugins_url('academic-bloggers-toolkit/lib/js/components/peer-review-metabox/Entrypoint.js'), array(), false, true);
        wp_localize_script('abt-PR-metabox', 'ABT_locationInfo', array(
            'jsURL' => plugins_url('academic-bloggers-toolkit/lib/js/'),
            'tinymceViewsURL' => plugins_url('academic-bloggers-toolkit/lib/js/tinymce-views/'),
            'preferredCitationStyle' => isset($abt_options['abt_citation_style']) ? $abt_options['abt_citation_style'] : '',
            'postType' => $typenow,
            'locale' => get_locale(),
        ));

        wp_register_script('abt_reflist', plugins_url('academic-bloggers-toolkit/lib/js/components/reference-list/Entrypoint.js'));
        wp_register_script('abt_citeproc', plugins_url('academic-bloggers-toolkit/vendor/citeproc.js'));
        wp_enqueue_script('abt_citeproc', false, array(), false, true);
        wp_enqueue_script('abt_reflist', false, array(), false, true);
    }

    /**
     * Instantiates the TinyMCE plugin.
     *
     * @since 3.0.0
     */
    public function init_tinymce() {
        if ('true' == get_user_option('rich_editing')) {
            add_filter('mce_external_plugins', array($this, 'register_tinymce_plugin'));
            add_filter('mce_buttons', array($this, 'register_tinymce_buttons'));
        }
    }

    /**
     * Registers the TinyMCE plugins.
     *
     * @since 3.0.0
     *
     * @param array $plugin_array Array of TinyMCE plugins
     *
     * @return array Array of TinyMCE plugins with plugins added
     */
    public function register_tinymce_plugin($plugin_array) {
        $plugin_array['abt_main_menu'] = plugins_url('academic-bloggers-toolkit/lib/js/TinymceEntrypoint.js');
        $plugin_array['noneditable'] = plugins_url('academic-bloggers-toolkit/vendor/noneditable.js');

        return $plugin_array;
    }

    /**
     * Registers the TinyMCE button on the editor.
     *
     * @since 3.0.0
     *
     * @param array $buttons Array of buttons
     *
     * @return array Array of buttons with button added
     */
    public function register_tinymce_buttons($buttons) {
        array_push($buttons, 'abt_main_menu');

        return $buttons;
    }

    /**
     * Saves the Peer Review meta fields to the database.
     *
     * @since 3.1.0
     *
     * @param string $post_id The post ID
     */
    public function save_PR_meta($post_id) {
        $is_autosave = wp_is_post_autosave($post_id);
        $is_revision = wp_is_post_revision($post_id);
        $is_valid_nonce = (isset($_POST[ 'abt_PR_nonce' ]) && wp_verify_nonce($_POST[ 'abt_PR_nonce' ], basename(__FILE__))) ? true : false;

        if ($is_autosave || $is_revision || !$is_valid_nonce) {
            return;
        }

        // Set variable for allowed html tags in 'Background' Section
        $abt_background_allowed_tags = array(
            'a' => array(
                'href' => array(),
                'title' => array(),
                'target' => array(),
            ),
            'br' => array(),
            'em' => array(),
        );

        $new_meta = unserialize(get_post_meta($post_id, '_abt-meta', true));

        if (empty($new_meta['peer_review'])) {
            $new_meta['peer_review'] = array(
                '1' => array(
                    'heading' => '',
                    'response' => array(),
                    'review' => array(),
                ),
                '2' => array(
                    'heading' => '',
                    'response' => array(),
                    'review' => array(),
                ),
                '3' => array(
                    'heading' => '',
                    'response' => array(),
                    'review' => array(),
                ),
                'selection' => '',
            );
        }

        // Begin Saving Meta Variables
        $new_meta['peer_review']['selection'] = esc_attr($_POST[ 'reviewer_selector' ]);

        for ($i = 1; $i < 4; ++$i) {
            $new_meta['peer_review'][$i]['heading'] = isset($_POST[ 'peer_review_box_heading_'.$i ])
                ? sanitize_text_field($_POST[ 'peer_review_box_heading_'.$i ])
                : '';

            $new_meta['peer_review'][$i]['review']['name'] = isset($_POST[ 'reviewer_name_'.$i ])
                ? sanitize_text_field($_POST[ 'reviewer_name_'.$i ])
                : '';

            $new_meta['peer_review'][$i]['review']['twitter'] = isset($_POST[ 'reviewer_twitter_'.$i ])
                ? sanitize_text_field($_POST[ 'reviewer_twitter_'.$i ])
                : '';

            $new_meta['peer_review'][$i]['review']['background'] = isset($_POST[ 'reviewer_background_'.$i ])
                ? wp_kses($_POST[ 'reviewer_background_'.$i ], $abt_background_allowed_tags)
                : '';

            $new_meta['peer_review'][$i]['review']['content'] = isset($_POST[ 'peer_review_content_'.$i ])
                ? wp_kses_post(wpautop($_POST[ 'peer_review_content_'.$i ]))
                : '';

            $new_meta['peer_review'][$i]['review']['image'] = isset($_POST[ 'reviewer_headshot_image_'.$i ])
                ? $_POST[ 'reviewer_headshot_image_'.$i ]
                : '';

            $new_meta['peer_review'][$i]['response']['name'] = isset($_POST[ 'author_name_'.$i ])
                ? sanitize_text_field($_POST[ 'author_name_'.$i ])
                : '';

            $new_meta['peer_review'][$i]['response']['twitter'] = isset($_POST[ 'author_twitter_'.$i ])
                ? sanitize_text_field($_POST[ 'author_twitter_'.$i ])
                : '';

            $new_meta['peer_review'][$i]['response']['background'] = isset($_POST[ 'author_background_'.$i ])
                ? wp_kses($_POST[ 'author_background_'.$i ], $abt_background_allowed_tags)
                : '';

            $new_meta['peer_review'][$i]['response']['content'] = isset($_POST[ 'author_content_'.$i ])
                ? wp_kses_post(wpautop($_POST[ 'author_content_'.$i ]))
                : '';

            $new_meta['peer_review'][$i]['response']['image'] = isset($_POST[ 'author_headshot_image_'.$i ])
                ? $_POST[ 'author_headshot_image_'.$i ]
                : '';
        }

        update_post_meta($post_id, '_abt-meta', serialize($new_meta));
    }

    /**
     * Responsible for taking the sloppily saved meta from the past and converting to the new meta schema.
     *
     * @since 3.1.1
     *
     * @param postObject $post WordPress post object
     */
    public static function refactor_depreciated_meta($post) {
        $old_meta = get_post_custom($post->ID);
        $new_meta = unserialize(get_post_meta($post->ID, '_abt-meta', true));

        if (empty($new_meta)) {
            $new_meta = array();
        }

        // NOTE: This is the schema for the new meta
        // array(
        // 	'selection' => 'asdf',
        // 	'1' => array(
        // 		'heading' => 'heading',
        // 		'review' => array(
        // 			'name',
        // 			'twitter',
        // 			'background',
        // 			'content',
        // 			'image',
        // 		),
        // 		'response' => array(
        // 			'name',
        // 			'twitter',
        // 			'background',
        // 			'content',
        // 			'image',
        // 		)
        // 	)
        // )

        foreach ($old_meta as $key => $value) {
            if ($key === 'reviewer_selector') {
                $new_meta['peer_review']['selection'] = $value[0];
                delete_post_meta($post->ID, $key);
                continue;
            }

            if (preg_match('/^(peer_review_(box|content|image))/', $key)
            || preg_match('/^(reviewer_(name|twitter|background))/', $key)
            || preg_match('/^(author_(name|twitter|background|content|image))/', $key)
            || preg_match('/^((author|reviewer)_headshot_image_)/', $key)) {
                $number = substr($key, -1);

                if (preg_match('/^peer_review_box/', $key)) {
                    $new_meta['peer_review'][$number]['heading'] = $value[0];
                    delete_post_meta($post->ID, $key);
                    continue;
                }
                if (preg_match('/^reviewer_name_/', $key)) {
                    $new_meta['peer_review'][$number]['review']['name'] = $value[0];
                    delete_post_meta($post->ID, $key);
                    continue;
                }
                if (preg_match('/^reviewer_twitter_/', $key)) {
                    $new_meta['peer_review'][$number]['review']['twitter'] = $value[0];
                    delete_post_meta($post->ID, $key);
                    continue;
                }
                if (preg_match('/^reviewer_background_/', $key)) {
                    $new_meta['peer_review'][$number]['review']['background'] = $value[0];
                    delete_post_meta($post->ID, $key);
                    continue;
                }
                if (preg_match('/^peer_review_content_/', $key)) {
                    $new_meta['peer_review'][$number]['review']['content'] = $value[0];
                    delete_post_meta($post->ID, $key);
                    continue;
                }
                if (preg_match('/^reviewer_headshot_image_/', $key)) {
                    $new_meta['peer_review'][$number]['review']['image'] = $value[0];
                    delete_post_meta($post->ID, $key);
                    continue;
                }
                if (preg_match('/^author_name_/', $key)) {
                    $new_meta['peer_review'][$number]['response']['name'] = $value[0];
                    delete_post_meta($post->ID, $key);
                    continue;
                }
                if (preg_match('/^author_twitter_/', $key)) {
                    $new_meta['peer_review'][$number]['response']['twitter'] = $value[0];
                    delete_post_meta($post->ID, $key);
                    continue;
                }
                if (preg_match('/^author_background_/', $key)) {
                    $new_meta['peer_review'][$number]['response']['background'] = $value[0];
                    delete_post_meta($post->ID, $key);
                    continue;
                }
                if (preg_match('/^author_content_/', $key)) {
                    $new_meta['peer_review'][$number]['response']['content'] = $value[0];
                    delete_post_meta($post->ID, $key);
                    continue;
                }
                if (preg_match('/^author_headshot_image_/', $key)) {
                    $new_meta['peer_review'][$number]['response']['image'] = $value[0];
                    delete_post_meta($post->ID, $key);
                    continue;
                }
            }
        }

        update_post_meta($post->ID, '_abt-meta', serialize($new_meta));
    }
}

function abt_append_peer_reviews($text) {
    if (is_single() || is_page()) {
        global $post;

        ABT_Backend::refactor_depreciated_meta($post);

        $meta = unserialize(get_post_meta($post->ID, '_abt-meta', true));

        if (!isset($meta['peer_review']) || empty($meta['peer_review'])) {
            return $text;
        }

        if ($post->post_type == 'post' || $post->post_type == 'page') {
            for ($i = 1; $i < 4; ++$i) {
                $heading = $meta['peer_review'][$i]['heading'];
                $review_name = $meta['peer_review'][$i]['review']['name'];

                if (empty($review_name)) {
                    continue;
                }

                $review_background = $meta['peer_review'][$i]['review']['background'];
                $review_content = $meta['peer_review'][$i]['review']['content'];
                $review_image = $meta['peer_review'][$i]['review']['image'];
                $review_image = !empty($review_image)
                ? "<img src='${review_image}' width='100px'>"
                : "<i class='dashicons dashicons-admin-users abt_PR_headshot' style='font-size: 100px;'></i>";

                $review_twitter = $meta['peer_review'][$i]['review']['twitter'];
                $review_twitter = !empty($review_twitter)
                ? '<img style="vertical-align: middle;"'.
                'src="https://g.twimg.com/Twitter_logo_blue.png" width="10px" height="10px">'.
                '<a href="http://www.twitter.com/'.
                ($review_twitter[0] == '@' ? substr($review_twitter, 1) : $review_twitter).
                '" target="_blank">@'.
                ($review_twitter[0] == '@' ? substr($review_twitter, 1) : $review_twitter).
                '</a>'
                : '';

                $response_name = $meta['peer_review'][$i]['response']['name'];
                $response_block = '';

                if (!empty($response_name)) {
                    $response_twitter = $meta['peer_review'][$i]['response']['twitter'];
                    $response_twitter = !empty($response_twitter)
                    ? '<img style="vertical-align: middle;"'.
                    'src="https://g.twimg.com/Twitter_logo_blue.png" width="10px" height="10px">'.
                    '<a href="http://www.twitter.com/'.
                    ($response_twitter[0] == '@' ? substr($response_twitter, 1) : $response_twitter).
                    '" target="_blank">@'.
                    ($response_twitter[0] == '@' ? substr($response_twitter, 1) : $response_twitter).
                    '</a>'
                    : '';

                    $response_image = $meta['peer_review'][$i]['response']['image'];
                    $response_image = !empty($response_image)
                    ? "<img src='${response_image}' width='100px'>"
                    : "<i class='dashicons dashicons-admin-users abt_PR_headshot' style='font-size: 100px;'></i>";

                    $response_background = $meta['peer_review'][$i]['response']['background'];
                    $response_content = $meta['peer_review'][$i]['response']['content'];

                    $response_block =
                    "<div class='abt_chat_bubble'>${response_content}</div>".
                    "<div class='abt_PR_info'>".
                        "<div class='abt_PR_headshot'>".
                            "${response_image}".
                        '</div>'.
                        '<div>'.
                            "<strong>${response_name}</strong>".
                        '</div>'.
                        '<div>'.
                            "${response_background}".
                        '</div>'.
                        '<div>'.
                            "${response_twitter}".
                        '</div>'.
                    '</div>';
                }

                ${'reviewer_block_'.$i} =
                "<h3 class='abt_PR_heading noselect'>${heading}</h3>".
                '<div>'.
                    "<div class='abt_chat_bubble'>${review_content}</div>".
                    "<div class='abt_PR_info'>".
                        "<div class='abt_PR_headshot'>".
                            "${review_image}".
                        '</div>'.
                        '<div>'.
                            "<strong>${review_name}</strong>".
                        '</div>'.
                        '<div>'.
                            "${review_background}".
                        '</div>'.
                        '<div>'.
                            "${review_twitter}".
                        '</div>'.
                    '</div>'.
                    "${response_block}".
                '</div>';
            }

            if (!empty($reviewer_block_1)) {
                $text .=
                '<div id="abt_PR_boxes">'.
                    $reviewer_block_1.
                    ((!empty($reviewer_block_2)) ? $reviewer_block_2 : '').
                    ((!empty($reviewer_block_3)) ? $reviewer_block_3 : '').
                    '</div>';
            }
        }
    }

    return $text;
}
add_filter('the_content', 'abt_append_peer_reviews');

function tag_ordered_list($content) {
    if (is_single() || is_page()) {
        $smart_bib_exists = preg_match('<ol id="abt-smart-bib">', $content);
        if (!$smart_bib_exists) {
            $lastOLPosition = strrpos($content, '<ol');
            if (!$lastOLPosition) {
                return $content;
            }
            $content = substr($content, 0, $lastOLPosition).'<ol id="abt-smart-bib" '.substr($content, $lastOLPosition + 3, strlen($content));
        }

        return $content;
    }

    return $content;
}
add_filter('the_content', 'tag_ordered_list');
