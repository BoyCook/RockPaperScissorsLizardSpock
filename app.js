var express = require('express');
var app = express();
var redis = require('redis');
var db = redis.createClient(); //127.0.0.1:6379

app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));
app.use(express.cookieParser('appsecret'));
app.use(express.session({ secret: 'appsecret', cookie: { maxAge: 60000 } }));

app.put('/user/:name', function(req, res){
    var user = req.params.name;
    //Add the user
    var cnt = db.sadd('users', user);
    console.log('Adding user ['+ user +'] number [' + cnt + ']');
    res.send(user);
});

app.get('/user', function(req, res){
    //Get users from DB
    db.smembers('users', function(err, obj){
        console.log('Users ['+ obj + ']')
        res.send(obj);
    });
});

app.put('/user/:name/challenge/:challenges', function(req, res){
    var user = req.params.name;
    var challenges = req.params.challenges;
    console.log('User [' + user + '] challenges [' + challenger + ']');
    //Add the challenge
});

app.get('/user/:name/challenge', function(req, res){
    var user = req.params.name;
    //Get users challenges
});

app.post('/user/:name/challenge/:challenges/:move', function(req, res){
    var user = req.params.name;
    var challenges = req.params.challenges;
    var move = req.params.move;
    //Play the other user
});

app.listen(3000);
console.log('Listening on port 3000');
