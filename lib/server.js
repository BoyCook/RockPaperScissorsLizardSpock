/*
    Main server app
 */
var express = require('express');
var app = express();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var RedisStore = require('connect-redis')(express);
var db = undefined;
var session = undefined;
var game = undefined;

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

    //TODO make imports cleaner
    session = process.env.RPSLP_COV ? require('../lib-cov/local-auth').newAuth(db) : require('./local-auth').newAuth(db);
    game = process.env.RPSLP_COV ? require('../lib-cov/rpsls-app').newApp(db) : require('./rpsls-app').newApp(db);

    passport.use(new LocalStrategy(session.authenticate));
    passport.serializeUser(session.serializeUser);
    passport.deserializeUser(session.deserializeUser);
    app.use(express.cookieParser('appsecret'));
    app.use(express.bodyParser());
    app.use(express.session({ secret:'appsecret', store:new RedisStore, cookie:{ maxAge:60000, expires: false } }));
    app.use(express.cookieSession());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
    app.use(express.static(__dirname + '/../public'));
    // app.set('redisdb', 1);
    //db.select(app.set('redisdb'), function(err,res){});
});

app.get('/user', session.list);
app.get('/user/:name', session.getUser);
app.get('/user/:name/challenges', game.getUsersChallenges); //?active
app.put('/user/:name/challenges/:challengee', game.challenge);
app.get('/challenge', game.allChallengeKeys);
app.get('/challenge/:key', game.getChallenge);
app.put('/challenge/:key/:user/:move', game.makeMove);
app.get('/challenge/between/:user1/and/:user2', game.getChallengesBetweenUsers); //?active

app.get('/session', session.getUserSession);
app.put('/signup', session.signUp);
app.get('/logout', session.logout);
app.post('/login', passport.authenticate('local'), session.authenticateSuccess);

//app.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/' }));

exports.startUp = function(config, fn) {
    if(!this.server) {
        this.server = app.listen(config.port, function() {
            console.log('Listening on port [%s]', config.port);
            if(fn) {
                fn();
            }
        });
    }
};

exports.shutDown = function() {
    console.log('Shutting down server');
    this.server.close();
};
