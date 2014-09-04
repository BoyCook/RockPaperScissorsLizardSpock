[![Build Status](https://travis-ci.org/BoyCook/ObjectUtilsJS.png?branch=master)](https://travis-ci.org/BoyCook/ObjectUtilsJS)
[![Coverage Status](https://coveralls.io/repos/BoyCook/ObjectUtilsJS/badge.png)](https://coveralls.io/r/BoyCook/ObjectUtilsJS)
[![Dependency Status](https://gemnasium.com/BoyCook/ObjectUtilsJS.png)](https://gemnasium.com/BoyCook/ObjectUtilsJS)

[![NPM](https://nodei.co/npm/object-utils.png?downloads=true)](https://nodei.co/npm/object-utils) 

## Description

Object utility functions in JavaScript for node.js

## Usage

	var Object = require('objectutils');
	Object.isDefined({});
	Object.isUndefined({});
	Object.isNotEmpty([]);
	Object.isEmpty([]);

## Including in node.js app

You can include the module from GitHub directly by adding the following to your `package.json` and then doing `npm install`

    "dependencies": {
        "object-utils": "https://github.com/BoyCook/ObjectUtilsJS/tarball/master"
    }

## Building
* `make test` runs the tests
* `make test-cov` runs the tests with coverage
