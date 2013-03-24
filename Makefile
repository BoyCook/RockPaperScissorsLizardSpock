
TESTS = test/*.js
REPORTER = dot

check: test

test: test-unit

spec: test-spec

test:
	node test.js

ui-test:
	casperjs test test/ui

test-spec:
	jasmine-node test/spec --junitreport --forceexit

test-mocha:
	@NODE_ENV=test mocha \
	    --require should \
	    --timeout 200 \
		--reporter $(REPORTER) \
		$(TESTS)

test-cov: lib-cov
	@RPSLP_COV=1 $(MAKE) test

lib-cov:
	jscoverage lib lib-cov

test-covold: lib-cov
	@RPSLP_COV=1 $(MAKE) test-mocha REPORTER=html-cov > coverage.html

benchmark:
	@./support/bench

clean:
	rm -f reports/*
	rm -fr lib-cov

.PHONY: test test-unit test-acceptance benchmark clean
