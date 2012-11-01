/*
 User functions
 https://github.com/jaredhanson/passport-local/blob/master/examples/login/app.js
 https://github.com/mhevery/jasmine-node
 */
var redis = require('redis');
var db = undefined;
var app = undefined;

function isNotEmpty(val) {
    return (val != null && val.length > 0);
}

function isEmpty(val) {
    return !isNotEmpty(val);
}

function RPSLS(inDb) {
    db = inDb;
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

RPSLS.prototype.insertChallenge = function (user, challengee, fn) {
    app.useSeq(function (val) {
        var key = app.getCombinedKey(user, challengee) + ':' + val;
        console.log('Adding challenge [%s]', key);
        db.sadd('challenges', key);
        db.sadd(challengee + ':challenges', key);
        db.sadd(user + ':challenges', key);
        db.hmset(key,
            'key', key,
            'challenger', user,
            user, '',
            'challengee', challengee,
            challengee, '',
            'winner', '', fn);
    });
};

RPSLS.prototype.addChallenge = function (user, challengee, err, fn) {
    console.log('[%s] challenges [%s]', user, challengee);

    //TODO validate users exist
    app.getActiveChallengeForUsers(user, challengee, function (obj) {
        //If there is an existing active challenge throw error
        if (obj != null) {
            return err();
        } else {
            return app.insertChallenge(user, challengee, fn);
        }
    });
};

RPSLS.prototype.getChallenge = function (req, res) {
    db.hgetall(req.params.key, function (err, obj) {
        res.send(obj);
    });
};

RPSLS.prototype.getActiveChallengeForUsers = function (user1, user2, fn) {
    this.getChallengeKeys(function (keys) {
        if (keys != null && keys.length > 0) {
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                (function(index, size, key){
                    db.hgetall(key, function (err, obj) {
                        var p1 = obj['challenger'];
                        var p2 = obj['challengee'];

//                        console.log('Looking for match between [%s]-[%s] on [%s] with [%s]-[%s]', user1, user2, key, p1, p2);

                        //If object matches users
                        if ((user1 == p1 || user1 == p2) &&
                            (user2 == p1 || user2 == p2)) {
                            if (isEmpty(obj.winner)) {
                                console.log('Found an active challenge between [%s]-[%s] at [%s]', user1, user2, key);
                                return fn(obj);
                            }
                        }

                        //At the end and no matches
                        if (index+1 == size) {
                            console.log('No user match found between [%s]-[%s]', user1, user2);
                            return fn(null);
                        }
                    });
                })(i, keys.length, key);
            }
        } else {
            return fn(null);
        }
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

RPSLS.prototype.makeMove = function (req, res) {
    var key = req.params.key;
    var user = req.params.user;
    var move = req.params.move;
    console.log('User [%s] made move [%s] for challenge [%s]', user, move, key);

    db.hmset(key, user, move, function () {
        res.statusCode = 201;
        res.send('Move submitted');
    });
};

RPSLS.prototype.getChallenges = function (req, res) {
    var user = req.params.name;
    console.log('Getting challenges against [%s]', user);
    app.getActiveChallenges(user, function (data) {
        res.send(data);
    });
};

RPSLS.prototype.allChallengeKeys = function (req, res) {
    app.getChallengeKeys(function (data) {
        res.send(data);
    });
};

RPSLS.prototype.challenge = function (req, res) {
    var user = req.params.name;
    var challengee = req.params.challengee;

    app.addChallenge(user, challengee,
        function () {
            res.statusCode = 409;
            res.send({message:'A challenge has already been made'})
        },
        function () {
            res.statusCode = 201;
            res.send('Challenge Added');
        }
    );
};

exports.RPSLS = RPSLS;
exports.newRPSLS = function (db) {
    app = new RPSLS(db);
    return new RPSLS(db);
};

