<?php

/**
 * AJAX Method for getting metadata from other websites for citations
 */
add_action('wp_ajax_get_website_meta', 'abt_get_website_meta');
function abt_get_website_meta() {

    $site_url = $_POST['site_url'];
    $raw = file_get_contents($site_url);
    $html = new DOMDocument();
    @$html->loadHTML($raw);
    $xpath = new DOMXPath($html);

    $payload = [
        'article' => [],
        'authors' => [],
        'og' => [],
        'sailthru' => [],
    ];

    /**
     * Stray Meta "name" Tags
     */
     $authors = $xpath->query('//meta[@name="author"]');
     foreach ($authors as $node) {
         $a = explode(' ', $node->getAttribute('content'), 2);
         $a = [
             'firstname' => $a[0],
             'lastname' => $a[1],
         ];
         if (!is_int(array_search($a, $payload['authors']))) {
             $payload['authors'][] = $a;
         }
     }

     $issued = $xpath->query('//meta[@name="pubdate"]');
     foreach ($issued as $node) {
         $payload['issued'] = $node->getAttribute('content');
     }


    /**
     * Open Graph Tags
     */
    $opengraph = $xpath->query('//meta[starts-with(@property, "og:")]');
    foreach ($opengraph as $node) {
        $key = str_replace(':', '_', explode(':', $node->getAttribute('property'), 2)[1]);
        $value = $node->getAttribute('content');
        $payload['og'][$key] = $value;
    }


    /**
     * Article Tags
     */
    $article = $xpath->query('//meta[starts-with(@property, "article:")]');
    foreach ($article as $node) {
        $key = explode(':', $node->getAttribute('property'), 2)[1];
        $value = $node->getAttribute('content');
        $payload['article'][$key] = $value;
    }


    /**
     * Sailthru Tags
     */
    $sailthru = $xpath->query('//meta[starts-with(@name, "sailthru")]');
    foreach ($sailthru as $node) {
        $key = explode('.', $node->getAttribute('name'), 2)[1];
        $value = $node->getAttribute('content');

        if ($key === 'author') {
            if (strlen($value) > 50) continue;
            $a = explode(' ', $value, 2);
            $a = [
                'firstname' => $a[0],
                'lastname' => $a[1],
            ];
            if (!is_int(array_search($a, $payload['authors']))) {
                $payload['authors'][] = $a;
            }
            continue;
        }

        $payload['sailthru'][$key] = $value;
    }


    /**
     * Itemprop Tags
     */
    $issued = $xpath->query('//*[@itemprop="datePublished"]');
    foreach ($issued as $iss) {
        $i = $iss->getAttribute('datetime');
        if (!empty($i)) {
            $payload['issued'] = $i;
            continue;
        }
        $i = $iss->getAttribute('content');
        if (!empty($i)) {
            $payload['issued'] = $i;
            continue;
        }
    }

    $authors = $xpath->query('//*[@itemprop="author"][not(ancestor::*[@itemtype="http://schema.org/Comment"])]');
    foreach ($authors as $author) {
        if ($author->nodeName === 'meta') continue;
        $a = explode(' ', $author->textContent, 2);
        $a = [
            'firstname' => $a[0],
            'lastname' => $a[1],
        ];
        if (!is_int(array_search($a, $payload['authors']))) {
            $payload['authors'][] = $a;
        }
    }

    $title = $xpath->query('//*[@itemprop="headline"]');
    foreach ($title as $t) {
        $payload['title'] = $t->textContent;
    }


    /**
     * ABT Tags
     */
    $abt = $xpath->query('//meta[starts-with(@property, "abt:")]');
    foreach ($abt as $node) {
        $key = explode(':', $node->getAttribute('property'), 2)[1];
        $value = $node->getAttribute('content');
        if ($key === 'author') {
            $a = explode('|', $value, 2);
            $a = [
                'firstname' => $a[0],
                'lastname' => $a[1],
            ];
            if (!is_int(array_search($a, $payload['authors']))) {
                $payload['authors'][] = $a;
            }
        }
        $payload['abt'][$key] = $value;
    }

    // Last ditch effort to get a title of the site
    if (!$payload['title']) {
        $title = trim(preg_replace('/\s+/', ' ', $raw));
        preg_match("/\<title\>(.*)\<\/title\>/i", $title, $title);
        $payload['title'] = $title[1];
    }

    wp_send_json($payload);
}
