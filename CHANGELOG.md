# Changelog

### 2.3.0
- Tooltips on desktop and mobile given a much-needed facelift.
- Tooltips now appear above or below depending on page scroll position (prevents chopping).
- Tooltips on desktop given a close timer so that the user has time to click links in references.
- Peer review boxes now show a default silhouette photo if no photo attached.

#### Bugfixes
- Bumped the z-index of the tooltips to fight against elements from other plugins overlapping (Please let me know if '20' is still not enough).

### 2.2.2
- Fix issue where tooltips on mobile wouldn't go away + better mobile tooltip rendering.

### 2.2.1
- Fix issue where peer reviews containing ordered lists would break the inline reference tooltips.

### 2.2.0
- **Breaking Change:** Support for Internet Explorer versions 9 and below ended. (Please upgrade your browser).
- jQuery removed entirely (network hog). Page load times should be modestly improved.
- Instead of inline citations taking you to the references on click, the individual references are now displayed inside a tooltip. I've found that dealing with return links was too cumbersome and time consuming.
- Inline citations now accepts a more natural format. For example, [cite num="1-3,5,8"] correctly cites references 1, 2, 3, 5, & 8. **Note:** Your bibliography **MUST** be an ordered list **AND** it must be the last ordered list in your blog post.
- Slow animations on all pages removed.
- Adjusted peer review metaboxes with a clearer delimiter so that they're easier to read.

### 2.1.0
- **Quick addition to previous update:** Added ability to open Formatted Reference and Inline Citation menus via keyboard shortcuts. (Ah, much nicer!)


### 2.0.0
- Updated plugin for WordPress 4.3
- **Feature Upgrade:** Formatted references are now generated and inserted on the fly. (Note: This feature is only compatible with modern browsers or Internet Explorer 10 or above. If you are using an earlier version of IE, there will be no change.)
- Removed ability to use DOI / PMCID for reference insertion due to overall unreliability.

###1.1.3
- **Bugfix:** Fixed issue causing peer review dropdown boxes to be highlighted when clicked.
- Allow the input of 'a', 'em', and 'br' tags in background section for peer reviews.

###1.1.2
- **Bugfix:** Issue where citation anchor links were interfering with anchor links not created by this plugin.
- **Bugfix:** Fixed issue where users were unable to apply line breaks or simple html tags (<strong><i><a>) in peer review boxes.

###1.1.1
- **Feature Release:** Integration with Google Tag Manager. Starting now, you can set up individual link click tracking via Google Analytics! Use this feature to track PDF downloads, page-views, form submits, or anything else you can think of!
- **Bugfix:** Issue causing some users' Peer Review Boxes to not be formatted correctly.
- **Bugfix:** Add default citation style.
- Add uninstall hook to cleanup plugin files from database in the unfortunate event that you decide to uninstall the plugin.
- General Performance Improvements.
- Switch to semantic versioning format.

###1.1
- Fixed issue where post excerpt wouldn't show correctly. (Thanks Brent Thoma!)

###1.0
- Initial stable release.
