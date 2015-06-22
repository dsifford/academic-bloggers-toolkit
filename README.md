# Academic Blogger's Toolkit
Wordpress plugin providing an all-in-one solution for effective academic blogging.

**Updated Readme coming soon**

##Features
- Automatically parse references using digital identifiers (PMID, PMCID, or DOI).
    + Option to add hyperlink to PubMed.
- Anchor links to and from in-text citations.
- Append up to 3 formatted Peer Reviews to blog posts via a Frontend UI integrated on the post edit screen.
- CSS Override area in options menu.
- Citation style picker in options menu.

###Feature Requests
Please direct all ideas to the Academic Blogger's Toolkit [Trello Board](https://trello.com/b/nFxfo6iO/academic-blogger-s-toolkit)

##Currently Working On
- Rewrite citation parser script to be friendlier with multiple citation styles

##Todo List
- Tidy up citation anchor links --
    + Add jQuery smooth animation
    + Account for heading bar on bounceback

##Future
- Multiple Authors
- DOI System?

##Additional Notes
- **Automatic Email Metrics**
    + At present, I don't possess the knowledge on how to work with Google's vastly complex analytics API - Consider adding this in the future.
- Hand-typed reference fields
    + Extensive coding would be required for this. Typing manually into fields vs manually in the editor doesn't save much time. Not going to add this feature unless requested.
- Integrate CrossRef / CSL Citations API
    + **Note:** It appears that in order to do this, I'd have to include a huge javascript library in the build (citeproc.js). For now, I'll just hand-code styles as they are requested. 

