
TESTS = test/spec
REPORTER = xUnit

test: test-mocha

spec: test-spec

test-spec:
	jasmine-node test/spec/ObjectUtilsSpec.js --junitreport --verbose --captureExceptions --forceexit

ui-test:
	casperjs test test/ui

test-mocha:
	@NODE_ENV=test mocha \
	    --timeout 200 \
		--reporter $(REPORTER) \
		$(TESTS) > reports/TEST-all.xml

test-cov: lib-cov
	@RPSLP_COV=1 $(MAKE) test

lib-cov:
	jscoverage lib lib-cov

clean:
	rm -f reports/*
	rm -fr lib-cov
