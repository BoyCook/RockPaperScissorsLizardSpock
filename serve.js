var db = require('fakeredis').createClient('testdb');

var server = require('./lib/server.js').startUp({port: 3003}, function() {
    require('./test/spec/testdata').createTestData(db);
});
