/*
 User functions
 https://github.com/jaredhanson/passport-local/blob/master/examples/login/app.js
 https://github.com/mhevery/jasmine-node
 */
var redis = require('redis');
var db = redis.createClient(); //127.0.0.1:6379

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
    var context = this;
    this.getChallengeKeys(function(keys){
        if (keys != null && keys.length > 0) {
            console.log('Found [%d] existing challenges', keys.length);
            for (var i = 0; i < keys.length; i++) {
                db.hgetall(keys[i], function(err, obj){
                    if (obj['challenger-move'] != null && obj['challengee-move']) {
                        console.log('Found an active challenge');
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
            console.log('Found [%d] existing challenges', keys.length);
            for (var i = 0; i < keys.length; i++) {
                db.hgetall(keys[i], function(err, obj){
                    if (obj['challenger-move'] != null && obj['challengee-move']) {
                        console.log('Found an active challenge');
                        challenges.push(obj);
                    }
                    if (i == keys.length) {
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
    var id = req.params.id;
    var user = req.params.name;
    var move = req.params.move;
    console.log('User [%s] make move [%s] for challenge [%s]', user, move, id);
    //TODO update users move for challenge
//    (new RPSLS()).makeMove(user, challengee, move);
//    res.send('Challenge submitted');
};

exports.getChallenge = function (req, res) {
    var id = req.params.id;
    //TODO get challenge by ID
//    (new RPSLS()).getMove(user, challengee, function(err, obj){
//        res.send(obj);
//    });
};

exports.getChallenges = function (req, res) {
    var user = req.params.name;
    var app = new RPSLS();
    console.log('Getting challenges against [%s]', user);
    app.getActiveChallenges(user, function(data){
        console.log('Sending data [%s]', data != undefined ? data.length : 0);
        res.send(data);
    });
};

exports.challenge = function (req, res) {
    var app = new RPSLS();
    var user = req.params.name;
    var challengee = req.params.challengee;

    console.log('[%s] has challenged [%s]', user, challengee);

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
