<?php

add_action('wp_ajax_get_website_meta', 'abt_get_website_meta');
function abt_get_website_meta() {
    $site_url = $_POST['site_url'];

    $raw = file_get_contents($site_url);
    $html = new DOMDocument();
    @$html->loadHTML($raw);
    $xpath = new DOMXPath($html);
    $query = '//*/meta';
    $metas = $xpath->query($query);
    $rmetas = [];
    foreach ($metas as $meta) {
        $property = $meta->getAttribute('property');
        $name = $meta->getAttribute('name');
        $content = $meta->getAttribute('content');

        $property = empty($property) ? $name : $property;
        if (empty($property) || empty($content)) continue;
        $rmetas[$property] = $content;
    }

    wp_send_json($rmetas);
}
