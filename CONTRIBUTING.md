## Contributing

**NOTE:** This guide still needs to be updated. If you're interested in contributing and this message is still present, please file an issue and I'll get this updated.

#### Requirements
- [NodeJS](https://nodejs.org)
- [Gulp](https://github.com/gulpjs/gulp) (global install): `npm install -g gulp-cli`
- [Docker](https://github.com/docker/docker) & [Docker Compose](https://github.com/docker/compose) (preferably the latest versions running on a linux machine)

#### Optional
- [TypeScript 2.x](https://github.com/Microsoft/TypeScript) (global install): `npm install -g typescript@next`

### Getting Started
  Steps  |  Command Line Instructions  
---------|----------------------------
Fork this repo and clone locally | `git clone <your fork>`
Navigate to the cloned directory | `cd academic-bloggers-toolkit`
Install local node dependencies | `npm install`
Start your dev server | `docker-compose up -d`
Start BrowserSync | `gulp`

After those steps are completed, you'll be able to login to a fresh install of WordPress at `localhost:3000` (if using browser sync) or `localhost:8080`. The login credentials are:
- Username: `root`
- Password: `root`

### After completing your changes
Submit a PR to this repo and let's talk about your changes. After we're both on the same page (and assuming the changes are in accordance with the direction of the project), the changes will be merged.

Thanks for your interest!
