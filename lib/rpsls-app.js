/*
 User functions
 https://github.com/jaredhanson/passport-local/blob/master/examples/login/app.js
 https://github.com/mhevery/jasmine-node
 */
var redis = require('redis');
var db = undefined;
var app = undefined;
var game = require('./../public/js/RPSLS').newGame;

function isNotEmpty(val) {
    return (val != null && val.length > 0);
}

function isEmpty(val) {
    return !isNotEmpty(val);
}

function ServerApp(inDb) {
    db = inDb;
}

function getActive(req) {
    var query = req.query["active"];
    return query != undefined && query == 'true';
}

ServerApp.prototype.useSeq = function (fn) {
    db.incr('challenges-seq', function (err, val) {
        console.log('Using sequence val [%s]', val);
        return fn(val);
    });
};

ServerApp.prototype.getCombinedKey = function (user1, user2) {
    var users = [user1, user2];
    users.sort();
    return users[0] + ':' + users[1];
};

ServerApp.prototype.getChallengeKeys = function (fn) {
    db.smembers('challenges', function (err, keys) {
        return fn(keys);
    });
};

ServerApp.prototype.insertChallenge = function (user, challengee, fn) {
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

ServerApp.prototype.addChallenge = function (user, challengee, err, fn) {
    console.log('[%s] challenges [%s]', user, challengee);
    //TODO validate users exist
    app.getActiveChallengeForUsers(user, challengee, function (obj) {
        //If there is an existing active challenge throw error
        if (obj != undefined && obj.length > 0) {
            return err(obj);
        } else {
            return app.insertChallenge(user, challengee, fn);
        }
    });
};

ServerApp.prototype.findChallenge = function (key, fn) {
    db.hgetall(key, fn);
};

ServerApp.prototype.findChallengesForUsers = function (user1, user2, fn) {
    console.log('Getting challenges between [%s] and [%s]', user1, user2);
    var challenges = new Array();
    this.getChallengeKeys(function (keys) {
        if (keys != null && keys.length > 0) {
            for (var i = 0; i < keys.length; i++) {
                (function (index, size, key) {
                    db.hgetall(key, function (err, obj) {
                        var p1 = obj['challenger'];
                        var p2 = obj['challengee'];

                        //If object matches users
                        if ((user1 == p1 || user1 == p2) &&
                            (user2 == p1 || user2 == p2)) {
                            challenges.push(obj);
                        }

                        if (index == size - 1) {
                            fn(challenges);
                        }
                    });
                })(i, keys.length, keys[i]);
            }
        } else {
            fn(null);
        }
    });
};

ServerApp.prototype.findChallengesForUser = function (user, fn) {
    console.log('Getting challenges against [%s]', user);
    var challenges = new Array();
    db.smembers(user + ':challenges', function (err, keys) {
        if (keys != null && keys.length > 0) {
            for (var i = 0; i < keys.length; i++) {
                (function (index, size, key) {
                    db.hgetall(key, function (err, obj) {
                        challenges.push(obj);
                        if (index == size - 1) {
                            console.log('Found [%d] challenges for [%s]', challenges.length, user);
                            fn(challenges)
                        }
                    });
                })(i, keys.length, keys[i])
            }
        } else {
            fn(null);
        }
    });
};

ServerApp.prototype.getActiveChallenges = function (data, fn) {
    var challenges = undefined;
    if (data.length > 0) {
        challenges = new Array();
        for (var i = 0; i < data.length; i++) {
            if (isEmpty(data[i].winner)) {
                challenges.push(data[i]);
            }
        }
    }
    return fn(challenges);
};

ServerApp.prototype.getActiveChallengeForUsers = function (user1, user2, fn) {
    this.findChallengesForUsers(user1, user2, function (data) {
        app.getActiveChallenges(data, fn);
    });
};

ServerApp.prototype.getChallengesForUser = function (user, active, fn) {
    this.findChallengesForUser(user, function (data) {
        if (active) {
            app.getActiveChallenges(data, fn);
        } else {
            fn(data);
        }
    });
};

ServerApp.prototype.setChallengeWinner = function (key, fn) {
    app.findChallenge(key, function (err, obj) {
        var p1 = obj['challenger'];
        var p2 = obj['challengee'];
        var m1 = obj[p1];
        var m2 = obj[p2];
        //If both moves are made
        if (isNotEmpty(m1) && isNotEmpty(m2)) {
            var result = game.play(m1, m2);
            var winner = result.winner == m1 ? p1 : p2;
            console.log('Setting winner of challenge [%s] as [%s]', key, winner);
            db.hmset(key, 'winner', winner, fn);
        } else {
            if (fn) {
                fn();
            }
        }
    });
};

ServerApp.prototype.makeMove = function (req, res) {
    var key = req.params.key;
    var user = req.params.user;
    var move = req.params.move;
    console.log('User [%s] made move [%s] for challenge [%s]', user, move, key);

    db.hmset(key, user, move, function () {
        app.setChallengeWinner(key, function () {
            res.statusCode = 201;
            res.send('Move submitted');
        });
    });
};

ServerApp.prototype.getChallenge = function (req, res) {
    app.findChallenge(req.params.key, function (err, obj) {
        res.send(obj);
    });
};

ServerApp.prototype.getUsersChallenges = function (req, res) {
    var user = req.params.name;
    app.getChallengesForUser(user, getActive(req), function (data) {
        res.send(data);
    });
};

ServerApp.prototype.getChallengesForUsers = function (req, res) {
    //TODO: use getActive(req)
    var user1 = req.params.user1;
    var user2 = req.params.user2;
    app.findChallengesForUsers(user1, user2, function (data) {
        res.send(data);
    });
};

ServerApp.prototype.allChallengeKeys = function (req, res) {
    //TODO: use getActive(req)
    app.getChallengeKeys(function (data) {
        res.send(data);
    });
};

ServerApp.prototype.challenge = function (req, res) {
    var user = req.params.name;
    var challengee = req.params.challengee;

    app.addChallenge(user, challengee,
        function (existing) {
            res.statusCode = 409;
            res.send({message:'A challenge has already been made', challenge:existing})
        },
        function () {
            res.statusCode = 201;
            res.send('Challenge Added');
        }
    );
};

exports.ServerApp = ServerApp;
exports.newApp = function (db) {
    app = new ServerApp(db);
    return new ServerApp(db);
};

