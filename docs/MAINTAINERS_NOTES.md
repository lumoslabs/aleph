
# Publish Gem to RubyGem

1. edit version, date, etc in aleph.gemspec
* `bundle exec rake assets:clobber`
* `RAILS_ENV=production bundle exec rake assets:precompile`
* remove the old gem (`rm -rf *.gem` ?)
* `gem build aleph.gemspec`
* `gem install aleph-analytics-{version}.gem`
* `gem push aleph-analytics-{version}.gem` (need rubygem creds)


# Push docker demo image

1. Publish gem to RubyGems (see above)
* `cd docker_demo` (from root)
* `docker build -t lumos/aleph-demo .`
* `docker push lumos/aleph-demo`


# Update demo in sloppy.io (please!!)

1. Log into sloppy.io
* restart
