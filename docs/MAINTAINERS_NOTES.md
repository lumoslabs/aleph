
## Publish Gem to RubyGem

1. bump version, date in aleph.gemspec (plus any other changes)
* `bundle exec rake assets:clobber`
* `RAILS_ENV=production bundle exec rake assets:precompile`
* remove the old gem (`rm -rf *.gem` ?)
* `gem build aleph.gemspec`
* `gem install aleph-analytics-{version}.gem`
* `gem push aleph-analytics-{version}.gem` (need rubygem creds)


## Push docker demo image

1. Publish gem to RubyGems (see above)
* `cd docker_demo`
* `docker build --no-cache -t lumos/aleph-demo .`
* `docker push lumos/aleph-demo`


## Push docker playground image

1. Publish gem to RubyGems
* `cd docker_playground`
* `docker build --no-cache -t lumos/aleph-playground .`
* `docker push lumos/aleph-playground`


## Update demo in sloppy.io (Optional)

1. Log into sloppy.io
* restart
