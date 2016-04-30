[![Coverage Status](https://coveralls.io/repos/github/dsifford/academic-bloggers-toolkit/badge.svg?branch=master)](https://coveralls.io/github/dsifford/academic-bloggers-toolkit?branch=master) [![Build Status](https://travis-ci.org/dsifford/academic-bloggers-toolkit.svg?branch=master)](https://travis-ci.org/dsifford/academic-bloggers-toolkit)

# Academic Blogger's Toolkit
An **open source** WordPress plugin providing an all-in-one solution for effective academic blogging.

## Features
- Insert formatted references on the fly using digital identifiers (**PMID** or **DOI**).
- Manually insert formatted references from **over 15 types of references**.
- **Import a full bibliography from your favorite reference manager** using an exported `.ris` file.
- Automatically format references for **every citation style on planet earth** (over 1300).
- **Fully interactive** reference list which lives beside the post editor.
    - Need to change your bibliography order? Click and drag a reference to move it around the list. This automagically adjusts your bibliography as well as **all** of your inline citation numbers on the fly.
    - Want to insert a citation inline from your reference list? Select it (and any others you'd like to insert) and click insert.
- **Search PubMed from the post editor** and insert references instantly.
- Inline citations display full formatted references on the frontend when hovered with the mouse (or when tapped on mobile). No more scrolling down and losing your focus!
- Append up to three peer reviews below your posts. Peer reviews include not only the review content, but also reviewer bios, photos, and author responses (when necessary).

#### What makes this plugin different than `x`? Don't they offer the same thing?

Here's the problem. To my knowledge, there is not one citation plugin that exists for WordPress that does its job the way it should. Every other citation plugin uses WordPress shortcodes to render citations. Is that a bad thing. **Yes**. Here's why:

Once you commit to using a plugin that uses shortcodes to render content, you're stuck with it for the life of your website. If you uninstall that plugin, all posts which rely on the shortcodes from that plugin break. Additionally, if the person who wrote the plugin decides he/she no longer wants to support it and the shortcode API changes, all of your posts will break. **This is unacceptable for academic writing**.

This plugin generates plain, beautiful HTML and renders it at the time of insertion. There are **zero** shortcodes. There is **zero** chance of your posts breaking.

Need to write one long blog post with lots of references? Download this plugin, write the post, and then delete the plugin if you don't need it any longer. **Freedom.**

## Contributing

#### Requirements
- [NodeJS](https://nodejs.org)
- [Gulp](https://github.com/gulpjs/gulp) (globally install): `npm install -g gulp-cli`
- [Typings](https://github.com/typings/typings) (globally install): `npm install -g typings`
- [Docker](https://github.com/docker/docker) & [Docker Compose](https://github.com/docker/compose) (preferably the latest versions running on a linux machine)

#### Optional
- [TypeScript](https://github.com/Microsoft/TypeScript) (global install): `npm install -g typescript`

### Getting Started
|  Steps  |  Command Line Instructions  |
|---------|-----------------------------|
Fork this repo and clone locally | `git clone <your fork>`
Navigate to the cloned directory | `cd academic-bloggers-toolkit`
Install local node dependencies | `npm install`
Install typings | `typings install`
Compile the files | `gulp build`
Start your dev server | `docker-compose up -d`
Start BrowserSync | `gulp serve`

After those steps are completed, you'll be able to login to a fresh install of WordPress at `localhost:3000` (if using browser sync) or `localhost:8080`. The login credentials are:
- Username: `root`
- Password: `root`

### After completing your changes
Submit a PR to this repo and let's talk about your changes. After we're both on the same page (and assuming the changes are in accordance with the direction of the project), the changes will be merged.

Thanks for your interest!


## Usage

**Will update later...**
