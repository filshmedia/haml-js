REPORTER = spec

test:
	@./node_modules/.bin/mocha \
		--require should \
		--reporter $(REPORTER) \
		test/*.test.js

.PHONY: all test
