# Advanced Configuration
Configuration examples can be found in the example [config directory](../config/example). The directory for your configurations is specified by the [environment variable](ENVIRONMENT_VARIABLES.md) `ALEPH_CONFIG_PATH`. If this is not set, Aleph will try to find them in `/tmp/aleph/configuration` by default.

## Redshift
This configures your connection to Redshift. It only holds information about the *host*, *database*, and *port*. *Username* and *password* are stored as [environment variables](ENVIRONMENT_VARIABLES.md) on a per role bases (see more about roles below). As you can imagine, this configuration is mandatory.

*File* - [redshift.yml](../config/example/redshift.yml)

*Properties*
- Rails env
  - host
  - database
  - port
  - statement_timeout


`statement_timeout` is in milliseconds. This is field optional.
[Read more](http://docs.aws.amazon.com/redshift/latest/dg/r_statement_timeout.html)

## Github
Connection details to git are in [environment variables](ENVIRONMENT_VARIABLES.md). This only configures which branch your query versions are maintained on. Configuring Github is optional but highly recommended.

*File* - [config.yml](../config/example/config.yml)

*Properties*
- Rails env
  - github_ref - `heads/{branch_name}`

## S3
Connection credentials for s3 are in [environment variables](ENVIRONMENT_VARIABLES.md) (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`). This configures the location in s3 where your results will be stored. Configuring s3 is optional but highly recommended.

*File* - [config.yml](../config/example/config.yml)

*Properties*
- Rails env
  - s3_bucket - `s3://your-org-name`
  - s3_folder - `aleph-results`

## Role
Access control on the query and table level is determined via Roles. For example, a query with role *Admin* will be only visible to an *Admin* user. Queries can multiple roles.

Additionally, roles  specify a Redshift connection; there is username/password pair per role. E.g, for role *Admin* you will have to specify `ADMIN_REDSHIFT_USERNAME` and `ADMIN_REDSHIFT_PASSWORD` in the [environment variables](ENVIRONMENT_VARIABLES.md).

### Role Hierarchy
You can define the hierarchy of your roles which determine roles maybe autofilled. In this [example](../config/example/role_hierarchy.yml), *General* is set as one of the child roles of *Admin*. This means that whenever *General* is set on a query, *Admin* will be as well, ensuring that queries made by *General* will be visible to *Admin*.

This configuration is optional.

*File* - [role_hierarchy.yml](../config/example/role_hierarchy.yml)

*Properties*
- role
  - list of child roles
- role 2
  - list of child roles

  `...`
- role N
  - list of child roles

## Authorization
There are three types of authorization, `saml`, `database`, and `disabled`.

- saml - this means you have your own
identity service provider (IDP). E.g Okta
- database - this means you will use [RailsAdmin](https://github.com/sferik/rails_admin) to administer user authorization
- disabled - this means anyone can log in as a Guest with role Admin. Use this for development settings ONLY.

*File* - [config.yml](../config/example/role_hierarchy.yml)

*Properties*
- auth_type (`saml`/`database`/`disabled`)

#### Database (RailsAdmin) Authorization
One quirk: you need to have auth_type set to `disabled` to create the first user with role *admin*. Then you can change to `database` and use that first user to create other users and roles.

#### SAML Authorization
If you are using SAML authorization you can specify additional configuration file `auth-attribute-map.yml`.

This file used for ingesting IDP provided user attributes into the user record; the most important of these is `role`.

Additionally, you need to configure `saml_issuer`, and `saml_name_identifier_format` in [config.yml](../config/example/config.yml) and have the `SAML_IDP_CERT`, `SAML_METADATA_URL`, and `SAML_SSO_TARGET` env variables set.

## Emails
You can configure Aleph to email recipients about the status of Alerts or scheduled queries. To do this you have to supply `smtp_settings` and a `default_url_host`. You will also need to set the `SMTP_PASSWORD` environment variable.

This configurational is optional but important if you want to get the most out of Alerts. The below example file provides a pretty good guide.

*File* - [email.yml](../config/example/email.yml)
