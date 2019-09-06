
# Aleph
Aleph is a business analytics platform that focuses on ease-of-use and operational simplicity. It allows analysts to quickly author and iterate on queries, then share result sets and visualizations. Most components are modular, but it was designed to version-control queries (and analyze their differences) using Github and store result sets long term in Amazon S3.

![aleph](images/aleph_repo_banner.png)


- [Introduction](http://engineering.lumosity.com/aleph)
- [Demo](http://aleph-analytics.io) / [Video](https://www.youtube.com/watch?v=I5N7Xr-NVcU)
- [Help](https://groups.google.com/forum/#!forum/aleph-user)

[![Build Status](https://api.travis-ci.org/lumoslabs/aleph.svg?branch=master)](https://magnum.travis-ci.com/lumoslabs/self_service_analytics)


## Quickstart
If you want to connect to your own Redshift or Snowflake cluster, the follow instructions should get you up and running.

### Database Configuration
Configure your Redshift or snowflake database and user(s).

###### Additional requirements for Snowflake
* Snowflake users must be setup with default warehouse and role; they are not configurable in Alpeh.
* Since Aleph query results are unloaded directly from Snowflake to AWS S3, S3 is required for Snowflake connection.
Configure an S3 bucket and create an external S3 stage in Snowflake. e.g.

      create stage mydb.myschema.aleph_stage url='s3://<s3_bucket>/<path>/'
        credentials=(aws_role = '<iam role>')

### Docker Install
The fastest way to get started: [Docker](https://docs.docker.com/mac/step_one/)

* For Redshift, run

      docker run -ti -p 3000:3000 lumos/aleph-playground /bin/bash -c "aleph setup_minimal -H {host} -D {db} -p {port} -U {user} -P  {password}; redis-server & aleph run_demo"

* For Snowflake, run

      docker run -ti -p 3000:3000 lumos/aleph-playground /bin/bash -c "export AWS_ACCESS_KEY_ID=\"{aws_key_id}\" ; export AWS_SECRET_ACCESS_KEY=\"{aws_secret_key}\" ; cd /usr/bin/snowflake_odbc && sed -i 's/SF_ACCOUNT/{your_snowflake_account}/g' ./unixodbc_setup.sh && ./unixodbc_setup.sh && aleph setup_minimal -t snowflake -S snowflake -U {user} -P {password} -L {snowflake_unload_target} -R {s3_region}  -B {s3_bucket} -F {s3_folder}; redis-server & aleph run_demo"
    `snowflake_unload_target` is the external stage and location in snowflake.  e.g. `@mydb.myschema.aleph_stage/results/`

###### Open in browser

      open http://$(docker-machine ip):3000

### Gem Install

###### For Redshift
You must be using [PostgreSQL 9.2beta3 or later client libraries](https://kkob.us/2014/12/20/homebrew-and-postgresql-9-4/)

###### For Snowflake
You must install `unixodbc-dev` and setup and configure [snowflake ODBC](https://docs.snowflake.net/manuals/user-guide/odbc.html).  e.g.

    apt-get update && apt-get install -y unixodbc-dev
    curl -o /tmp/snowflake_linux_x8664_odbc-2.19.8.tgz https://sfc-repo.snowflakecomputing.com/odbc/linux/latest/snowflake_linux_x8664_odbc-2.19.8.tgz && cd /tmp && gunzip snowflake_linux_x8664_odbc-2.19.8.tgz && tar -xvf snowflake_linux_x8664_odbc-2.19.8.tar && cp -r snowflake_odbc /usr/bin && rm -r /tmp/snowflake_odbc
    cd /usr/bin/snowflake_odbc 
    ./unixodbc_setup.sh  # and following the instructions to setup Snowflake DSN

###### Install and run Redis

    brew install redis  && redis-server &

###### Install gem

    gem install aleph_analytics

###### Configure your database
See [Database Configuration](#database-configuration) above

###### Run Aleph
* For Redshift

      aleph setup_minimal -H {host} -D {db} -p {port} -U {user} -P {password}
      aleph run_demo

* For Snowflake
      
      export AWS_ACCESS_KEY_ID="{aws key id}"
      export AWS_SECRET_ACCESS_KEY="{aws secret key}"
      aleph setup_minimal -t snowflake -S snowflake -U {user} -P {password} -L {snowflake_unload_target} -R {s3_region}  -B {s3_bucket} -F {s3_folder}
      aleph run_demo
      
Aleph should be running at `localhost:3000`

## Aleph Gem
Aleph is packaged as a [Rubygem](https://rubygems.org/gems/aleph_analytics).

To list gem executables, just type `aleph --help`

Find out more about the gem executables [here](docs/GEM_EXECUTABLES.md).
## Installation

### Dependencies
For a proper production installation, Aleph needs an external Redis instance and operational database. The locations of these services can be configured using [environment variables](docs/ENVIRONMENT_VARIABLES.md). More detailed instructions on configuration can be found [here](docs/ADVANCED_CONFIGURATION.md). Example configurations can be found [here](config/example).

### The app
There are a number of ways to install and deploy Aleph. The simplest is to set up a Dockerfile that installs aleph as a gem:

    FROM ruby:2.2.4

    # we need postgres client libs for Redshift
    RUN apt-get update && apt-get install -y postgresql-client --no-install-recommends && rm -rf /var/lib/apt/lists/*

    # for Snowflake, install unix odbc and Snowflake ODBC driver and setup DSN
    # replace {your snowflake account} below
    RUN apt-get update && apt-get install -y unixodbc-dev
    RUN curl -o /tmp/snowflake_linux_x8664_odbc-2.19.8.tgz https://sfc-repo.snowflakecomputing.com/odbc/linux/latest/snowflake_linux_x8664_odbc-2.19.8.tgz && cd /tmp && gunzip snowflake_linux_x8664_odbc-2.19.8.tgz && tar -xvf snowflake_linux_x8664_odbc-2.19.8.tar && cp -r snowflake_odbc /usr/bin && rm -r /tmp/snowflake_odbc
    RUN cd /usr/bin/snowflake_odbc && sed -i 's/SF_ACCOUNT/{your snowflake account}/g' ./unixodbc_setup.sh && ./unixodbc_setup.sh
    
    # make a log location
    RUN mkdir -p /var/log/aleph
    ENV SERVER_LOG_ROOT /var/log/aleph

    # make /tmp writeable
    RUN chmod 777 /tmp

    # bundle install inside the aleph gem
    RUN gem install aleph_analytics

    # copy our aleph configuration over to the image
    ENV ALEPH_CONFIG_PATH /etc/aleph/
    COPY aleph_config/. /etc/aleph/.

    # install the aleph dependencies
    RUN aleph deps


You can then deploy and run the main components of Aleph as separate services using the gem executables:

- web_server - `aleph web_server --worker-process 2`
- query workers - `aleph workers`  
- clock (used to trigger alerts) - `aleph clock`  

At runtime, you can inject all the secrets as environment variables.

S3 is required for Snowflake.

We *highly* recommend that you have a git repo for your queries and S3 location for you results.

Advanced setup and configuration details (including how to use Aleph roles for data access, using different auth providers, creating users, and more) can be found [here](docs/ADVANCED_CONFIGURATION.md).

## Limitation
The default maximum result size from Snowflake queries is 5 GB.  This is due to the MAX_FILE_SIZE limit of [Snowflake copy command](https://docs.snowflake.net/manuals/sql-reference/sql/copy-into-location.html#copy-options-copyoptions).  If Snowflake has changed the limit, update the setting in [snowflake.yml](docs/ADVANCED_CONFIGURATION.md#snowflake)

## Contribute
Aleph is Rails on the backend, Angular on the front end. It uses Resque workers to run queries against Redshift. Here are few things you should have before developing:

* Redshift cluster
* Postgres and Redis installed
* Git Repo (for query versions)
* S3 Location (store results)

While the demo/playground version does not use a git repo and S3 is optional for Redshift, we *highly* recommend that you use them in general.

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

    export PATH="$PWD/node_modules/karma-cli/bin:$PATH"
    RAILS_ENV=test bundle exec rspec spec
    bundle exec rake karma:run

### Running

    bundle exec foreman start
You can manage your env variables in a .env file

## Links

- [Feature Notes](docs/FEATURES.md)
- [Development Notes](docs/DEVELOPMENT_NOTES.md)
- [Operational Notes](docs/OPERATIONAL_NOTES.md)
- [Rubygem](https://rubygems.org/gems/aleph_analytics)
- [aleph-user group](https://groups.google.com/forum/#!forum/aleph-user)


Unless otherwise noted, all Aleph source files are made available under the terms of the [MIT License](https://github.com/lumoslabs/aleph/blob/master/LICENSE)
