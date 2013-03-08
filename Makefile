
MOCHA_OPTS=
REPORTER = dot

check: test

test: test-unit

spec: test-spec

test-spec:
	node test.js

test-cov: lib-cov
	@RPSLP_COV=1 $(MAKE) test REPORTER=html-cov > coverage.html

lib-cov:
	@jscoverage lib lib-cov

benchmark:
	@./support/bench

clean:
	rm -f coverage.html
	rm -fr lib-cov

.PHONY: test test-unit test-acceptance benchmark clean
