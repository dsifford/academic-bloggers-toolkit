# Academic Blogger's Toolkit
An **open source** Wordpress plugin providing an all-in-one solution for effective academic blogging.

##Features

####Automatically parse references using digital identifiers (PMID, PMCID, or DOI)
![Citation Parser](http://giant.gfycat.com/FreeIcyCormorant.gif)
- Option to add hyperlink to PubMed.
- Available citation styles include...
    + American Medical Association (AMA) Format.
    + American Psychological Association (APA) Format. 

####Anchor links to and from in-text citations
![Anchor Links](http://giant.gfycat.com/GrizzledBabyishIntermediateegret.gif)

####Append up to 3 formatted Peer Reviews to blog posts via a Frontend UI integrated on the post edit screen
![Peer Review](http://giant.gfycat.com/AccomplishedWindyDeviltasmanian.gif)

####Customize Options
![Options Page](http://i.imgur.com/i8qLiey.png)
- CSS override.
- Citation style picker.

###Feature Requests
Please direct all ideas to the Academic Blogger's Toolkit [Trello Board](https://trello.com/b/nFxfo6iO/academic-blogger-s-toolkit)

##Currently Working On
- Rewrite citation parser script to be friendlier with multiple citation styles

##Todo List
- Tidy up citation anchor links --
    + Add jQuery smooth animation.
    + Adjust for heading bar on bounceback.

##Future
- Multiple Authors.
- DOI System?
- Automatic Email Metrics.
    + Requires extensive programming through Google's Analytics Core API. Slowly working on this.

##Additional Notes
- Hand-typed reference fields
    + Extensive coding would be required for this. Typing manually into fields vs manually in the editor doesn't save much time. Not going to add this feature unless requested.
- Integrate CrossRef / CSL Citations API
    + **Note:** It appears that in order to do this, I'd have to include a huge javascript library in the build (citeproc.js). For now, I'll just hand-code styles as they are requested. 

