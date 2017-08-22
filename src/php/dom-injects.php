<?php

namespace ABT\DOM;

if (!defined('ABSPATH')) {
    exit(1);
}

// FIXME: Probably don't even need this.
/**
 * Appends the changelog script to the document footer on the editor pages.
 */
function inject_changelog() {
    ?>
    <script type="text/javascript">var el=document.createElement("SPAN");el.id="abt_changelog",document.querySelector("#abt-reflist > h2").appendChild(el);var HW_config={selector:"#abt_changelog",account:"LJ4gE7"};</script><script async src="//cdn.headwayapp.co/widget.js"></script>
    <?php
}
// add_action('admin_footer', 'ABT\DOM\inject_changelog');


/**
 * CSS overrides.
 */
function inject_user_css() {
    $abt_options = get_option('abt_options');
    if (isset($abt_options['custom_css']) && !empty($abt_options['custom_css'])) {
        $custom_css = $abt_options['custom_css'];
        echo "<style id='custom_css'>$custom_css\r\n</style>";
    }
}
add_action('wp_head', 'ABT\DOM\inject_user_css');


function inject_author_meta() {
    global $post;
    if (!$post || !is_singular()) {
        return;
    }

    if (function_exists('get_coauthors')) {
        $authors = get_coauthors($post->ID);
        foreach ($authors as $author) {
            $id = $author->data->ID;
            $meta = get_user_meta($id); ?>
            <meta property="abt:author" content="<?php echo $meta['first_name'][0] . '|' . $meta['last_name'][0] ?>" />
            <?php
        }
        return;
    }

    $meta = get_user_meta($post->post_author); ?>
        <meta property="abt:author" content="<?php echo $meta['first_name'][0] . '|' . $meta['last_name'][0] ?>" />
    <?php
}
add_action('wp_head', 'ABT\DOM\inject_author_meta', 1);
