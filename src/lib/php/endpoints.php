<?php


if (extension_loaded('curl')) {
    function abt_get_medra_doi() {
        $doi = $_POST['doi'];

        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_URL => "http://data.medra.org/$doi",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_POSTFIELDS => "",
            CURLOPT_HTTPHEADER => array(
                "accept: application/vnd.citationstyles.csl+json;q=1.0"
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);
        curl_close($curl);

        if ($err) {
            wp_send_json(['error' => $err]);
            return;
        }
        wp_send_json(json_decode($response));
    }
    add_action('wp_ajax_get_medra_doi', 'abt_get_medra_doi');
}
else {
    function abt_get_medra_doi_error() {
        wp_send_json(array(
            'error' => sprintf(__('Your WordPress PHP installation is incomplete. You must have the following PHP extensions enabled to use this feature: %s', 'academic-bloggers-toolkit'), '"curl"'),
        ));
    }
    add_action('wp_ajax_get_medra_doi', 'abt_get_medra_doi_error');
}



/**
 * AJAX Method for getting metadata from other websites for citations
 */

if (extension_loaded('dom') && extension_loaded('libxml')) {
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
            $expl = explode(':', $node->getAttribute('property'), 2);
            $key = str_replace(':', '_', $expl[1]);
            $value = $node->getAttribute('content');
            $payload['og'][$key] = $value;
        }


        /**
         * Article Tags
         */
        $article = $xpath->query('//meta[starts-with(@property, "article:")]');
        foreach ($article as $node) {
            $expl = explode(':', $node->getAttribute('property'), 2);
            $key = $expl[1];
            $value = $node->getAttribute('content');
            $payload['article'][$key] = $value;
        }


        /**
         * Sailthru Tags
         */
        $sailthru = $xpath->query('//meta[starts-with(@name, "sailthru")]');
        foreach ($sailthru as $node) {
            $expl = explode('.', $node->getAttribute('name'), 2);
            $key = $expl[1];
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
            $expl = explode(':', $node->getAttribute('property'), 2);
            $key = $expl[1];
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
}
else {
    add_action('wp_ajax_get_website_meta', 'abt_get_website_meta_error');
    function abt_get_website_meta_error() {
        wp_send_json(array(
            'error' => sprintf(__('Your WordPress PHP installation is incomplete. You must have the following PHP extensions enabled to use this feature: %s', 'academic-bloggers-toolkit'), '"dom", "libxml"'),
        ));
    }
}
