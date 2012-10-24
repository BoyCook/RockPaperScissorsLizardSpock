// var redis = require('redis');
// var db = redis.createClient(); //127.0.0.1:6379
// var RedisStore = require('connect-redis')(express);
// app.use(express.session({ store: new RedisStore, secret: 'appsecret', key: 'cookie.sid', cookie: { maxAge: 60000 }} ));
// app.use(express.cookieSession({secret: 'appsecret'}));

// app.use(function(req, res, next){
//   var ua = req.headers['user-agent'];
//   db.zadd('online', Date.now(), ua, next);
// });
//
// app.use(function(req, res, next){
//   var min = 60 * 1000;
//   var ago = Date.now() - min;
//   db.zrevrangebyscore('online', '+inf', ago, function(err, users){
//     if (err) return next(err);
//     req.online = users;
//     next();
//   });
// });
//

//app.get('/online', function(req, res){
//    res.send(req.online.length + ' users online');
//});

//app.use(function(req, res, next){
//    console.log('SessionID: ' + req.sessionID);
//    next();
//});
