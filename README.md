# Aleph

[![Build Status](https://api.travis-ci.org/lumoslabs/aleph.svg?branch=master)](https://magnum.travis-ci.com/lumoslabs/self_service_analytics)
[Aleph](http://engineering.lumosity.com/aleph) is a Redshift analytics platform that focuses on aggregating institutional data investigation techniques.

Learn more [here](http://engineering.lumosity.com/aleph)
Try out the [demo](http://aleph-playground.lumosity.com/queries)

## Quickstart
By far the easiest way to get Aleph running is using Docker. If you don't have Docker installed and set up you can do so [here](https://docs.docker.com/mac/step_one/).

*With Docker:*

* `docker run -p 3000:3000 lumos/aleph-demo`
* `open http://$(docker-machine ip):3000`

*Installing Aleph as a gem (mac instructions in parenthesis):*

* You must be using PostgreSQL 9.2beta3 or later client libraries (https://kkob.us/2014/12/20/homebrew-and-postgresql-9-4/)
* You must have Redis installed and running (`brew install redis  && redis-server &`)
* `gem install aleph_analytics && aleph playground`
