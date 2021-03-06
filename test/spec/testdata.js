/*
 Test Data installer
 */
function TestData(inDb) {
    this.db = inDb;
}

TestData.prototype.install = function (fn) {
    var context = this;
    var user1 = {username:'BoyCook', firstName:'Craig', lastName:'Cook', email:'boycook@me.com', password:'password'};
    var user2 = {username:'Craig', firstName:'Craig', lastName:'Cook', email:'boycook@me.com', password:'password'};
    var user3 = {username:'Hulk', 'firstName':'Bruce', 'lastName':'Banner', 'email':'hulk@me.com', 'password':'password'};
    var user4 = {username:'Superman', firstName:'Clark', lastName:'Kent', email:'superman@me.com', password:'password'};

    this.db.get('installed', function (err, obj) {
        if (obj == null) {
            console.log('INSTALLING TEST DATA');
            //TODO: replace with synchroniser
            context.addUser(user1, function () {
                context.addUser(user2, function () {
                    context.addUser(user3, function () {
                        context.addUser(user4, function () {
                            context.addChallenge('BoyCook', 'Craig', '', 'Rock', 'BoyCook:Craig:1', function () {
                                console.log('Setting installed [true]');
                                context.db.set('installed', 'true', fn);
                            });
                        });
                    });
                });
            });
        } else {
            if (fn) {
                fn();
            }
        }
    });
};

TestData.prototype.addUser = function (user, fn) {
    var context = this;
    console.log('Adding test user [%s]', user.username);
    this.db.sadd('usernames', user.username, function(){
        context.db.hmset(user.username,
            'username', user.username,
            'firstname', user.firstName,
            'lastname', user.lastName,
            'email', user.email,
            'password', user.password, fn);
    });
};

TestData.prototype.addChallenge = function (user, challengee, userVal, challengeeVal, key, fn) {
    var context = this;
    console.log('Adding test challenge');
    this.db.incr('challenges-seq', function (err, val) {
        console.log('Using sequence val [%s]', val);
        context.db.sadd('challenges', key);
        context.db.sadd(challengee + ':challenges', key);
        context.db.sadd(user + ':challenges', key);
        context.db.hmset(key,
            'key', key,
            'challenger', user,
            'challengee', challengee,
            user, userVal,
            challengee, challengeeVal,
            'winner', '',
            'date', '2012-10-18 0:40',
            fn);
    });
};

exports.TestData = TestData;
exports.createTestData = function (db, fn) {
    var td = new TestData(db);
    td.install(fn);
};
