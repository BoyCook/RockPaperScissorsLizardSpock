#!/bin/sh

export NODE_ENV=testing
#jasmine-node coverage.js test/spec --junitreport --forceexit

node coverage.js test/spec --junitreport --forceexit
