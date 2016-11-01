=== Academic Blogger's Toolkit ===
Contributors: dsifford
Donate link: https://donorbox.org/academic-bloggers-toolkit
Tags: academia, academic, bibliographies, bibliography, citation, citations, cite, citing, CSL, curriculum vitae, cv, doi, endnote, footnote, footnotes, journal, mendeley, papers, pmid, publications, publish, pubmed, reference, reference list, reference manager, references, referencing, ris, scholar, scholarly, zotero
Requires at least: 4.2.2
Tested up to: 4.6
Stable tag: 4.7.0
License: GPL3 or later
License URI: https://www.gnu.org/licenses/gpl-3.0.html

A plugin extending the functionality of Wordpress for academic blogging.

== Description ==
Academic Blogger's toolkit is an **open source** WordPress plugin providing an all-in-one solution for effective academic blogging.

= THIS README PAGE IS NOT KEPT UP TO DATE! =
For a constaintly updated, exhaustively detailed, introduction to this plugin and all its features, please visit the plugin's [GitHub Repository](https://github.com/dsifford/academic-bloggers-toolkit).

To dive right into the documentation, check out the [Academic Blogger's Toolkit Wiki](https://github.com/dsifford/academic-bloggers-toolkit/wiki)!

= Features =
* Insert formatted references on the fly using **PMID**, **DOI** (CrossRef, DataCite, & mEDRA), **URL**, or **ISBN**.
* Manually insert formatted references from **over 15 types of references**.
* **Import a full bibliography from your favorite reference manager** using an exported `.ris` file.
* Automatically format references for **every citation style on planet earth** (over 1300).
* **Fully interactive** reference list which lives beside the post editor.
* **Search PubMed from the post editor** and insert references instantly.
* Inline citations display full formatted references on the frontend when hovered with the mouse (or when tapped on mobile). No more scrolling down and losing your focus!

[youtube https://www.youtube.com/watch?v=5k72Dh8L2BA]
(Video above is of version 3.0.0 - Many improvements and features [were added](https://headwayapp.co/academic-bloggers-toolkit-changelog) since then)

= Contributing =
If you're a developer and would like to contribute, you can do so via this plugin's [GitHub Repository](https://github.com/dsifford/academic-bloggers-toolkit).

== Installation ==

1. Upload the `acadmemic-bloggers-toolkit` folder to the `/wp-content/plugins/` directory.
2. Activate the plugin through the 'Plugins' menu in WordPress.

== Frequently Asked Questions ==

= I have a suggestion for a new feature. Would you be interested in considering it? =

Absolutely! Please send all ideas to the Academic Blogger's Toolkit [GitHub Repository](https://github.com/dsifford/academic-bloggers-toolkit/issues). Alternatively, you can reach out to me on Twitter [@flightmed1](https://twitter.com/flightmed1).

= I found a bug. Who should I contact? =

Yikes! I'm sorry about that. Please report all issues on the Academic Blogger's Toolkit [GitHub Repository](https://github.com/dsifford/academic-bloggers-toolkit/issues).

== Screenshots ==

1. Overview of the reference manager screen.
2. Overview of the manual reference insertion screen.
3. Overview of the PubMed search window.
4. Demo of desktop citation tooltips.

== Changelog ==

= 4.7.0 =

[Click here](https://headwayapp.co/academic-bloggers-toolkit-changelog) to view changes.

= 4.6.1 =

[Click here](https://headwayapp.co/academic-bloggers-toolkit-changelog) to view changes.

= 4.6.0 =

[Click here](https://headwayapp.co/academic-bloggers-toolkit-changelog) to view changes.

= 4.5.0 =

[Click here](https://headwayapp.co/academic-bloggers-toolkit-changelog) to view changes.

= 4.4.7 =

[Click here](https://headwayapp.co/academic-bloggers-toolkit-changelog) to view changes.

= 4.4.6 =

[Click here](https://headwayapp.co/academic-bloggers-toolkit-changelog) to view changes.

= 4.4.5 =

[Click here](https://headwayapp.co/academic-bloggers-toolkit-changelog) to view changes.

= 4.4.4 =

[Click here](https://headwayapp.co/academic-bloggers-toolkit-changelog) to view changes.

= 4.4.3 =

[Click here](https://headwayapp.co/academic-bloggers-toolkit-changelog) to view changes.

= 4.4.2 =

[Click here](https://headwayapp.co/academic-bloggers-toolkit-changelog) to view changes.

= 4.4.1 =

[Click here](https://headwayapp.co/academic-bloggers-toolkit-changelog) to view changes.

= 4.4.0 =

[Click here](https://headwayapp.co/academic-bloggers-toolkit-changelog) to view changes.

= 4.3.0 =

[Click here](https://headwayapp.co/academic-bloggers-toolkit-changelog) to view changes.

= 4.2.0 =

[Click here](https://headwayapp.co/academic-bloggers-toolkit-changelog) to view changes.

= 4.1.0 =

[Click here](https://headwayapp.co/academic-bloggers-toolkit-changelog) to view changes.

= 4.0.1 =

[Click here](https://headwayapp.co/academic-bloggers-toolkit-changelog) to view changes.

= 4.0.0 =

[Click here](https://headwayapp.co/academic-bloggers-toolkit-changelog) to view changes.

= 3.4.3 =

**Bugfixes**

- Fix issue where bibliographies would not be rendered with only a single reference. (HT @floaltvater)

= 3.4.2 =

**Bugfixes**

- Fix issue where bibliographies would not be rendered with only a single reference. (HT @floaltvater)

= 3.4.1 =

**Bugfixes**

- Fix issue causing reference menus to fail to load in cases where WordPress plugins are installed in a non-standard directory or in multisite. (HT @floaltvater).

= 3.4.0 =

**Improvements**

- ___Massive___ under-the-hood improvements to both speed and reliability to the reference list.
- Plugin is now fully internationalized! Are you interested in helping translate this plugin? Visit [this link](https://poeditor.com/join/project/PGYLKWQM5h) to learn more.
- UI Improvements.
- Citation processor now properly parses all locales.
- Processor now caches ~75% less data as post meta (wasn't much to begin with, but now it's less!).
- Duplicate references are now ignored. (HT @metallikat36)

**Bugfixes**

- Processor now clears the incremental whitespace between your content and the bibliography.
- Fix issue where some URLs were not being parsed properly. (HT @JLJu)
- Fix issue causing the processor to sometimes go out of sync with the document.

= 3.3.1 =

**Bugfixes**

* Only load plugin javascript on single posts, rather than on `front_page()` or any other collection of posts.
* Fix border color on peer review boxes.
* Stop loading plugin on media upload pages.
* Regress to older iterator function for frontend bibliographies so that Safari 9, Internet Explorer, and Edge 13 don't throw errors. (Protip: If you're using these browsers, stop. Use Chrome or Firefox. Or, at least upgrade to Edge 14 or Safari 10).

**Note:** The Safari, Edge, and Internet Explorer bugs are only theoretically fixed. I don't own a computer capable of testing those browsers. If bugs persist, open an issue in the [GitHub repo](https://github.com/dsifford/academic-bloggers-toolkit/issues).

= 3.3.0 =

**Bugfixes**

* Fix insertion of PMID urls so that it doesn't brake citation formating (specifically, flush indents).

**New Features**

* Add ability to `Pin reference list to visible window`: The biggest personal annoyance I've had with this plugin is the fact that I'd have to scroll all the way to the top of the page if I wanted to interact with the reference list menu-bar. This feature adds the ability to pin the reference list in a fixed position on the screen so that the menu-bar is always within reach.
* Add ability to `Delete all references`: I've received feedback that sometimes the processor gets so out of wack, some of you would prefer to just start over. Click this button and all the citations will be stripped from your document, your reference list will be cleared, and you can start with a clean slate.
* Add ability to `Refresh reference list`: Sometimes the processor just needs a kick in the butt to realign itself with the state of the document. Click this button to do just that.

**Are you experiencing any other bugs? Open an issue in the github repo and I'll do my best to get it fixed in a timely fashion. Thanks!**

= 3.2.2 =

**Bugfixes**

* Fix issue that caused citations written before existing citations on the same line to be numbered incorrectly. HT @metallikat36

= 3.2.1 =

Sometimes you make good calls, and sometimes you make bad calls.

Changing the CSS selectors was a bad call. Sorry about that!

**Bugfixes**

* Revert CSS selectors back to what they were originally.

= 3.2.0 =

**New Features**

* Citations are now sorted automatically based on how sorting is defined in the citation style (no more drag and drop).
* In-text citations styles now reflect each individual citation style.
* Improvements to the UI.
* Realtime citation style switching.
* "Full note" style citations are now fully supported. (eg. Chicago Full Note).

**Bugfixes**

* Fix bug that caused some options to not be saved on the options page.
* Fix issue that caused the plugin to break if your site is SSL encrypted.
* Fix bug related to conference proceedings fields. HT @metallikat36
* Reference list now enabled for all post types. HT @halatkins

**Depreciations**

* The last-occurring ordered list is not tagged as a bibliography on page load anymore. This is now done upon initial bibliography creation. You shouldn't notice a difference, but some users who have used this plugin for a longer period of time may find that some of their older bibliographys are not being correctly identified. Email me if this is an issue and I'll walk you thorough it.

**Special Thanks**
This update would not have been possible without the help and support of Frank Bennett (@fgbjr). Thanks for all your help!

= 3.1.5 =
* Fix PubMed bug that resulted in citations with ampersands in the title to be parsed as `&amp;amp;`. HT @Da5idHatch

= 3.1.4 =
* Fix issue that caused peer reviews that contain special characters to confuse WordPress.

**Note:** Sorry for all the updates today. This should be the last one.

= 3.1.3 =
* Fix bug that caused peer review data to not save at times.
* Fix bug that broke peer review image upload.
* Fix bug that caused an extra space to be inserted in peer review content boxes.
* Fix issue causing the peer review content boxes to not be full-width.

= 3.1.2 =
* Fix bug that caused the editor button to appear twice on pages.
* Lay groundwork for full plugin translation / localization.
* Add 60 individual unit tests to ensure plugin works properly now, tomorrow.. always.

= 3.1.1 =
* **Shortcodes are now fully depreciated.**
* Fix issue causing reference list to not load on pages.
* General under-the-hood improvements.

= 3.1.0 =

**Bugfixes**:

* Fix issue which resulted in this plugin not playing nicely with other plugins that generate additional TinyMCE editors (eg. Advanced Custom Fields). HT: @billmorton.
* Add a space between the reference number and the reference in the reference list.

**Improvements**:

* Slightly better locale processing (bigger fix still in the works). HT: @Tammakit.
* When importing a RIS file, the plugin now automatically makes URLs clickable. Also, it takes DOIs and turns them into clickable URLs (resolved by DOI.org). This option can be turned off by unchecking `Links` on the import RIS window. HT: @someonehere15.
* Set reference insertion window to default to attaching reference inline, rather than requiring a checkbox click each time.
* Add options to options page which allow for the following (HT: @metallikat36 & @canadiem):
    * Make the bibliography toggleable
    * Make the peer review sections non-toggleable
    * Set default heading for bibliography list.
* Manual references with DOIs now optionally create clickable links resolved by doi.org. HT: @someonehere15

= 3.0.1 =
* Fix bug that caused bold text to stay in place if you click and drag a highlighted reference.
* Fix issue where WordPress added escape slashes to custom CSS containing quote characters.
* Fix bug where an error message would display on some pages if a preferred citation style is not set.

= 3.0.0 =
You spoke and I heard, this latest version is (in my opinion) the strongest, most stable, and easiest to use version that has ever existed.

**What's new?**

* Everything. No, really. There's too many changes to reasonably list here, so please take 5 minutes and read the readme. Alternatively, you can watch this short [YouTube demo](https://www.youtube.com/watch?v=5k72Dh8L2BA).

**Changes I think you'll be most excited about:**

* Choose from any citation style that exists (over 1300).
* Cite from DOIs (reliably) just like with PMIDs.
* Import an entire bibliography from a `.ris` file exported from Endnote, Zotero, Mendeley, Papers, et al.
* Click and drag references to rearrange them in your bibliography. This also automatically adjusts all of your inline citation numbers on the fly.

**Depreciation Notice:**

This plugin now uses **zero shortcodes**. All citations and references are generated and served in realtime. This way, in the future if you no longer require this plugin, you can uninstall it without it breaking all of your previous posts. There is not one other citation plugin that I am aware of that allows for this, but I believe it is an absolute must. That being said, if you are an early adoptor, you will need to do one of the two following things to preserve your posts from back when this plugin did use shortcodes.

1. **The hard way**: Go back and regenerate all the citations that you made with shortcodes.
2. **The easy way**: Copy and paste one or both of [these code snippets](https://gist.github.com/dsifford/d464e1a0398fae3df570b94776646e79) into your `functions.php` file in your theme.

I will keep the depreciated shortcodes live in this plugin from now until the next update. Sorry for the trouble this may cause.

= 2.4.2 =
* Fix critical bug which caused posts without an ordered list to lose the first paragraph and indent strangely.
* Fix typo on one of the CSS selectors on the options page. `.abt-smart-bib` => `#abt-smart-bib`

**Note:** I am aware of the issue with Internet Explorer browsers not generating tooltips. This is because IE operates using a very, very, very....very outdated broswer standard. I'll work on a fix soon and push that out when I get it working. Thanks!

If you'd like to follow along or join the conversation on some of the next few milestones of this plugin, please see [this excellent thread](https://github.com/dsifford/academic-bloggers-toolkit/issues/20) started by @metallikat36.

= 2.4.1 =
* Fix bug that caused tooltips to not render at all on Firefox browsers (and Internet Explorer?) - If IE still has issues, please let me know. I don't own a Windows PC so I can't test.
* Fix bug that caused the menu icon to display as a smiley face on new posts and pages.

**Note:** I received the following two suggestions from users. Expect to see them implemented on the next update.
1. The ability to have the reference list toggleable (similar to the peer review boxes).
2. The ability to make the peer review boxes non-toggleable.

Keep the great suggestions coming!

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

Documentation improvements will be added within the next few days.

**Note:** Due to the magnitude of this update, there may be bugs that I have not encountered (although, I did test this pretty heavily).
If you run into any problems, have any questions, or experience a bug, please file an issue [here](https://github.com/dsifford/academic-bloggers-toolkit/issues).

A special thanks to @metallikat36 for the great suggestions that led directly to the features added in this update.

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

= 4.0.1 =
Major stability improvements

= 3.1.3 =
Bugfixes

= 3.1.1 =
Bugfixes and performance improvements.

= 1.1 =
* Fixed issue where post excerpt wouldn't show correctly. (Thanks Brent Thoma!)

= 1.0 =
* Initial stable release.
