# Academic Blogger's Toolkit
An **open source** WordPress plugin providing an all-in-one solution for effective academic blogging.

##Features

#####Automatically parse references using digital identifiers (PMID, PMCID, or DOI)
![Citation Parser](http://i.imgur.com/QrQ2CYw.gif)
- **NEW FOR v2.0.0:** Citations are now inserted on the fly.
- Option to add hyperlink to PubMed.
- Available citation styles include...
    + American Medical Association (AMA) Format.
    + American Psychological Association (APA) Format.

#####Anchor links to and from in-text citations
![Anchor Links](http://giant.gfycat.com/GrizzledBabyishIntermediateegret.gif)
- Smooth scrolling using jQuery
- Fix: Corrected issue where admin bar would block the target link.

#####Append up to 3 formatted Peer Reviews to blog posts via a Frontend UI integrated on the post edit screen
![PeerReview](http://i.giphy.com/3oEduUHk7UBWhh5Pa0.gif)

#####Integration with Google Tag Manager
- Google's newest [analytics powerhouse](http://www.google.com/tagmanager/)!
- Track individual link clicks to see who is interacting with or downloading your content and much more!

###Feature Requests
Please submit all feature requests / bugs to the Academic Blogger's Toolkit [Issues Page on GitHub](https://github.com/dsifford/academic-bloggers-toolkit/issues).

##Future
- Multiple Authors.
- DOI System?
- Automatic Email Metrics.
    + Requires extensive programming through Google's Analytics Core API. Slowly working on this.

##Changelog

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
