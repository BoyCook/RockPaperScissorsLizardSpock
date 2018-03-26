var apm = require('elastic-apm-node').start({
    // Set required service name (allowed characters: a-z, A-Z, 0-9, -, _, and space)
    serviceName: 'Rock Paper Scissors Lizard Spock',
    // Use if APM Server requires a token
    secretToken: '',
    // Set custom APM Server URL (default: http://localhost:8200)
    serverUrl: 'http://localhost:8200'
})

require('./lib/server.js').startUp({ port: process.env.PORT || 3000 });
