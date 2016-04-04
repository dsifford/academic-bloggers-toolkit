=== Academic Blogger's Toolkit ===
Contributors: dsifford
Donate link: https://cash.me/$dsifford
Tags: academic, pmid, doi, peer-review, Google Tag Manager, citation, bibliography
Requires at least: 4.2.2
Tested up to: 4.2.2
Stable tag: 2.4.0
License: GPL3 or later
License URI: https://www.gnu.org/licenses/gpl-3.0.html

A WordPress plugin extending the functionality of WordPress for Academic Blogging.

== Description ==

Academic Blogger's toolkit is an **open source** WordPress plugin providing an all-in-one solution for effective academic blogging.

= Feature List =
* Insert formatted references on the fly using PMID.
* Search and insert references from PubMed directly within WordPress.
* **Smart Bibliography** - Insert references to a bibliography and append inline citations without breaking focus of your writing.
* References inserted using this plugin are displayed as tooltips on hover in the post. No need to scroll down to the reference list to check the reference (unless you want to!).
* Append up to 3 formatted Peer Reviews to blog posts via a Frontend UI integrated on the post edit screen.

= Want to learn more? =
Check out this plugin's [GitHub Repository](https://github.com/dsifford/academic-bloggers-toolkit) for more details or to ask questions.

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

= 2.4.0 =
* Parse multiple comma-separated PMIDs at once into an ordered list.
* Option to add references manually for Journals, Websites, or Books.
* Search PubMed from WordPress!
    * References from your search are displayed in a list similar to native PubMed and, if you find one you like, click it and it'll be inserted into your post.
* Add optional "Smart Bibliography" feature which, if enabled, allows you to...
    * Insert references directly to your bibliography without having to scroll down.
    * Insert references and inline citations in one step.
    * Choose from a visual list of references in your bibliography if you do not choose to add citations in one step.
* If Smart Bibliography not used, the last-occurring ordered list is automatically tagged with the HTML ID `abt-smart-bib` on load to allow for more reliable tooltip rendering.
* Details for nerds:
    * Full rewrite; a majority of which is using React by Facebook.
    * Speed improvements & resource minification.

= 2.3.1 =
* Fix poor rendering of tooltip close icon on mobile.
* Increase size of toucharea for tooltip close icon on mobile.

= 2.3.0 =
* Tooltips on desktop and mobile given a much-needed facelift.
* Tooltips now appear above or below depending on page scroll position (prevents chopping).
* Tooltips on desktop given a close timer so that the user has time to click links in references.
* Peer review boxes now show a default silhouette photo if no photo attached.
* Bumped the z-index of the tooltips to fight against elements from other plugins overlapping (Please let me know if '20' is still not enough).

= 2.2.2 =
* Fix issue where tooltips on mobile wouldn't go away + better mobile tooltip rendering.

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
