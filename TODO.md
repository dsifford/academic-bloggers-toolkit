### Todo
- [x] Split apart `ReferenceWindow.tsx` + add more tests
- [x] There's a bug somewhere in `People.tsx` -- related to props.citationType
- [x] Add bibliography to editor
- [x] Figure out full-note citations
- [ ] Add keyboard shortcuts hover thing



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
