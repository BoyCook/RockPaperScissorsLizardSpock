/*
    User functions
    https://github.com/jaredhanson/passport-local/blob/master/examples/login/app.js
 */

var redis = require('redis');
var db = redis.createClient(); //127.0.0.1:6379

function findByUsername(username, fn) {
    db.hget(username, 'user', function(err, obj) {
        if (obj == undefined) {
            return fn(null, false);
        }
        var user = JSON.parse(obj);
        console.log('Found user [%s]', user.username);
        return fn(null, user);
    });
}

function addUserAsJSON(user) {
    //TODO: validate uniqueness etc
    console.log('Adding user [' + user.username + ']');
    db.sadd('usernames', user.username);
    db.hmset(user.username, 'user', JSON.stringify(user));
}

function addUserAsHSet(user) {
    //TODO: validate uniqueness etc
    console.log('Adding user [' + user.username + ']');
    db.sadd('users', user.username);
    db.hmset(user.username, 'username',
        user.username, 'firstname',
        user.firstName, 'lastname',
        user.lastName, 'email',
        user.email, 'password',
        user.password);
}

exports.authenticate = function(username, password, done) {
    // asynchronous verification, for effect...
    console.log('Trying to authenticate [%s]', username);
    process.nextTick(function () {
        findByUsername(username, function(err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
            if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
            return done(null, user);
        })
    });
};

exports.authenticateSuccess = function(req, res) {
    res.send(req.user);
};

exports.get = function(req, res){
    findByUsername(req.params.name, function(err, user) {
        res.send(user);
    });
};

exports.session = function(req, res){
    var user = req.user;
    if (req.user == undefined) {
        res.statusCode = 404;
    }
    res.send({ user: user });
};

exports.serializeUser = function(user, done) {
    done(null, user.username);
};

exports.deserializeUser = function(id, done) {
    findByUsername(id, function (err, user) {
        done(err, user);
    });
};

exports.list = function (req, res) {
    //Get users from DB
    db.smembers('usernames', function (err, obj) {
        console.log('Listing all users');
        res.send(obj);
    });
};

exports.challenge = function(req, res){
    var user = req.params.name;
    var challenges = req.params.challenges;
    console.log('User [' + user + '] challenges [' + challenger + ']');
    //Add the challenge
};

exports.listChallenges = function(req, res){
    var user = req.params.name;
    //Get users challenges
};

exports.makeMove = function(req, res){
    var user = req.params.name;
    var challenges = req.params.challenges;
    var move = req.params.move;
    //Play the other user
};

exports.signUp = function(req,res) {
    var user = req.body;
    addUserAsJSON(user);
    res.send(user);
};

exports.logout = function(req, res){
    req.logOut();
    res.redirect('/');
};
