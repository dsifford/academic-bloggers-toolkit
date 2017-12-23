<?php

namespace ABT\DOM;

defined('ABSPATH') || exit;

/**
 * CSS overrides.
 */
function inject_user_css() {
    $abt_options = get_option('abt_options');
    if (isset($abt_options['custom_css']) && ! empty($abt_options['custom_css'])) {
        $custom_css = $abt_options['custom_css'];
        echo "<style id='custom_css'>$custom_css\r\n</style>";
    }
}
add_action('wp_head', 'ABT\DOM\inject_user_css');

/**
 * Injects post author metadata into the <head> of posts so that others using
 * the plugin can easily extract author information.
 */
function inject_author_meta() {
    global $post;
    if ( ! $post || ! is_singular()) {
        return;
    }

    if (function_exists('get_coauthors')) {
        $authors = get_coauthors($post->ID);
        foreach ($authors as $author) {
            $id = $author->data->ID;
            $meta = get_user_meta($id); ?>
            <meta property="abt:author" content="<?php echo $meta['first_name'][0] . '|' . $meta['last_name'][0]; ?>" />
            <?php
        }
        return;
    }

    $meta = get_user_meta($post->post_author); ?>
        <meta property="abt:author" content="<?php echo $meta['first_name'][0] . '|' . $meta['last_name'][0]; ?>" />
    <?php
}
add_action('wp_head', 'ABT\DOM\inject_author_meta', 1);
