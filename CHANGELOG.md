Change Log
==========

All notable changes to this project will be documented in this file using [Semantic Versioning](http://semver.org/).

## [0.4.9] - 2021-06-15
### Fixed
- Move Github access_token from query params to header params

## [0.4.8] - 2020-01-20
### Fixed
- [Fix issue with thread refresh_schema](https://github.com/lumoslabs/aleph/issues/103)

## [0.4.7] - 2020-01-17
### Fixed
- Fix issue with schema cache
- Fix style for schemas page

## [0.4.5] - 2020-01-15
### Fixed
- Fix style for schemas page

## [0.4.4] - 2019-12-13
### Removed
- Remove hard-coded STDOUT and STDERR log redirection by environment so that the user can decide where they want this to go.

## [0.4.3] - 2019-12-04
### Fixed
- Fix connection reset for Snowflake
- Fix data types for Snowflake (use data_type instead of udt_name)

## [0.4.2] - 2019-09-25
### Fixed
- [Error when Snowflake query returns empty result set](https://github.com/lumoslabs/aleph/issues/91)

## [0.4.1] - 2019-09-10
### Fixed
- [Bug fixes for v0.4.0](https://github.com/lumoslabs/aleph/pull/89)

## [0.4.0] - 2019-09-02
### Features
- Added support for Snowflake

## [0.3.0] - 2019-02-26
### Features
- [Scheduled Query Execution](https://github.com/lumoslabs/aleph/issues/42)
- Fixed s3 location for latest result (useful for GoogleSheet integration)

### Fixed
- Fix roles and tag dirty aware comparators on the Query model

## [0.2.0] - 2017-09-12
### Features
- [Surface Running Queries](https://github.com/lumoslabs/aleph/issues/45)
- [Site wide, saved filter for schema](https://github.com/lumoslabs/aleph/issues/38)

### Fixed
- [Use trusty for travis](https://github.com/lumoslabs/aleph/issues/67)
- [Display 24-hour format](https://github.com/lumoslabs/aleph/issues/53)
- [Schema search should be able to handle numbers](https://github.com/lumoslabs/aleph/issues/59)
- [Clean up /tmp result files when query fails](https://github.com/lumoslabs/aleph/issues/37)
- [Increase schema query reties](https://github.com/lumoslabs/aleph/issues/64)

## [0.1.0] - 2017-04-27
### Features
- [Auto-complete on dot](https://github.com/lumoslabs/aleph/issues/48)auser
### Fixed
- [change retry configuration for schema query](https://github.com/lumoslabs/aleph/issues/46)

## [0.0.6] - 2016-12-21
### Features
- [Clone query](https://github.com/lumoslabs/aleph/issues/27)

### Fixed
- [AWS region configurable](https://github.com/lumoslabs/aleph/issues/32)
- [Search issues on the schema page](https://github.com/lumoslabs/aleph/issues/24)
- [Query REPL minor UI issue](https://github.com/lumoslabs/aleph/issues/22)

## [0.0.5] - 2016-09-26
### Features
- [Link to specific result / single result page](https://github.com/lumoslabs/aleph/issues/12)
- [Use shift enter as hotkey to run queries in REPL](https://github.com/lumoslabs/aleph/issues/16)

### Fixed
- [Alerts searching bug](https://github.com/lumoslabs/aleph/issues/15)
- [Alerts sorting bug](https://github.com/lumoslabs/aleph/issues/13)
- [Query saving after REPL closes issue](https://github.com/lumoslabs/aleph/issues/14)

## [0.0.4] - 2016-07-12
### Fixed
- Saving QueryRoles bug
- Streamline sign out page
