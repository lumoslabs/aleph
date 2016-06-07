#!/bin/sh

# start up the redis server
redis-server &
exec "$@"
