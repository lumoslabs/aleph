Notes On How To Put Out A Release
=================================

## Publish Gem to RubyGem

1. bump version, date in aleph.gemspec (plus any other changes)
* `bundle exec rake assets:clobber`
* `RAILS_ENV=production bundle exec rake assets:precompile`
* remove the old gem (`rm -rf *.gem` ?)
* `gem build aleph.gemspec`
* `gem install aleph_analytics-{version}.gem`
* `gem push aleph_analytics-{version}.gem` (need rubygem creds)


## Push docker demo image

1. Publish gem to RubyGems (see above)
* `cd docker_demo`
* `docker build --no-cache -t lumos/aleph-demo .`
* `docker push lumos/aleph-demo`

#### Update demo in sloppy.io (Recommended)

Sloppy hosts the lumos/aleph-demo at `aleph-analytics.io`

1. Log into sloppy.io
* restart


## Push docker playground images

1. Publish gem to RubyGems
* `cd docker_playground`
* `docker build --no-cache -t lumos/aleph-playground .`
* `docker push lumos/aleph-playground`


* `cd docker_snowflake_playground`
* `docker build --no-cache -t lumos/aleph-snowflake-playground .`
* `docker push lumos/aleph-snowflake-playground`

## Edit CHANGELOG.MD
* please!

## Tag the release!
* `git tag -a release_{ver} -m "release {ver}"`
* `git push origin release_{ver}`
