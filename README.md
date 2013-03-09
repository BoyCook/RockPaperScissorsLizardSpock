[![Build Status](http://craigcook.co.uk/build/job/Rock%20Paper%20Scissors%20Lizard%20Spock/badge/icon)](http://craigcook.co.uk/build/job/Rock%20Paper%20Scissors%20Lizard%20Spock/)

http://rockpaperscissorslizardspock.co.uk

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

## Usage

To get it running locally with fakeredis use:

    node serve.js

## Unit tests

To run the complete set use:

    make spec

To run just the unit spec use:

    jasmine-node test/spec/DuelerSpec.js
