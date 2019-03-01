# Change Log
All notable changes to this project will be documented in this file using [Semantic Versioning](http://semver.org/).

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
- [Auto-complete on dot](https://github.com/lumoslabs/aleph/issues/48)

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
