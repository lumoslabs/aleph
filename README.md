# Aleph

[![Build Status](https://api.travis-ci.org/lumoslabs/aleph.svg?branch=master)](https://magnum.travis-ci.com/lumoslabs/self_service_analytics)

Aleph is a Redshift analytics platform that focuses on aggregating institutional data investigation techniques.

- [Introduction](http://engineering.lumosity.com/aleph)
- [Demo](http://aleph-playground.lumosity.com/queries)
- [Contact & Discuss](https://groups.google.com/forum/#!forum/aleph-user)

## Quickstart
### Aleph Playground Install

Install the gem and connect to your own Redshift cluster; `aleph playground` will prompt you for the configurations it needs.

* You must be using [PostgreSQL 9.2beta3 or later client libraries](https://kkob.us/2014/12/20/homebrew-and-postgresql-9-4/)
* Install and run Redis: `brew install redis  && redis-server &`
* `gem install aleph_analytics && aleph playground`
* To list gem executables, just type `aleph --help`

#### Resetting your Redshift connection.
If you need to do this again, here are some instructions:

1. Edit `redshift.yml` in your configuration directory
- Create file `env.yml` in your configuration directory.
- Follow this example ([example](config/example/env.yml)) and fill in your `admin_redshift_username` and `admin_redshift_password`
- `aleph import_env_variables --rails-env playground`

Your configuration directory is `/tmp/aleph/configuration` unless you have specified otherwise.

### Run the Demo

Requires [Docker](https://docs.docker.com/mac/step_one/).

* `docker run -p 3000:3000 lumos/aleph-demo`
* `open http://$(docker-machine ip):3000`

## Installation

### Dependencies
For a proper production installation, Aleph needs an external Redis instance and operational database. The locations of these services can be configured using [environment variables](docs/ENVIRONMENT_VARIABLES.md). More detailed instructions on configuration can be found [here](docs/ADVANCED_CONFIGURATION.md). Example configurations can be found [here](config/example).

### The app
There are a number of ways to install and deploy Aleph. The simplest is to set up a Dockerfile that installs aleph as a gem:

    FROM ruby:2.1.6

    # we need postgres client libs
    RUN apt-get update && apt-get install -y postgresql-client --no-install-recommends && rm -rf /var/lib/apt/lists/*

    # make a log location
    RUN mkdir -p /var/log/aleph
    ENV SERVER_LOG_ROOT /var/log/aleph

    # make /tmp writeable
    RUN chmod 777 /tmp

    # bundle install inside the aleph gem
    RUN gem install aleph_analytics

    # copy our aleph configuration over to the image
    ENV ALEPH_CONFIG_PATH /etc/aleph/
    COPY aleph_conifg/. /etc/aleph/.

    # install the aleph dependencies
    RUN aleph deps


You can then deploy and run the main components of Aleph as separate services using the gem executables:

- web_server - `aleph web_server --worker-process 2`
- query workers - `aleph workers`  
- clock (used to trigger alerts) - `aleph clock`  

At runtime, you can inject all the secrets as environment variables.

We *highly* recommend that you have a git repo for your queries and s3 location for you results.

Advanced setup and configuration details (including how to use Aleph roles for data access, using different auth providers, creating users, and more) can be found [here](docs/ADVANCED_CONFIGURATION.md).

## Contribute
Aleph is Rails on the backend, Angular on the front end. It uses Resque workers to run queries against Redshift. Here are few things you should have before developing:

* Redshift cluster
* Postgres and Redis installed
* Git Repo (for query versions)
* S3 Location (store results)

While the demo/playground version does not use a git repo or S3, we *highly* recommend that you use them in general.

### Setup
*Postgres*

    createuser -s -P postgres
    initdb --encoding=utf8 --auth=md5 --auth-host=md5 --auth-local=md5 --username=postgres --pwprompt /usr/local/var/postgres
* development password should be "password"
* Restart Postgres

*Database*

    bundle exec rake db:create db:migrate
    RAILS_ENV=test bundle exec rake db:setup db:test:prepare

*Karma/Jasmine*

    npm install

### Testing

    RAILS_ENV=test bundle exec rspec spec
    bundle exec rake karma:run

### Running

    bundle exec foreman start
You can manage your env variables in a .env file

## Links

- [Rubygem](https://rubygems.org/gems/aleph_analytics)
- [aleph-user group](https://groups.google.com/forum/#!forum/aleph-user)


Unless otherwise noted, all Aleph source files are made available under the terms of the [MIT License](https://github.com/lumoslabs/aleph/blob/master/LICENSE)
