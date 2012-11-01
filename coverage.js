require('jasmine-node');
require('jscoverage-reporter');
var jasmineEnv = jasmine.getEnv();
// Adjust output directory as needed
jasmineEnv.addReporter(new jasmine.JSCoverageReporter('./reports'));
require('./node_modules/jasmine-node/lib/jasmine-node/cli.js');
