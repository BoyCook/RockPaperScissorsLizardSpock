#!/bin/sh

REDIS_HOME=/usr/share/redis
$REDIS_HOME/src/redis-server &
node server.js &
jasmine-node test/spec --junitreport

$REDIS_HOME/src/redis-cli SHUTDOWN
