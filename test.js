var spawn = require('child_process').spawn;
var server = require('./lib/server.js');
var db = require('fakeredis').createClient('testdb');

require('./test/spec/testdata.js').createTestData(db, function () {
    // starts the server
    server.startUp({port: 3003}, function () {
        // on server ready launch the jasmine-node process with your test file

        var jasmineNode = spawn('jasmine-node', [ 'test/spec', '--junitreport', '--forceexit' ]);

        // logs process stdout/stderr to the console
        function logToConsole(data) {
            console.log(String(data));
        }

        jasmineNode.stdout.on('data', logToConsole);
        jasmineNode.stderr.on('data', logToConsole);
        jasmineNode.on('exit', function (code) {
            server.shutDown();
            process.exit(code);
        });
    });
});
