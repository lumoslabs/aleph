# Aleph

[![Build Status](https://api.travis-ci.org/lumoslabs/aleph.svg?branch=master)](https://magnum.travis-ci.com/lumoslabs/self_service_analytics)

Aleph is a Redshift analytics platform that focuses on aggregating institutional data gathering know-how

## Quickstart

With Docker:

* `docker run -p 3000:3000 lumos/aleph-demo`
* In a browser, navigate to the docker host ip (`docker-machine ip`), port 3000

Without Docker (mac instructions in parenthesis):

* You must be using PostgreSQL 9.2beta3 or later client libraries (https://kkob.us/2014/12/20/homebrew-and-postgresql-9-4/)
* You must have Redis installed and running (`brew install redis  && redis-server &`)
* `gem install aleph_analytics && aleph playground`
