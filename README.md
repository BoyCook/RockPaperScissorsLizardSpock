[![Build Status](http://craigcook.co.uk/build/job/Rock%20Paper%20Scissors%20Lizard%20Spock/badge/icon)](http://craigcook.co.uk/build/job/Rock%20Paper%20Scissors%20Lizard%20Spock/)

## Description
Rock Paper Scissors Lizard Spock webapp implemented in Node.JS http://rockpaperscissorslizardspock.co.uk

## Rules
* Scissors cuts paper
* Paper covers rock
* Rock crushes lizard
* Lizard poisons Spock
* Spock smashes scissors
* Scissors decapitates lizard
* Lizard eats paper
* Paper disproves Spock
* Spock vaporizes rock
* And as it always has, rock crushes scissors

## Getting started
To start the service use:

    node app.js

To get it running locally with fakeredis and some test data use:

    node serve.js

By default it will start in development mode. For production mode you need to set the node environment variable:

    export NODE_ENV=production

Production mode expects there to be a [redis](http://redis.io) server running

## Usage
You can use the app.sh script to stop start etc.
To start the service:

    ./app.sh start

To stop the service:

    ./app.sh stop

To start the redis DB:

    ./app.sh db

To tail the log:

    ./app.sh tail

## Tests

To run the complete set use:

    make test

To run just the unit spec use:

    jasmine-node test/spec/DuelerSpec.js

To run the CasperJS UI tests (requires PhantomJS and CasperJS to be installed):

    casperjs test test/ui

## Links

* http://craigcook.co.uk/build/job/Rock%20Paper%20Scissors%20Lizard%20Spock
* http://craigcook.co.uk/quality/dashboard/index/248
