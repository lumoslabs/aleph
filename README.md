# Aleph

[![Build Status](https://api.travis-ci.org/lumoslabs/aleph.svg?branch=master)](https://magnum.travis-ci.com/lumoslabs/self_service_analytics)

Aleph is a Redshift analytics platform that focuses on aggregating institutional data investigation techniques.

* [Introduction](http://engineering.lumosity.com/aleph)
* [Demo](http://aleph-playground.lumosity.com/queries)
* [Rubygem](https://rubygems.org/gems/aleph_analytics)
* [Contact/Discuss](https://groups.google.com/forum/#!forum/aleph-user)

### Quickstart
By far the easiest way to get Aleph running is using Docker. If you don't have Docker installed and set up you can do so [here](https://docs.docker.com/mac/step_one/).

*Docker Install*

* `docker run -p 3000:3000 lumos/aleph-demo`
* `open http://$(docker-machine ip):3000`

*Gem Install (mac instructions in parenthesis):*

* You must be using PostgreSQL 9.2beta3 or later client libraries (https://kkob.us/2014/12/20/homebrew-and-postgresql-9-4/)
* You must have Redis installed and running (`brew install redis  && redis-server &`)
* `gem install aleph_analytics && aleph playground`

### Gem executables
After the gem is installed: `aleph --help`

### Contribute / Develop
Aleph is Rails on the backend, Angular on the front end. It utilizes Resque workers to run queries against Redshift. Here are few things you should have before developing:

* Redshift cluster
* Postgres and Redis installed (see Gem install in Quickstart)
* Git Repo (to maintain query versions)
* S3 Location (store results)

While the demo/playground version does no use a git repo or S3, we *highly* recommend that you use them in general.

*Setup Postgres*

    createuser -s -P postgres
    initdb --encoding=utf8 --auth=md5 --auth-host=md5 --auth-local=md5 --username=postgres --pwprompt /usr/local/var/postgres
* development password should be "password"
* Restart Postgres

*Setup your db*

    bundle exec rake db:create db:migrate
    RAILS_ENV=test bundle exec rake db:setup db:test:prepare

*Set up Karma/Jasmine JS unit testing*

    npm install

This command will install what is in package.json and create a node_modules folder

*Testing*

    RAILS_ENV=test bundle exec rspec spec
    bundle exec rake karma:run

*Running*

    bundle exec foreman start
You can manage your env variables in a .env file

### Run in Production
How you want to deploy Aleph is up to you.

At Lumos, we include the Aleph gem in another ruby project's Gemfile and then install that in a docker image:

    COPY Gemfile /usr/src/app/
    COPY Gemfile.lock /usr/src/app/
    RUN bundle install --binstubs --without development test
    COPY . /usr/src/app

    # bundle install inside the aleph gem
    RUN bundle exec aleph deps

We then deploy and run the main components of Aleph as separate services using the gem executables:

* web_server: `bundle exec aleph web_server --worker-process 2`
* query workers: `bundle exec aleph workers`  
* clock (used to trigger alerts): `bundle exec aleph clock`  

In general, we have had a lot of luck with docker, so we encourage you to do something similar. Again we *highly* that you have a git repo for your queries and s3 location for you results.

### Help & Discussion

Hit us up [here](https://groups.google.com/forum/#!forum/aleph-user) if you have questions.
