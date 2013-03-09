var spawn = require('child_process').spawn;
var server = require('./lib/server.js');
var db = require('fakeredis').createClient('testdb');

require('./test/spec/testdata.js').createTestData(db, function () {
    // starts the server
    server.startUp({port: 3003}, function () {
        // on server ready launch the jasmine-node process with your test file
        var jasmineRunning = true;
        var casperRunning = true;
        var jasmineNode = spawn('jasmine-node', [ 'test/spec', '--junitreport', '--forceexit' ]);
        var casper = spawn('casperjs', [ 'test', 'test/ui' ]);

        // logs process stdout/stderr to the console
        function logToConsole(data) {
            console.log(String(data));
        }

        // Hack - Shutdown when all processes are done
        function safeStop(code) {
            if (!jasmineRunning && !casperRunning) {
                server.shutDown();
                process.exit(code);
            }
        }

        jasmineNode.stdout.on('data', logToConsole);
        jasmineNode.stderr.on('data', logToConsole);
        casper.stdout.on('data', logToConsole);
        casper.stderr.on('data', logToConsole);
        jasmineNode.on('exit', function (code) {
            jasmineRunning = false
            safeStop(code);
        });

        casper.on('exit', function (code) {
            casperRunning = false
            safeStop(code);
        });
    });
});
