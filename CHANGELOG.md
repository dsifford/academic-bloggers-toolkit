# CHANGELOG

## UNRELEASED

### Minor Changes

- Remove support for the classic editor.
- Update deprecated block editor API usage.
- Increase linespacing in the reference list to make it easier to read.
- Improve UI of citation style search box.
- Improve keyboard accessibility with sidebar.
- Improve support for RTL languages.

### Patches

- Fix misc bugs in static bibliography block styles.
- Misc widespread performance improvements.
- Fix bug causing different citations to sometimes recieve the same ID. #558

## 5.0.5

### IMPORTANT NOTE

This will be the last update that supports the "classic" editor. All updates
beyond this one will have support completely removed to make maintenance and
releases easier for the new editor.

Thank you for understanding.

### Patches

-   Fix code affected by breaking block editor changes.
-   Fix incorrectly keyed patent fields.
-   Add "report type" to manual report fields. #519
-   Upgrade upstream dependencies.

### Styles Added

-   ArchéoSciences (French)
-   Griffith College - Harvard
-   Perspectives on Politics
-   Sociétés Contemporaines
-   Swiss Political Science Review
-   Český finanční a účetní časopis (Czech)

## 5.0.4

### Patches

-   Fix bug related to URL parsing in bibliographies. #549
-   Update dependencies.

### Styles Added

-   Acta Universitatis Agriculturae Sueciae (Swedish University of Agricultural Sciences)
-   Anglia
-   Contemporary Accounting Research
-   Estudios de Fonética Experimental
-   Frontiers of Biogeography
-   Indian Journal of Orthopaedics
-   International Journal for Quality Research
-   IPAG Business School - APA
-   Journal of Developmental & Behavioral Pediatrics
-   Journal of Environmental Engineering and Landscape Management
-   Parasite
-   Rivista Italiana di Paleontologia e Stratigrafia
-   Techniques&Culture (French)
-   The Journal of Hand Surgery Asian-Pacific Volume
-   ZDfm - Zeitschrift für Diversitätsforschung und -management

## 5.0.3

### Patches

-   Fix bug preventing citations from being saved.
-   Fix bug resulting in errors being thrown when citing certain DOIs with certain citation styles. #543

### Styles Added

-   Chemical Engineering Progress
-   Journal of Developmental and Behavioral Pediatrics
-   Revue des Études Byzantines
-   The Journal of Hand Surgery (European Volume)

## 5.0.2

### Patches

-   Fix fatal PHP exception issue related to legacy custom CSS. #538 #539

## 5.0.1

### Patches

-   PHP 7.0 compatibility: 85a282b54bbe35e3723d55a831aa411db4cc19de
-   Fix issue with date parsing when autociting a website: 589459f2253de9046af301382e7bbfa0ff5db3f5

## 5.0.0

This release is a complete rewrite of the codebase for the new Block Editor. In this release, there are vast improvements to both performance and reliability as well as a handful of other nice changes that I hope you'll all enjoy.

### BREAKING CHANGES

-   PHP 7.2 is required to use this plugin.
-   "Full Note" style citations are no longer supported.

### Major Changes

-   100% backwards compatibility with old editor citations.
-   Full rewrite of the codebase for the block editor.
-   Add integrated footnotes: 7122b9dd19d7fda192e40a3b39297a4012128890

### Minor Changes

-   Add static publication list block: 75785d86429ce9f6cfc98d192ed59884b5b74ec9
-   Update citation styles: 856d446dd2a1a3ad4d86f3c2082fc60334928f26

### Patches

-   Use minified citeproc from jsdelivr CDN: b98b92b91f64f49f9de2a5f023ad70787e2ab452
-   Fix sorting of citation items in tooltips.: 012dfe825be18ff496d836adf7aac6616429be4b
-   Add URL field to a few more manual types. closes #535: b37b65c1a442f149172c04516aade1c0a9c880d3
-   Switch to protected meta for editor state: 57feb2a66dfbe2b312cc07af28695f38e0783dba
-   Improve checks for loading legacy code vs new code: 22e1f9cf3d15e5f8dce5aff642408f554bb2b5e3
-   Fix error message parsing in csl file parser: ad41da8436ece7efe9ce21e017de48d65068e01e
