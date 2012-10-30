/*
 User functions
 https://github.com/jaredhanson/passport-local/blob/master/examples/login/app.js
 https://github.com/mhevery/jasmine-node
 */
var redis = require('redis');
var db = redis.createClient(); //127.0.0.1:6379
var app = new RPSLS();

function RPSLS() {
}

RPSLS.prototype.getCombinedKey = function (user1, user2) {
    var users = [user1, user2];
    users.sort();
    return users[0] + ':' + users[1];
};

RPSLS.prototype.getChallengeKeys = function (fn) {
    db.smembers('challenges', function (err, keys) {
        return fn(keys);
    });
};

RPSLS.prototype.useSeq = function (fn) {
    db.incr('challenges-seq', function (err, val) {
        console.log('Using sequence val [%s]', val);
        return fn(val);
    });
};

RPSLS.prototype.getChallenge = function (key, fn) {
    db.hgetall(key, function (err, obj) {
        return fn(obj);
    });
};

RPSLS.prototype.getActiveChallengeForUsers = function (user1, user2, fn) {
    this.getChallengeKeys(function(keys){
        if (keys != null && keys.length > 0) {
            for (var i = 0; i < keys.length; i++) {
                db.hgetall(keys[i], function(err, obj){
                    if (obj['challenger-move'] != null && obj['challengee-move']) {
                        console.log('Found an active challenge between [%s] and [%s]', user1, user2);
                        return fn(obj);
                    }
                });
            }
        }
        return fn(null);
    });
};

RPSLS.prototype.getActiveChallenges = function (user, fn) {
    var challenges = new Array();
    db.smembers(user + ':challenges', function (err, keys) {
        if (keys != null && keys.length > 0) {
            for (var i = 0; i < keys.length; i++) {
                db.hgetall(keys[i], function(err, obj){
                    if (obj['challenger-move'] != null && obj['challengee-move']) {
                        challenges.push(obj);
                    }
                    if (i == keys.length) {
                        console.log('Found [%d] challenges for [%s]', challenges.length, user);
                        fn(challenges)
                    }
                });
            }
        } else {
            fn(null);
        }
    });
};

RPSLS.prototype.makeMove = function (user, challengee, move) {
    var key = this.getCombinedKey(user, challengee);
    db.hmset(key, user, move);
};

RPSLS.prototype.getMove = function (user, challengee, fn) {
    var key = this.getCombinedKey(user, challengee);
    db.hgetall(key, function (err, obj) {
        return fn(null, obj);
    });
};

exports.makeMove = function (req, res) {
    var key = req.params.key;
    var user = req.params.user;
    var move = req.params.move;
    console.log('User [%s] made move [%s] for challenge [%s]', user, move, key);
    //TODO update users move for challenge
//    (new RPSLS()).makeMove(user, challengee, move);
    res.send('Move submitted');
};

exports.getChallenge = function (req, res) {
    app.getChallenge(req.params.key, function(data){
       res.send(data);
    });
};

exports.getChallenges = function (req, res) {
    var user = req.params.name;
    console.log('Getting challenges against [%s]', user);
    app.getActiveChallenges(user, function(data){
        res.send(data);
    });
};

exports.allChallengeKeys = function (req, res) {
    app.getChallengeKeys(function(data){
        res.send(data);
    });
};

exports.challenge = function (req, res) {
    var user = req.params.name;
    var challengee = req.params.challengee;

    console.log('[%s] challenges [%s]', user, challengee);

    app.getActiveChallengeForUsers(user, challengee, function (obj) {
        //Check for existing challenge - return 409 conflict
        if (obj != null) {
            res.statusCode = 409;
            res.send({message: 'A challenge has already been made'})
        } else {
            app.useSeq(function(val){
                var key = app.getCombinedKey(user, challengee) + val;
                console.log('Adding challenge [%s]', key);
                db.sadd('challenges', key);
                db.sadd(challengee + ':challenges', key);
                db.hmset(key,
                    'key', key,
                    'challenger', user,
                    'challenger-move', null,
                    'challengee', challengee,
                    'challengee-move', null, function(){
                        res.send('Added');
                    });
            });
        }
    });
};
