/*
    User management
 */
var db = undefined;

function Users(inDb) {
    db = inDb;
}

Users.prototype.allUsers = function(fn) {
    db.smembers('usernames', fn);
};

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

Users.prototype.addUserAsJSON = function(user, err, fn) {
    //TODO: validate uniqueness etc
    this.findByUsername(user.username, function(ex, obj){
        if (!obj) {
            console.log('Adding user [' + user.username + ']');
            db.sadd('usernames', user.username);
            db.hmset(user.username, 'user', JSON.stringify(user), fn);
        } else {
            console.log('ERROR user [%s] already exists', user.username);
            err();
        }
    });
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
