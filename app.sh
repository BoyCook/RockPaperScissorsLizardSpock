#!/bin/sh
# This deals with starting and stopping node.js service
# Options: start
#                  stop
#                  restart

function die() {
     echo $*
     exit 1
}

if [ $# -ne 1 ]
then
    die "$0 Specify action"
fi

ACTION=$1

if [ "$ACTION" == "START" ] || [ "$ACTION" == "start" ] 
then
	echo 'Starting service...'
	ulimit -n 5000
	export NODE_ENV=production
	nohup node app.js 1> webserver.log &
elif [ "$ACTION" == "STOP" ] || [ "$ACTION" == "stop" ]
then
    echo 'Stopping service...'
    pkill node
elif [ "$ACTION" == "DBSTART" ] || [ "$ACTION" == "dbstart" ]
then
    echo 'Starting DB...'
    nohup $REDIS_HOME/src/redis-server | tee redis.log &
elif [ "$ACTION" == "DBSTOP" ] || [ "$ACTION" == "dbstop" ]
then
    echo 'Stopping DB...'
	killall redis-server
elif [ "$ACTION" == "STATUS" ] || [ "$ACTION" == "status" ]
then
	echo 'Listing node processes...'
    ps -ef | grep node
elif [ "$ACTION" == "TAIL" ] || [ "$ACTION" == "tail" ]
then
    echo 'Tailing service...'
    tail -f webserver.log
else
	echo "Unknown action ($ACTION) - Doing nothing"
fi
