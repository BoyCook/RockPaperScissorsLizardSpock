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

function activeFunction(active) {
    return active == "true" ? isEmpty : isNotEmpty;
}

function getDateString() {
    var date = new Date();
    return date.getFullYear() + '-' +
        date.getMonth() + '-' +
        date.getDate() + ' ' +
        date.getHours() + ':' +
        date.getMinutes();
}

function ServerApp(inDb, io) {
    //TODO: db should be 'this.db'
    db = inDb;
    this.io = io;
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
            'date', getDateString(),
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

ServerApp.prototype.findChallengesBetweenUsers = function (user1, user2, fn) {
    console.log('Getting challenges between [%s] and [%s]', user1, user2);
    var challenges = [];
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
    var challenges = [];
    db.smembers(user + ':challenges', function (err, keys) {
        if (keys != null && keys.length > 0) {
            for (var i = 0; i < keys.length; i++) {
                (function (index, size, key) {
                    db.hgetall(key, function (err, obj) {
                        challenges.push(obj);
                        if (index == size - 1) {
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

ServerApp.prototype.filterChallenges = function (data, key, match) {
    var challenges = undefined;
    if (data.length > 0) {
        challenges = [];
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            if (typeof match == "function") {
                if (match(item[key])) {
                    challenges.push(item);
                }
            } else if (item[key] == value){
                challenges.push(item);
            }
        }
    }
    console.log('Found [%d] challenges', (challenges == undefined ? 0 : challenges.length));
    return challenges;
};

ServerApp.prototype.getActiveChallengeForUsers = function (user1, user2, fn) {
    this.findChallengesBetweenUsers(user1, user2, function (data) {
        fn(app.filterChallenges(data, 'winner', isEmpty));
    });
};

ServerApp.prototype.getChallengesForUser = function (user, active, fn) {
    this.findChallengesForUser(user, function (data) {
        if (active != undefined) {
            fn(app.filterChallenges(data, 'winner', activeFunction(active)));
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

ServerApp.prototype.challenge = function (req, res) {
    var user = req.params.name;
    var challengee = req.params.challengee;
    app.addChallenge(user, challengee,
        function (existing) {
            res.statusCode = 409;
            res.send({message:'A challenge has already been made', challenge:existing})
        },
        function () {
            app.getChallengesForUser(user, "true", function (data) {
//                app.io.challenges.volatile.emit(user, data);
                app.io.challenges.emit(user, data);
            });
            res.statusCode = 201;
            res.send('Challenge Added');
        }
    );
};

ServerApp.prototype.makeMove = function (req, res) {
    var key = req.params.key;
    var user = req.params.user;
    var move = req.params.move;
    console.log('User [%s] made move [%s] for challenge [%s]', user, move, key);

    db.hmset(key, user, move, function () {
        app.setChallengeWinner(key, function () {
            app.findChallenge(key, function (err, data) {
//                app.io.results.volatile.emit(user, data);
                app.io.results.emit(user, data);
            });
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
    app.getChallengesForUser(user, req.query["active"], function (data) {
        res.send(data);
    });
};

ServerApp.prototype.getChallengesBetweenUsers = function (req, res) {
    var user1 = req.params.user1;
    var user2 = req.params.user2;
    var active =  req.query["active"];
    app.findChallengesBetweenUsers(user1, user2, function (data) {
        if (active != undefined) {
            res.send(app.filterChallenges(data, 'winner', activeFunction(active)));
        } else {
            res.send(data);
        }
    });
};

ServerApp.prototype.allChallengeKeys = function (req, res) {
    //TODO: use getActive(req)
    app.getChallengeKeys(function (data) {
        res.send(data);
    });
};

exports.ServerApp = ServerApp;
exports.newApp = function (db, io) {
    app = new ServerApp(db, io);
    return new ServerApp(db, io);
    //TODO: return 'app'?
};
