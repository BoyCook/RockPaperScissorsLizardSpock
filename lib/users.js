/*
 User management
 */
var db = undefined;
var users = undefined;

function Users(inDb) {
    db = inDb;
    users = this;
}

Users.prototype.allUsers = function (fn) {
    db.smembers('usernames', fn);
};

Users.prototype.findByUsername = function (username, fn) {
    db.hgetall(username, function (err, user) {
        if (user === null) {
            return fn(null, false);
        }
        console.log('Found user [%s]', user.username);
        return fn(null, user);
    });
};

Users.prototype.addUser = function (user, err, fn) {
    this.findByUsername(user.username, function (ex, obj) {
        if (!obj) {
            users.insertUser(user, fn);
        } else {
            console.log('ERROR user [%s] already exists', user.username);
            err();
        }
    });
};

Users.prototype.insertUser = function (user, fn) {
    console.log('Adding user [%s]', user.username);
    db.sadd('usernames', user.username);
    db.hmset(user.username,
        'username', user.username,
        'firstname', user.firstName,
        'lastname', user.lastName,
        'email', user.email,
        'password', user.password, fn);
};

exports.Users = Users;
exports.newUsers = new Users();
