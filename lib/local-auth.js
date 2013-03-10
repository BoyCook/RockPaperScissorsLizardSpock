/*
 Session management
 */
var users = undefined;

function LocalAuthentication(db) {
    var Users = require('./users').Users;
    users = new Users(db);
}

LocalAuthentication.prototype.serializeUser = function (user, done) {
    done(null, user.username);
};

LocalAuthentication.prototype.deserializeUser = function (id, done) {
    users.findByUsername(id, function (err, user) {
        done(err, user);
    });
};

LocalAuthentication.prototype.authenticateSocket = function (username, password, done) {
    //TODO: implement
};

LocalAuthentication.prototype.authenticate = function (username, password, done) {
    //TODO: propagate error reason to client
    console.log('Trying to authenticate [%s]', username);
    process.nextTick(function () {
        users.findByUsername(username, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, { message: 'Unknown user ' + username });
            }
            if (user.password != password) {
                return done(null, false, { message: 'Invalid password' });
            }
            return done(null, user);
        })
    });
};

LocalAuthentication.prototype.authenticateSuccess = function (req, res) {
    var user = req.user;
    delete user['password'];
    res.send({ user: user });
};

LocalAuthentication.prototype.signUp = function (req, res) {
    var user = req.body;
    users.addUser(user,
        function () {
            res.statusCode = 409;
            res.send({message: 'User with name [' + user.username + '] already exists'});
        },
        function () {
            res.statusCode = 201;
            delete user['password'];
            res.send(user);
        });
};

LocalAuthentication.prototype.logout = function (req, res) {
    req.logOut();
    res.send("Success");
};

LocalAuthentication.prototype.list = function (req, res) {
    console.log('Getting all users');
    users.allUsers(function (err, obj) {
        res.send(obj);
    });
};

LocalAuthentication.prototype.getUser = function (req, res) {
    users.findByUsername(req.params.name, function (err, user) {
        delete user['password'];
        res.send(user);
    });
};

LocalAuthentication.prototype.getUserSession = function (req, res) {
    var user = req.user;
    if (user == undefined) {
        res.statusCode = 404;
    } else {
        delete user['password'];
    }
    var session = {
        id: req.sessionID,
        user: (user == undefined ? {} : user)
    };
    res.send(session);
};

exports.LocalAuthentication = LocalAuthentication;
exports.newAuth = function (db) {
    return new LocalAuthentication(db);
};
