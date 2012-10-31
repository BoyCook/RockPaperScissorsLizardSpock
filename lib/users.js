/*
    User management
 */
var db = undefined;

function Users(inDb) {
    db = inDb;
}

Users.prototype.findByUsername = function(username, fn) {
    db.hget(username, 'user', function (err, obj) {
        if (obj == null) {
            return fn(null, false);
        }
        var user = JSON.parse(obj);
        console.log('Found user [%s]', user.username);
        return fn(null, user);
    });
};

Users.prototype.allUsers = function(fn) {
    db.smembers('usernames', fn);
};

Users.prototype.addUserAsJSON = function(user) {
    //TODO: validate uniqueness etc
    console.log('Adding user [' + user.username + ']');
    db.sadd('usernames', user.username);
    db.hmset(user.username, 'user', JSON.stringify(user));
};

Users.prototype.addUserAsHSet = function(user) {
    //TODO: validate uniqueness etc
    console.log('Adding user [' + user.username + ']');
    db.sadd('users', user.username);
    db.hmset(user.username, 'username',
        user.username, 'firstname',
        user.firstName, 'lastname',
        user.lastName, 'email',
        user.email, 'password',
        user.password);
};

exports.Users = Users;
exports.newUsers = new Users();
