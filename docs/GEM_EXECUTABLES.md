# GEM Executables

Aleph's gem executables expose functionality to setup, configure, and run the application.

## General
##### Help
This will list available executables and options

    aleph --help

## Quickstart
##### Setup Minimal
Configure and setup a minimal Aleph with either Redshift or Snowflake connection.

* Redshift

      aleph setup_minimal -H HOST -D DB -p PORT -U USER -P PASSWORD

    All options are mandatory

* Snowflake

  [Setup ODBC](../README.md#for-snowflake) and run

      export AWS_ACCESS_KEY_ID="{aws key id}"
      export AWS_SECRET_ACCESS_KEY="{aws secret key}"
      aleph setup_minimal -t snowflake -S DSN -U USER -P PASSWORD -L UNLOAD_TARGET -R S3_REGION -B S3_BUCKET -F S3_FOLDER
            
    All options are mandatory


##### Run Demo
Runs your minimal Aleph

    aleph run_demo

## Setup

##### Dependencies
This will setup dependencies by calling `bundle install` inside the gem.

    aleph deps

##### Import environment variables
This will import a yaml file called `env.yml` in your `-c CONFIG_PATH` directory as environment variables. Example [here](../config/examples/env.yml).

This is useful if you prefer to keep your secrets in a configuration file instead of dealing with environment variables. 

    aleph import_env_variables -c CONFIG_PATH -r RAILS_ENV

- `CONFIG_PATH` is mandatory
- `RAILS_ENV` will default to `development`.

## Database

##### Init Db
Create the database by calling `rake db:create`.

    aleph init_db -r RAILS_ENV

 - `RAILS_ENV` will default to `development`.

##### Init Db
Update the database by calling `rake db:migrate`.

    aleph init_db -r RAILS_ENV

 - `RAILS_ENV` will default to `development`.

## Run
Aleph has 3 major components that can be run in separate services.

##### Web Server
Run the web server. In production we run with 2 web processes.

     aleph web_server -r RAILS_ENV -w WEB_PROCESSES

- `RAILS_ENV` will default to `development`.
- `WEB_PROCESSES` will default to 1.


##### Worker
Start Resque workers. These workers are responsible for running queries against your Redsihft query.

     aleph worker -r RAILS_ENV

- `RAILS_ENV` will default to `development`.


##### Clock
Start the clock. This is responsible for firing out Alerts once a day.

     aleph clock -r RAILS_ENV

- `RAILS_ENV` will default to `development`.
