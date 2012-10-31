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

RPSLS.prototype.useSeq = function (fn) {
    db.incr('challenges-seq', function (err, val) {
        console.log('Using sequence val [%s]', val);
        return fn(val);
    });
};

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

RPSLS.prototype.addChallenge = function (user, challengee, err, fn) {
    console.log('[%s] challenges [%s]', user, challengee);

    app.getActiveChallengeForUsers(user, challengee, function (obj) {
        //Check for existing challenge - return 409 conflict
        if (obj != null) {
            err()
        } else {
            app.useSeq(function (val) {
                var key = app.getCombinedKey(user, challengee) + val;
                console.log('Adding challenge [%s]', key);
                db.sadd('challenges', key);
                db.sadd(challengee + ':challenges', key);
                db.sadd(user + ':challenges', key);
                db.hmset(key,
                    'key', key,
                    'challenger', user,
                    user, null,
                    'challengee', challengee,
                    challengee, null, fn);
            });
        }
    });
};

RPSLS.prototype.getChallenge = function (key, fn) {
    db.hgetall(key, function (err, obj) {
        return fn(obj);
    });
};

RPSLS.prototype.getActiveChallengeForUsers = function (user1, user2, fn) {
    this.getChallengeKeys(function (keys) {
        if (keys != null && keys.length > 0) {
            for (var i = 0; i < keys.length; i++) {
                db.hgetall(keys[i], function (err, obj) {
                    var p1 = obj['challenger'];
                    var p2 = obj['challengee'];
                    //TODO: match users to object

                    if (obj[user1] != null && obj[user2] != null) {
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
                db.hgetall(keys[i], function (err, obj) {
                    var p1 = obj['challenger'];
                    var p2 = obj['challengee'];
                    console.log('Users are [%s] and [%s]', p1, p2);

                    if (obj[p1] != null && obj[p2] != null) {
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

RPSLS.prototype.makeMove = function (key, user, move, fn) {
    db.hmset(key, user, move, fn);
};

exports.makeMove = function (req, res) {
    var key = req.params.key;
    var user = req.params.user;
    var move = req.params.move;
    console.log('User [%s] made move [%s] for challenge [%s]', user, move, key);

    app.makeMove(key, user, move, function () {
        res.send('Move submitted');
    });
};

exports.getChallenge = function (req, res) {
    app.getChallenge(req.params.key, function (data) {
        res.send(data);
    });
};

exports.getChallenges = function (req, res) {
    var user = req.params.name;
    console.log('Getting challenges against [%s]', user);
    app.getActiveChallenges(user, function (data) {
        res.send(data);
    });
};

exports.allChallengeKeys = function (req, res) {
    app.getChallengeKeys(function (data) {
        res.send(data);
    });
};

exports.challenge = function (req, res) {
    var user = req.params.name;
    var challengee = req.params.challengee;

    app.addChallenge(user, challengee,
        function () {
            res.statusCode = 409;
            res.send({message:'A challenge has already been made'})
        },
        function () {
            res.send('Added');
        }
    );
};
