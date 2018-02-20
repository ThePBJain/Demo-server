## Node + Express + Redis

[![Build Status]]

[![Coverage Status]]

This is a template for you to use on your Redis Caching Server. Follow the directions below to get started.


The back-end API includes:

1. User auth
1. Testing via Mocha and Chai as well as Istanbul for code coverage

## Quick Start

1. Clone and install dependencies
1. Update the config:
  - Rename the *.env_sample* file to *.env* and update
  - Update the Mongo URI in */src/_config.js* (if necessary)
1. Update the key on line 1 of *src/client/js/main.js*
1. Run the app - `npm start` or `gulp`

### Pranav

1. docker-compose build --no-cache
1. docker build -t ubuntu_web --no-cache .

> The database, if empty, is seeded with an admin user - username: *ad@min.com* / password: *admin*

##Todo

- (todo) Setup unit tests
- (todo) Setup proper security (ssl, proper auth workflow)
- todo: implement csrf

## Development Workflow

1. Create feature branch
1. Develop/test locally (hack! hack! hack!)
1. Create PR, which triggers Travis CI
1. After tests pass, merge the PR
1. Tests run again on Travis CI
1. Once tests pass, code is deployed automatically to staging server on Heroku (WIP)

## Tests

Without code coverage:

```sh
$ npm test
```

With code coverage:

```sh
$ npm run cov
```

## Changelog

1. 02/20/2018 - Initial Commit

## JSON API Documentation


### Tabs

- POST `/tabs/add` - increment counter to # of scans for RFID



## Screenshots