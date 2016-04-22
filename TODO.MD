### Large Tasks
- [ ] Add select box so user can choose person type for cases where there may be more than one (books = author, editor).
- [ ] Finish date parsing function for `referenceWindow`.
- [ ] Finish Person parsing function for `referenceWindow`.

### General Todos...
- [x] Fix list of reference types to not include dependent refs.
- [x] Bump this branch to version 3.0.0 -- should be a major semver bump.
- [x] Fix vendor path (bring to root).
- [x] Minify all vendored scripts (and make them JS files).
- [x] Fix gulp task flow for vendored files.
- [x] Fix field labels for manual reference inputs.
- [ ] Better labelling on RIS import window
- [ ] Cleanup unused typings + add globals for CrossRef/etc where needed.
- [ ] Throw together typings for constants
- [ ] Break `referenceWindow` into multiple files + add `LocalEvents` to `Constants`

### JS Related
- [ ] Finish test coverage for untested files.
- [ ] Document all undocumented functions / classes / etc
- [ ] Figure out multiple DOI input and mixed DOI/PMID inputs
- [x] Remove `Parsers.ts` (be sure it's not still needed).
- [x] Prune `helperFunctions.ts` for irrelevant functions.
- [ ] Add nicer loading spinner to reflist meta box
- [ ] Determine what to do with modal vertical sizing on manual reference window.

### PHP / WordPress Related
- [ ] Heavily test the depreciation handler -- Changes might cause old peer reviews to be deleted.
- [ ] Update options page with new list of citations.
- [ ] Update options page with instructions on how to add a default title to bibliography (#26).
- [ ] Check out genericons -- Might find better ones than I'm using.
