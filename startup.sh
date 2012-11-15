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
	#export NODE_ENV=production
	nohup node server.js | tee  server.log &
elif [ "$ACTION" == "STOP" ] || [ "$ACTION" == "stop" ]
then
    echo 'Stopping service...'
    pkill node
elif [ "$ACTION" == "TAIL" ] || [ "$ACTION" == "tail" ]
then
    echo 'Tailing service...'
    tail -f server.log
else
	echo "Unknown action ($ACTION) - Doing nothing"
fi
