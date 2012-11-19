/*
 Session management
 */
var users = undefined;

function Session(db) {
    var Users = require('./users').Users;
    users = new Users(db);
}

Session.prototype.serializeUser = function (user, done) {
    done(null, user.username);
};

Session.prototype.deserializeUser = function (id, done) {
    users.findByUsername(id, function (err, user) {
        done(err, user);
    });
};

Session.prototype.authenticate = function (username, password, done) {
    //TODO: propagate error reason to client
    console.log('Trying to authenticate [%s]', username);
    process.nextTick(function () {
        users.findByUsername(username, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, { message:'Unknown user ' + username });
            }
            if (user.password != password) {
                return done(null, false, { message:'Invalid password' });
            }
            return done(null, user);
        })
    });
};

Session.prototype.authenticateSuccess = function (req, res) {
    var user = req.user;
    delete user['password'];
    res.send({ user:user });
};

Session.prototype.signUp = function (req, res) {
    var user = req.body;
    users.addUser(user,
        function () {
            res.statusCode = 409;
            res.send({message:'User with name [' + user.username + '] already exists'});
        },
        function () {
            res.statusCode = 201;
            delete user['password'];
            res.send(user);
        });
};

Session.prototype.logout = function (req, res) {
    req.logOut();
    res.send("Success");
};

Session.prototype.list = function (req, res) {
    users.allUsers(function (err, obj) {
        res.send(obj);
    });
};

Session.prototype.getUser = function (req, res) {
    users.findByUsername(req.params.name, function (err, user) {
        delete user['password'];
        res.send(user);
    });
};

Session.prototype.getUserSession = function (req, res) {
    var user = req.user;
    if (user == undefined) {
        res.statusCode = 404;
    }
    delete user['password'];
    res.send({ user:user });
};

exports.Session = Session;
exports.newSession = function (db) {
    return new Session(db);
};
