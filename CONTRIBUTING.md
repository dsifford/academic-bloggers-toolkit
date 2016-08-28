## Contributing

#### Requirements
- [NodeJS](https://nodejs.org)
- [Docker](https://github.com/docker/docker) & [Docker Compose](https://github.com/docker/compose) (preferably the latest versions running on a linux machine)

##### Don't have Docker?
MAMP, WAMP, or some other local apache server can be used in it's place. Just point the plugin directory of that server to `<project-root>/dist` and you should be good to go. That said, Docker is _highly_ recommended.

### Getting Started
  Steps  |  Command Line Instructions  
---------|----------------------------
Fork this repo and clone locally | `git clone <your fork>`
Navigate to the cloned directory | `cd academic-bloggers-toolkit`
Install local node dependencies | `npm install`
Start your dev server | `docker-compose up -d`
Start BrowserSync | `npm start`

After those steps are completed, you'll be able to login to a fresh install of WordPress at `localhost:3000` (if using browser sync) or `localhost:8080`. The login credentials are:
- Username: `root`
- Password: `root`

### After completing your changes
Submit a pull request to this repo and let's talk about your changes. After we're both on the same page (and assuming the changes are in accordance with the direction of the project), the changes will be merged.

Before submitting the pull request, be sure to lint your changes by running `npm run lint`.

Thanks for your interest!
