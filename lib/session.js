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
    res.send({ user:req.user });
};

Session.prototype.signUp = function (req, res) {
    var user = req.body;
    users.addUserAsJSON(user);
    res.send(user);
};

Session.prototype.logout = function (req, res) {
    req.logOut();
    res.redirect('/');
};

Session.prototype.list = function (req, res) {
    users.allUsers(function (err, obj) {
        res.send(obj);
    });
};

Session.prototype.getUser = function(req, res) {
    users.findByUsername(req.params.name, function (err, user) {
        res.send(user);
    });
};

Session.prototype.getUserSession = function (req, res) {
    var user = req.user;
    if (req.user == undefined) {
        res.statusCode = 404;
    }
    res.send({ user:user });
};

exports.Session = Session;
exports.newSession = function(db) {
    return new Session(db);
};
