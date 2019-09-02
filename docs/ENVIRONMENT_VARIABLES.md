These are the environment variables can be included to configure Aleph:

```bash
# location of configurations
ALEPH_CONFIG_PATH=/etc/aleph

# redis location
REDIS_URL=redis://myredis.com:6379

# creds for aleph operational database
ALEPH_DB_HOST=some-host.us-east-1.rds.amazonaws.com
ALEPH_DB_PASSWORD=fakepassword
ALEPH_DB_USERNAME=someusername
ALEPH_DB_DATABASE=database_name

# database type: redshift or snowflake.  Default is redshift
ANALYTIC_DB_TYPE=redshift

# configurations for specific redshift users that correspond to roles
# you may create as many of these as you like
# using the format <role>_REDSHIFT_USERNAME and <role>_REDSHIFT_PASSWORD
ADMIN_REDSHIFT_USERNAME=some_user1
ADMIN_REDSHIFT_PASSWORD=some_password1
GENERAL_REDSHIFT_USERNAME=some_user4
GENERAL_REDSHIFT_PASSWORD=some_password4

# configurations for specific snowflake users that correspond to roles
# you may create as many of these as you like
# using the format <role>_SNOWFLAKE_USERNAME and <role>_SNOWFLAKE_PASSWORD
ADMIN_SNOWFLAKE_USERNAME=some_user1
ADMIN_SNOWFLAKE_PASSWORD=some_password1
GENERAL_SNOWFLAKE_USERNAME=some_user4
GENERAL_SNOWFLAKE_PASSWORD=some_password4

# number of workers for query and alert execution (you can throttle use of your cluster this way)
ALEPH_QUERY_EXEC_WORKER_POOL=8
ALEPH_ALERT_EXEC_WORKER_POOL=1

# access to AWS for s3 results
AWS_ACCESS_KEY_ID=somekey
AWS_SECRET_ACCESS_KEY=somesecret

# github access for query version history
GITHUB_APPLICATION_CLIENT_ID=someclientid
GITHUB_APPLICATION_CLIENT_SECRET=somesecret
GITHUB_APPLICATION_URL=https://github.com/organizations/yourcompany/settings/applications/00000
GITHUB_APPLICATION_ACCESS_TOKEN=sometoken
GITHUB_USER_EMAIL=analytics-team@yourcompany.com
GITHUB_USER_NAME=someuser
GITHUB_USER_PASSWORD=somepass

# error reporting
ROLLBAR_SERVER_KEY=somekey
ROLLBAR_CLIENT_KEY=somekey

# resque web config for monitoring queues
RESQUE_WEB_HTTP_BASIC_AUTH_USER=someuser
RESQUE_WEB_HTTP_BASIC_AUTH_PASSWORD=somepass

# mailer setup
SMTP_PASSWORD=somepass

# cookie secret setup
SECRET_KEY_BASE=something

# SAML auth config
SAML_IDP_CERT="-----BEGIN CERTIFICATE-----\nSOMESTUFF\n-----END CERTIFICATE-----"
SAML_METADATA_URL=https://metadata.com/something
SAML_SSO_TARGET=https://signout.com/something
```
