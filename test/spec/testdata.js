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
            console.log('INSTALLING TEST DATA [%s]', obj);
            //TODO: replace with synchroniser
            context.addUser(user1, function () {
                context.addUser(user2, function () {
                    context.addUser(user3, function () {
                        context.addUser(user4, function () {
                            context.addChallenge('BoyCook', 'Craig', 'BoyCook:Craig:1', function () {
                                console.log('Setting installed [true]');
                                context.db.set('installed', 'true', fn);
                            });
                        });
                    });
                });
            });
        } else {
            console.log('TEST DATA ALREADY INSTALLED');
            if (fn) {
                fn();
            }
        }
    });
};

TestData.prototype.addUser = function (user, fn) {
    console.log('Adding test user');
    this.db.sadd('usernames', user.username);
    this.db.hmset(user.username, 'user', JSON.stringify(user), fn);
};

TestData.prototype.addChallenge = function (user, challengee, key, fn) {
    console.log('Adding test challenge');
    this.db.sadd('challenges', key);
    this.db.sadd(challengee + ':challenges', key);
    this.db.sadd(user + ':challenges', key);
    this.db.hmset(key,
        'key', key,
        'challenger', user,
        'challengee', challengee,
        user, '',
        challengee, '',
        'winner', '', fn);
};

exports.TestData = TestData;
exports.createTestData = function (db, fn) {
    var td = new TestData(db);
    td.install(fn);
};
