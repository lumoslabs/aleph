# Feature Description and Usage Notes

## User Features

More on this later!

## Admin Features

The following are features for Admin users. Most of these deal with app maintenance and setup.

#### Inflight Queries
![inflight](images/inflight.png)

This tab contains a list of currently running queries allowing admins to monitor Aleph's usage on the Redshift cluster. It includes saved queries as well as unsaved queries run in the REPL.

This tab surfaces who is running the query as well as giving a link back to the original query (except REPL queries). Clicking on the clipboard icon will copy formatted sql to your clipboard.

The list is searchable and sortable.

Only `admin` users will see an Inflight tab.

#### Schema Filters

These are site wide, saved filters to hide schema information by schema or table. Supports both black and white list style filter based on regex. This is useful if you have some "operational" tables in Redshift that you do not want to expose to end users.

See [example here](../config/example/table_blacklist.yml)
