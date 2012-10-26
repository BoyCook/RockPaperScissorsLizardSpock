/*
    User functions
 */

var redis = require('redis');
var db = redis.createClient(); //127.0.0.1:6379

var users = [
    { id: 1, username: 'bob', password: 'secret', email: 'bob@example.com' }
    , { id: 2, username: 'joe', password: 'birthday', email: 'joe@example.com' }
];

function findById(id, fn) {
    var idx = id - 1;
    if (users[idx]) {
        fn(null, users[idx]);
    } else {
        fn(new Error('User ' + id + ' does not exist'));
    }
}

function findByUsername(username, fn) {
    for (var i = 0, len = users.length; i < len; i++) {
        var user = users[i];
        if (user.username === username) {
            return fn(null, user);
        }
    }
    return fn(null, null);
}

//https://github.com/jaredhanson/passport-local/blob/master/examples/login/app.js
//https://github.com/jaredhanson/passport-local/blob/master/examples/login/app.js

exports.authenticate = function(username, password, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

        // Find the user by username.  If there is no user with the given
        // username, or the password is not correct, set the user to `false` to
        // indicate failure and set a flash message.  Otherwise, return the
        // authenticated `user`.
        findByUsername(username, function(err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
            if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
            return done(null, user);
        })
    });
};

exports.serializeUser = function(user, done) {
    done(null, user.id);
}

exports.deserializeUser = function(id, done) {
    findById(id, function (err, user) {
        done(err, user);
    });
};

exports.add = function (req, res) {
    var user = req.params.name;
    //Add the user
    var cnt = db.sadd('users', user);
    console.log('Adding user [' + user + '] number [' + cnt + ']');
    res.send(user);
};

exports.list = function (req, res) {
    //Get users from DB
    db.smembers('users', function (err, obj) {
        console.log('Users [' + obj + ']');
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

exports.signUp = function(req,res){
    res.redirect('/');
};

exports.logout = function(req, res){
    req.logOut();
    res.redirect('/');
};
