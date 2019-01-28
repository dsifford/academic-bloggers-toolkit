# CHANGELOG

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
