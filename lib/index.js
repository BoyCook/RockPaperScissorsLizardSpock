exports.localauth = process.env.RPSLP_COV ? require('./lib-cov/local-auth') : require('./local-auth');
exports.rpslsapp = process.env.RPSLP_COV ? require('./lib-cov/rpsls-app') : require('./rpsls-app');
exports.users = process.env.RPSLP_COV ? require('./lib-cov/users') : require('./users');
