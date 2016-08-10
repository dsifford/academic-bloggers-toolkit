[![Coverage Status](https://coveralls.io/repos/github/dsifford/academic-bloggers-toolkit/badge.svg?branch=master)](https://coveralls.io/github/dsifford/academic-bloggers-toolkit?branch=master) [![Build Status](https://travis-ci.org/dsifford/academic-bloggers-toolkit.svg?branch=master)](https://travis-ci.org/dsifford/academic-bloggers-toolkit) [![WordPress](https://img.shields.io/wordpress/plugin/dt/academic-bloggers-toolkit.svg?maxAge=2592000)](https://wordpress.org/plugins/academic-bloggers-toolkit/) ![Dependencies](https://david-dm.org/dsifford/academic-bloggers-toolkit.svg)

# Academic Blogger's Toolkit
An **open source** WordPress plugin providing an all-in-one solution for effective academic blogging.

## Contents
- [Features](#features)
- [Translations](#translations)
- [Usage](#usage)
- [Contributing](#contributing)

### Manifesto

> To my knowledge, there is not one citation plugin that exists for WordPress that does its job the way it should. Every other citation plugin uses WordPress shortcodes to render citations. Is that a bad thing. **Yes**. Here's why:

> Once you commit to using a plugin that uses shortcodes to render content, you're stuck with it for the life of your website. If you uninstall that plugin, all posts which rely on the shortcodes from that plugin break. Additionally, if the person who wrote the plugin decides he/she no longer wants to support it and the shortcode API changes, all of your posts will break. **This is unacceptable for academic writing**.

> This plugin generates plain, beautiful HTML and renders it at the time of insertion. There are **zero** shortcodes. There is **zero** chance of your posts breaking.

> Need to write one long blog post with lots of references? Download this plugin, write the post, and then delete the plugin if you don't need it any longer. **Freedom.**

### Features
- Insert formatted references on the fly using digital identifiers (**PMID** or **DOI**).
- Manually insert formatted references from **over 15 types of references**.
- **Import a full bibliography from your favorite reference manager** using an exported `.ris` file.
- Automatically format references for **every citation style on planet earth** (over 1300).
- **Fully interactive** reference list which lives beside the post editor.
- **Search PubMed from the post editor** and insert references instantly.
- Inline citations display full formatted references on the frontend when hovered with the mouse (or when tapped on mobile). No more scrolling down and losing your focus!
- Append up to three peer reviews below your posts. Peer reviews include not only the review content, but also reviewer bios, photos, and author responses (when necessary).

### Translations

[**Click Here to Translate this Plugin**](https://poeditor.com/join/project/PGYLKWQM5h)

Translations for this plugin can be completed and submitted [here](https://poeditor.com/join/project/PGYLKWQM5h). After submission of a translation, I'll try to update the plugin with your translations within 7 days.

### Usage

#### Adding References
- [Adding References Automatically](#adding-references-automatically)
- [Adding References Manually](#adding-references-manually)
- [Adding References Using RIS File](#adding-references-using-ris-file)

#### Removing References
- [Removing One or More Single References](#removing-one-or-more-single-references)
- [Removing All References](#removing-all-references)

#### Citing References
- [Citing references at the same time the reference is added](#citing-references-at-the-same-time-the-reference-is-added)
- [Citing references after the reference has been added](#citing-references-after-the-reference-has-been-added)

#### Miscellaneous
- [Changing citation style](#changing-citation-style)
- [Pinning reference list](#pinning-reference-list)
- [Changing citation number or position](#changing-citation-number-or-position)

#### Keyboard Shortcuts
(feel free to request more)

PC/Linux | Mac | Action
----|----
`ctrl-alt-r` | `cmd-alt-r` | Open the `Add References` menu

#### Tips 'n Tricks
- Double click the heading to either `Cited Items` or `Uncited Items` to fully expand that list and simultaneously collapse the other.

---

#### Adding References Automatically

1. Click `Add References to Reference List` button [[1b]](#visual-aids).
2. Type a _comma-separated_ list of one or more PMIDs or DOIs in the window that pops up [[3]](#visual-aids).
3. Click `Add Reference` [[3c]](#visual-aids).

#### Adding References Manually
1. Click `Add References to Reference List` button [[1b]](#visual-aids).
2. Click `Add Manually` button [[3a]](#visual-aids).
3. Select your citation type from the dropdown list on the top [[4a]](#visual-aids).
4. Fill out the details for as many contributors as you are able to.
    - If another contributor is needed, click `Add Another` [[4b]](#visual-aids), choose the contributor type [[4c]](#visual-aids), and fill out his/her details. These contributors should be written **in order**.
    - If you need to remove a contributor, click the `x` button beside the contributor's name [[4d]](#visual-aids).
4. Fill out as much information about the reference as you can in the form below. Items highlighted in red are mandatory.
6. When finished, click `Add Reference`.

#### Adding References Using RIS File
> Currently, users are able to import entire reference lists using the widely available [RIS format](http://referencemanager.com/training/ris-format). This section assumes that you have already exported a `.ris` file from your reference manager, PubMed, or some other web service.

1. Click the "hamburger menu" icon to open the secondary menu [[1e]](#visual-aids).
2. Click the `Import references from RIS file` button [[2a]](#visual-aids).
3. Click the `Choose File` button [[5a]](#visual-aids) and select your `.ris` file.
4. Click `Import` [[5b]](#visual-aids) to import the references to your `uncited` list.

#### Removing One or More Single References
> **Note:** This action will delete references from your reference list, your bibliography, and all locations where it has been cited in the document. It will also adjust your inline citation numbers in your document automatically after the action has taken place.

1. Click on one or more references in either the `Cited Items` or `Uncited Items` lists to select them. Selected items have a blue left border [[6a,6b]](#visual-aids)
2. Click `Remove selected items from reference list` to remove the selected references [[1c]](#visual-aids).

#### Removing All References
> **Note:** This is the **single-most destructive action** that you can perform. Be very cautious when doing this as it will delete all traces of references that you have added to your reference list, document, and bibliography.

1. Click the "hamburger menu" button to expose the secondary menu [[1e]](#visual-aids).
2. Click the `Delete all references` button [[2c]](#visual-aids).

#### Citing references at the same time the reference is added
1. Be sure the carat is located at the postion that you want your citation added in the document.
2. Follow the same instructions for [adding references automatically](#adding-references-automatically) or [adding references manually](#adding-references-manually).
3. Just before clicking `Add Reference` in the final step, be sure that the `Attach Inline` checkbox [[3d]](#visual-aids) is checked.

#### Citing references after the reference has been added
1. Be sure the carat is located at the postion that you want your citation added in the document.
2. Select all items that you'd like to cite at the current position (selected items have a blue left border [[6a,6b]](#visual-aids)).
3. Click `Insert Selected References` [[1a]](#visual-aids).

> **Note:** References cited from the **Uncited List** will be brought into the cited list automatically as they are cited.

#### Changing citation style
##### Permanently
1. Navigate to the Academic Blogger's Toolkit options menu by clicking `Settings -> Academic Blogger's Toolkit` in the WordPress sidebar.
2. Choose a citation style from the dropdown menu.
3. Click `Update`.

##### For a single document
1. Click the "hamburger menu" button to expose the secondary menu [[1e]](#visual-aids).
2. Choose a citation style from the dropdown menu [[2e]](#visual-aids).

> **Note:** Changing the citation style in the document will automatically adjust inline citations and the bibliography to match the newly chosen citation style.

#### Pinning reference list
1. Click the pin icon [[1d]](#visual-aids) to toggle floating mode.

> **Note:** During floating mode, the reference list will be resized dynamically to fit within the boundaries of your screen. This is by design. Without this, you would not be able to reach items below the lower margin of your screen.

#### Changing citation number or position

![Imgur](http://i.imgur.com/OTBmHhE.png)

The citation processor automatically sorts and inserts your citations based on how they are supposed to be sorted by your chosen citation style. In other words, each time that a citation is added to your document, ___EVERY___ citation within the document is checked and updated, where appropriate. **If you attempt to move around citation numbers or alter the HTML generated by the processor in any way, the processor will fail**.

If you find that the citation ordering is not the way that you like it, [choose a different citation style](http://editor.citationstyles.org/searchByExample/).

---

### Visual Aids

1. ![Reference List Main Menu](http://i.imgur.com/GHn6bhy.png?1)
2. ![Secondary Menu](http://i.imgur.com/DqmSRwx.png?1)
3. ![Automatic Reference Insertion](http://i.imgur.com/BYIBejN.png?1)
4. ![Manual Reference Window](http://i.imgur.com/dClo8fs.png?1)
5. ![RIS Import Menu](http://i.imgur.com/r00LD73.png?1)
6. ![Cited and Uncited Lists](http://i.imgur.com/o9p5biN.png?1)

### Contributing

If you'd like to contribute to this project, please read the [contributor guide](https://github.com/dsifford/academic-bloggers-toolkit/blob/master/CONTRIBUTING.md).
