#!/bin/sh

export NODE_ENV=testing
jasmine-node test/spec --junitreport --forceexit
