#!/bin/sh

export NODE_ENV=testing
jasmine-node test/spec/ServiceSpec.js --junitreport --forceexit
