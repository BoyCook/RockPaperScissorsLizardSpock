var express = require('express');
var app = express();
var game = require('./lib/rpsls');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('./lib/session').newSession;

passport.use(new LocalStrategy(session.authenticate));
passport.serializeUser(session.serializeUser);
passport.deserializeUser(session.deserializeUser);

app.configure(function() {
    app.use(express.cookieParser('appsecret'));
    app.use(express.bodyParser());
    app.use(express.session({ secret: 'appsecret', cookie: { maxAge: 60000 } }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.get('/user', session.list);
app.get('/user/:name', session.getUser);
app.get('/user/:name/challenges', game.getChallenges);
app.put('/user/:name/challenges/:challengee', game.challenge);
app.get('/challenge/:key', game.getChallenge);
app.put('/challenge/:key/:user/:move', game.makeMove);

app.get('/session', session.getUserSession);
app.put('/signup', session.signUp);
app.get('/logout', session.logout);
app.post('/login', passport.authenticate('local'), session.authenticateSuccess);

//app.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/' }));

app.listen(3000);
console.log('Listening on port 3000');
