=== Academic Blogger's Toolkit ===
Contributors: dsifford
Donate link: https://donorbox.org/academic-bloggers-toolkit
Tags: academia, academic, bibliographies, bibliography, bibtex, citation, citations, cite, citing, CSL, curriculum vitae, cv, doi, endnote, footnote, footnotes, journal, mendeley, papers, pmid, pmcid, publications, publish, pubmed, reference, reference list, reference manager, references, referencing, ris, scholar, scholarly, zotero
Requires at least: 5.0
Tested up to: 5.0
Requires PHP: 7.0
Stable tag: {{VERSION}}

A plugin extending the functionality of Wordpress for academic blogging.

== Description ==

**FULLY SUPPORTS THE NEW BLOCK EDITOR!**

Academic Blogger's toolkit is an **open source** WordPress plugin providing an all-in-one solution for effective academic blogging.

= This README page is not kept up to date! =

For a constaintly updated, exhaustively detailed, introduction to this plugin and all its features, please visit the plugin's [GitHub Repository](https://github.com/dsifford/academic-bloggers-toolkit).

To dive right into the documentation, check out the [Academic Blogger's Toolkit Wiki](https://github.com/dsifford/academic-bloggers-toolkit/wiki)!

= Features =

* Insert formatted references on the fly using **PMID**, **DOI** (CrossRef, DataCite, & mEDRA), **URL**, or **ISBN**.
* Manually insert formatted references from **over 15 types of references**.
* **Import a full bibliography from your favorite reference manager** using an exported `.ris` file.
* Automatically format references for **every citation style on planet earth**.
* **Fully interactive** reference list which lives beside the post editor.
* Insert and manager **footnotes** in the editor automatically.
* Inline citations display full formatted references on the frontend when hovered with the mouse (or when tapped on mobile). No more scrolling down and losing your focus!

= Contributing =

If you're a developer and would like to contribute, you can do so via this plugin's [GitHub Repository](https://github.com/dsifford/academic-bloggers-toolkit).

== Screenshots ==

1. Overview of the reference manager screen.
2. Overview of the manual reference insertion screen.
3. Citation tooltips.

== Changelog ==

= 5.0.0 =

This release is a complete rewrite of the codebase for the new Block Editor. In this release, there are vast improvements to both performance and reliability as well as a handful of other nice changes that I hope you'll all enjoy.

### BREAKING CHANGES

* PHP 7.2 is required to use this plugin.
* "Full Note" style citations are no longer supported.

### Major Changes

* 100% backwards compatibility with old editor citations.
* Full rewrite of the codebase for the block editor.
* Add integrated footnotes.

### Minor Changes

* Add static publication list block
* Update citation styles.

### Patches

* Use minified citeproc from jsdelivr CDN.
* Fix sorting of citation items in tooltips.
* Add URL field to a few more manual types. closes #535
* Switch to protected meta for editor state.
* Improve checks for loading legacy code vs new code.
* Fix error message parsing in csl file parser.

