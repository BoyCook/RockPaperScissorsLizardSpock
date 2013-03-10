var spawn = require('child_process').spawn;
var server = require('./lib/server.js');
var db = require('fakeredis').createClient('testdb');
var spawns = {};

require('./test/spec/testdata.js').createTestData(db, function () {
    server.startUp({port: 3003}, function () {
//        var mocha = spawn('mocha', ['--reporter', 'xUnit', 'coverage.html']);
        createSpawn('jasmine-node', [ 'test/spec', '--junitreport', '--forceexit' ]);
        createSpawn('casperjs', [ 'test', 'test/ui' ]);
    });
});

function createSpawn(name, args) {
    spawns[name] = true;
    var spawned = spawn(name, args);
    spawned.stdout.on('data', logToConsole);
    spawned.stderr.on('data', logToConsole);
    spawned.on('exit', function (code) {
        spawns[name] = false;
        safeStop(code);
    });
}

// logs process stdout/stderr to the console
function logToConsole(data) {
    console.log(String(data));
}

// Hack - Shutdown when all processes are done
function safeStop(code) {
    var running = false;
    for (var key in spawns) {
        if (spawns[key] == true) {
            running = true;
        }
    }
    if (!running) {
        server.shutDown();
        process.exit(code);
    }
}
