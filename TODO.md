### Todo
- [ ] For now, autosaving is disabled. Add it back in, but also with a custom admin ajax call to save meta.
- [ ] Split apart `ReferenceWindow.tsx` + add more tests
- [ ] There's a bug somewhere in `People.tsx` -- related to props.citationType
- [ ] Add bibliography to editor
- [ ] Figure out full-note citations



### Depreciations
```php
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
```
