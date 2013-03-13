/*
 Main server app
 */
var express = require('express');
var app = express()
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server);
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var RedisStore = require('connect-redis')(express);
var parseSignedCookie = require('connect').utils.parseSignedCookie;
var cookie = require('express/node_modules/cookie');
var cookieKey = 'rpsls.sid';
var cookieSecret = 'rpslssecret';
var db = undefined;
var session = undefined;
var game = undefined;
var sessionStore = undefined;
var challengesIO = undefined;
var resultsIO = undefined;

io.configure(function () {
    console.log('Doing Socket.IO configure');
    io.set('log level', 1);
    io.set('authorization', function (data, callback) {
        checkSocketSession(data, callback);
    });
    challengesIO = io.of('/challenges');
    resultsIO = io.of('/results');
});

app.configure('development', function () {
    console.log('Doing [development] env configure');
    db = require('fakeredis').createClient('testdb');
});

app.configure('production', function () {
    console.log('Doing [production] env configure');
    db = require('redis').createClient();  //127.0.0.1:6379
});

app.configure(function () {
    console.log('Doing [default] configure');

    //TODO: do imports via index.js
    session = require('./local-auth').newAuth(db);
    game = require('./rpsls-app').newApp(db, { challenges: challengesIO, results: resultsIO});
//    session = process.env.RPSLP_COV ? require('../lib-cov/local-auth').newAuth(db) : require('./local-auth').newAuth(db);
//    game = process.env.RPSLP_COV ? require('../lib-cov/rpsls-app').newApp(db) : require('./rpsls-app').newApp(db);
    sessionStore = new RedisStore({ client: db });
    passport.use(new LocalStrategy(session.authenticate));
    passport.serializeUser(session.serializeUser);
    passport.deserializeUser(session.deserializeUser);
    app.use(express.cookieParser('appsecret'));
    app.use(express.bodyParser());
    app.use(express.session({ secret: cookieSecret, key: cookieKey, store: sessionStore, cookie: { maxAge: 60000, expires: false } }));
//    app.use(express.cookieSession());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
    app.use(express.static(__dirname + '/../public'));
    // app.set('redisdb', 1);
    //db.select(app.set('redisdb'), function(err,res){});
});

app.get('/user', session.list);
app.get('/user/:name', session.getUser);
app.get('/user/:name/challenges', game.getUsersChallenges); //?active //challengesIO.emit
app.put('/user/:name/challenges/:challengee', game.challenge);
app.get('/challenge', game.allChallengeKeys);
app.get('/challenge/:key', game.getChallenge); //resultsIO.emit
app.put('/challenge/:key/:user/:move', game.makeMove);
app.get('/challenge/between/:user1/and/:user2', game.getChallengesBetweenUsers); //?active

app.get('/session', session.getUserSession);
app.put('/signup', session.signUp);
app.get('/logout', session.logout);
app.post('/login', passport.authenticate('local'), session.authenticateSuccess);

//app.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/' }));

//TODO: move to authenticator and implement
function checkSocketSession(data, callback) {
    //TODO: lookup
//    var user = getUserFromSession(data);
    var sessionID = getSessionID(data);
    console.log('Socket SessionID [%s]', sessionID);
    sessionStore.get(sessionID, function(err, session) {
        console.log('Socket Session User [%s]', getUserFromSession(session));
    });

    if (sessionID) {
        callback(null, true);
    } else {
        callback(null, false);
    }
}

function getSessionID(data) {
    if (data.headers.cookie) {
        var cookies = cookie.parse(data.headers.cookie);
        return parseSignedCookie(cookies[cookieKey], cookieSecret);
    }
    return undefined;
}

function getUserFromSession(session) {
    return session.passport.user;
}

exports.startUp = function (config, fn) {
    if (!this.server) {
        this.server = server.listen(config.port, function () {
            console.log('Listening on port [%s]', config.port);
            if (fn) {
                fn();
            }
        });
    }
};

exports.shutDown = function () {
    console.log('Shutting down server');
    this.server.close();
};
