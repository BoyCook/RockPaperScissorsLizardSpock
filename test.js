var spawn = require('child_process').spawn;
var server = require('./lib/server.js');
var db = require('fakeredis').createClient('testdb');
var fs = require('fs');
var spawns = {};
var output = 'reports/coverage.html';

require('./test/spec/testdata.js').createTestData(db, function () {
    if (fs.existsSync(output)) {
        fs.unlinkSync(output);
    }
    server.startUp({port: 3003}, function () {
//        createSpawn('mocha', ['--reporter', 'html-cov'], logToFile, logToConsole);
//        createSpawn('mocha', ['--reporter', 'xUnit']);
//        createSpawn('./node_modules/.bin/mocha', ['--reporter', 'html-cov']);
        createSpawn('jasmine-node', [ 'test/spec', '--junitreport', '--forceexit' ], logToConsole, logToConsole);
        createSpawn('casperjs', [ 'test', 'test/ui' ], logToConsole, logToConsole);
    });
});

function createSpawn(name, args, stdout, stderr) {
    spawns[name] = true;
    var spawned = spawn(name, args);
    spawned.stdout.on('data', stdout);
    spawned.stderr.on('data', stderr);
    spawned.on('exit', function (code) {
        spawns[name] = false;
        safeStop(code);
    });
}

// logs process stdout/stderr to the console
function logToFile(data) {
    fs.appendFileSync(output, data, function (err) {
        console.log('Error writing to file');
        if (err) throw err;
    });
}

function logToConsole(data) {
    console.log(String(data));
}

// Hack - Shutdown when all processes are done
function safeStop(code) {
    if (!isRunning()) {
        server.shutDown();
        console.log('Exit code [%d]', code);
        process.exit(code);
    }
}

function isRunning() {
    var running = false;
    for (var key in spawns) {
        if (spawns[key] == true) {
            running = true;
        }
    }
    return running;
}
