var express = require('express');
var app = express();
var map = require('./lib/Map.js');
var users = map.createMap();

function addClient(id, name) {
    console.log('Adding User [' + name + '] for Session [' + id + ']');
	users.put(id, name);
}

app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));
app.use(express.cookieParser('appsecret'));
app.use(express.session({ secret: 'appsecret', cookie: { maxAge: 60000 } }));

app.put('/user', function(req, res){	
	req.accepts('application/json');
    var name = req.body.name;
    addClient(req.sessionID, name);
	res.send(req.body);
});

app.get('/user', function(req, res){
  res.send(users.all());
});

app.listen(3000);
console.log('Listening on port 3000');
