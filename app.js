var express = require('express');
var app = express();
var user = require('./lib/user');

var passport = require('passport');
//var util = require('util');
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(user.authenticate));
passport.serializeUser(user.serializeUser);
passport.deserializeUser(user.deserializeUser);

app.configure(function() {
    app.use(express.cookieParser('appsecret'));
    app.use(express.bodyParser());
    app.use(express.session({ secret: 'appsecret', cookie: { maxAge: 60000 } }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.put('/user/:name', user.add);
app.get('/user', user.list);
app.put('/user/:name/challenge/:challenges', user.challenge);
app.get('/user/:name/challenge', user.listChallenges);
app.post('/user/:name/challenge/:challenges/:move', user.makeMove);

app.put('/signup', user.signUp);
app.get('/logout', user.logout);
app.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }));

app.listen(3000);
console.log('Listening on port 3000');
