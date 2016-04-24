### Large Tasks
- [x] Add select box so user can choose person type for cases where there may be more than one (books = author, editor).
- [x] Finish date parsing function for `referenceWindow`.
- [x] Finish Person parsing function for `referenceWindow`.
- [x] Figure out multiple DOI input and mixed DOI/PMID inputs
- [ ] Update `README.md` and `readme.txt`
- [ ] Update `CHANGELOG.md`

### General Todos...
- [x] Fix list of reference types to not include dependent refs.
- [x] Bump this branch to version 3.0.0 -- should be a major semver bump.
- [x] Fix vendor path (bring to root).
- [x] Minify all vendored scripts (and make them JS files).
- [x] Fix gulp task flow for vendored files.
- [x] Fix field labels for manual reference inputs.
- [x] Better labelling on RIS import window
- [x] Cleanup unused typings + add globals for CrossRef/etc where needed.
- [x] Throw together typings for constants
- [x] Break `referenceWindow` into multiple files + add `LocalEvents` to `Constants`
- [x] TypeScript just released (finally) the version with improved control flow type guards... update if/else blocks accordingly.
- [ ] Have travis trigger coveralls.
- [ ] `Reflist` loading spinner hangs when page loads with regular text editor selected.

### JS Related
- [x] Finish test coverage for untested files.
- [ ] Document all undocumented functions / classes / etc
- [x] Remove `Parsers.ts` (be sure it's not still needed).
- [x] Prune `helperFunctions.ts` for irrelevant functions.
- [x] Add nicer loading spinner to reflist meta box
- [ ] Determine what to do with modal vertical sizing on manual reference window.
- [x] Fix the (somewhat) broken `attachInline` function (broken on anything other than pubmed at the moment).
- [x] Pubmed API error handling (and probably CrossRef too)

### PHP / WordPress Related
- [ ] Heavily test the depreciation handler -- Changes might cause old peer reviews to be deleted.
- [ ] Update options page with new list of citations.
- [ ] Update options page with instructions on how to add a default title to bibliography (#26).
