=== Academic Blogger's Toolkit ===
Contributors: dsifford
Donate link: https://cash.me/$dsifford
Tags: academic, pmid, doi, peer-review, Google Tag Manager, citation, bibliography
Requires at least: 4.2.2
Tested up to: 4.2.2
Stable tag: 2.2.1
License: GPL3 or later
License URI: https://www.gnu.org/licenses/gpl-3.0.html

A WordPress plugin extending the functionality of WordPress for Academic Blogging.

== Description ==

Academic Blogger's toolkit is an **open source** WordPress plugin providing an all-in-one solution for effective academic blogging.

= Automatically parse references on the fly using PMID =
- Option to add hyperlink to PubMed.

= Inline citations with hover tooltips showing full reference =
- **Requirements**:
    - A bibliography ordered list must be present **AND** the ordered list must be last one in your blog post.
- **How to use**:
    - Select `Bibliography Tools -> inline citation` from the options menu located on the editor and insert a list of one or more citation numbers from your bibliography list in the form of `1-4,7,9`.

= Append up to 3 formatted Peer Reviews to blog posts via a Frontend UI integrated on the post edit screen =
- Input areas for the Peer Review section include...
	1. Reviewer Name
	2. Reviewer Background (optional)
	3. Reviewer Twitter Handle (optional)
	4. Peer Review
	5. Reviewer Photo (interfaces with WordPress's Media Uploader)
- Option to add Author Response to Peer Reviews.

= Integration with Google Tag Manager =
- Google's newest [analytics powerhouse](http://www.google.com/tagmanager/)!
- Track individual link clicks to see who is interacting with or downloading your content and much more!

= Customizable Options =
* CSS override area to adjust the look of any content that doesn't fit your site's style.

== Installation ==

1. Upload the `acadmemic-bloggers-toolkit` folder to the `/wp-content/plugins/` directory.
2. Activate the plugin through the 'Plugins' menu in WordPress.

== Frequently Asked Questions ==

= I have a suggestion for a new feature. Would you be interested in considering it? =

Absolutely! Please send all ideas to the Academic Blogger's Toolkit [GitHub Repository](https://github.com/dsifford/academic-bloggers-toolkit/issues). Alternatively, you can reach out to me on Twitter [@flightmed1](https://twitter.com/flightmed1).

= I found a bug. Who should I contact? =

Yikes! I'm sorry about that. Please report all issues on the Academic Blogger's Toolkit [GitHub Repository](https://github.com/dsifford/academic-bloggers-toolkit/issues).

== Screenshots ==

1. Demo of the automatic reference parser.
2. Demo of the anchor link generator.
3. Demo of the Peer Review front-end GUI
4. Options Page Screenshot

== Changelog ==

= 2.2.1 =
* Fix issue where peer reviews containing ordered lists would break the inline reference tooltips.

= 2.2.0 =
* **Breaking Change:** Support for Internet Explorer versions 9 and below ended. (Please upgrade your browser).
* jQuery removed entirely (network hog). Page load times should be modestly improved.
* Instead of inline citations taking you to the references on click, the individual references are now displayed inside a tooltip. I've found that dealing with return links was too cumbersome and time consuming.
* Inline citations now accepts a more natural format. For example, [cite num="1-3,5,8"] correctly cites references 1, 2, 3, 5, & 8. **Note:** Your bibliography **MUST** be an ordered list **AND** it must be the last ordered list in your blog post.
* Slow animations on all pages removed.
* Adjusted peer review metaboxes with a clearer delimiter so that they're easier to read.

= 2.1.0 =
* **Quick addition to previous update:** Added ability to open Formatted Reference and Inline Citation menus via keyboard shortcuts. (Ah, much nicer!)

= 2.0.0 =
* Updated plugin for WordPress 4.3
* **Feature Upgrade:** Formatted references are now generated and inserted on the fly. (Note: This feature is only compatible with modern browsers or Internet Explorer 10 or above. If you are using an earlier version of IE, there will be no change.)
* Removed ability to use DOI / PMCID for reference insertion due to overall unreliability.

= 1.1.3 =
* **Bugfix:** Fixed issue causing peer review dropdown boxes to be highlighted when clicked.
* Allow the input of 'a', 'em', and 'br' tags in background section for peer reviews.

= 1.1.2 =
* **Bugfix:** Fixed issue where citation anchor links were interfering with anchor links not created by this plugin.
* **Bugfix:** Fixed issue where users were unable to apply line breaks or simple html tags (<strong><i><a>) in peer review boxes.

= 1.1.1 =
* **Feature Release:** Integration with Google Tag Manager. Starting now, you can set up individual link click tracking via Google Analytics! Use this feature to track PDF downloads, page-views, form submits, or anything else you can think of!
* **Bugfix:** Issue causing some users' Peer Review Boxes to not be formatted correctly.
* **Bugfix:** Add default citation style.
* Add uninstall hook to cleanup plugin files from database in the unfortunate event that you decide to uninstall the plugin.
* General Performance Improvements.

= 1.1 =
* Fixed issue where post excerpt wouldn't show correctly. (Thanks Brent Thoma!)

= 1.0 =
* Initial stable release.

== Upgrade Notice ==

= 1.1.3 =
* **Bugfix:** Fixed issue causing peer review dropdown boxes to be highlighted when clicked.
* Allow the input of 'a', 'em', and 'br' tags in background section for peer reviews.

= 1.1.2 =
* **Bugfix:** Issue where citation anchor links were interfering with anchor links not created by this plugin.

= 1.1.1 =
* **Feature Release:** Integration with Google Tag Manager. Starting now, you can set up individual link click tracking via Google Analytics! Use this feature to track PDF downloads, page-views, form submits, or anything else you can think of!
* **Bugfix:** Issue causing some users' Peer Review Boxes to not be formatted correctly.
* **Bugfix:** Add default citation style.
* Add uninstall hook to cleanup plugin files from database in the unfortunate event that you decide to uninstall the plugin.
* General Performance Improvements.

= 1.1 =
* Fixed issue where post excerpt wouldn't show correctly. (Thanks Brent Thoma!)

= 1.0 =
* Initial stable release.
