var app = require('../../server');
var request = require('request');
var url = 'http://localhost:3003';

describe('RestService', function () {

    beforeEach(function (done) {
        require('./testdata').createTestData(require('fakeredis').createClient('testdb'), done);
    });

    var expectedBoyCook = { username:'BoyCook', firstName:'Craig', lastName:'Cook', email:'boycook@me.com', password:'password'};
    var newUserSpiderMan = {username:'SpiderMan', firstName:'Peter', lastName:'Parker', email:'spiderman@me.com', password:'password'};
    var expectedChallenge = {BoyCook:'', Craig:'', challengee:'Craig', challenger:'BoyCook', key:'BoyCook:Craig:1', winner:''};
    var expectedNewChallenge = {Hulk:'', Superman:'', challengee:'Superman', challenger:'Hulk', key:'Hulk:Superman:1', winner:''};

    it("should return all users", function (done) {
        request(url + "/user", function (error, response, body) {
            body = JSON.parse(body);
            expect(body.length).toEqual(4);
            expect(body).toContain('Craig');
            expect(body).toContain('BoyCook');
            expect(body).toContain('Superman');
            expect(body).toContain('Hulk');
            done();
        });
    });

    it("should return a given user", function (done) {
        request(url + "/user/BoyCook", function (error, response, body) {
            body = JSON.parse(body);
            expect(body).toEqual(expectedBoyCook);
            done();
        });
    });

    it("should return a given users challenges", function (done) {
        request(url + "/user/BoyCook/challenges", function (error, response, body) {
            body = JSON.parse(body);
            //TODO: finish assertions
            done();
        });
    });

    it("should return all challenges", function (done) {
        request(url + "/challenge", function (error, response, body) {
            body = JSON.parse(body);
            expect(body.length).toEqual(1);
            expect(body).toContain('BoyCook:Craig:1');
            done();
        });
    });

    it("should return a given challenge", function (done) {
        request(url + "/challenge/BoyCook:Craig:1", function (error, response, body) {
            body = JSON.parse(body);
            expect(body).toEqual(expectedChallenge);
            done();
        });
    });

    it("should allow signup", function (done) {
        request.put({
                url:url + '/signup',
                headers:{'content-type':'application/json', dataType:'json'},
                body:JSON.stringify(newUserSpiderMan)
            },
            function (error, response, body) {
                body = JSON.parse(body);
                expect(response.statusCode).toEqual(201);
                expect(body).toEqual(newUserSpiderMan);
                done();
            });
    });

    it("should not allow duplicate users to signup", function (done) {
        request.put({
                url:url + '/signup',
                headers:{'content-type':'application/json', dataType:'json'},
                body:JSON.stringify(newUserSpiderMan)
            },
            function (error, response, body) {
                body = JSON.parse(body);
                expect(response.statusCode).toEqual(409);
                expect(body).toEqual({message:'User with name [SpiderMan] already exists'});
                done();
            });
    });

    it("should allow login and return session object", function (done) {
        request.post(url + '/login?username=BoyCook&password=password',
            function (error, response, body) {
                body = JSON.parse(body);
                expect(response.statusCode).toEqual(200);
                expect(body).toEqual({user:expectedBoyCook});
                done();
            });
    });

    //Need to resolve session persistence issue
//    it("should return the logged in users session", function (done) {
//        request(url + "/session", function (error, response, body) {
//            body = JSON.parse(body);
//            expect(response.statusCode).toEqual(200);
//            expect(body).toEqual({user:expectedBoyCook});
//            done();
//        });
//    });

    it("should fail login for invalid user", function (done) {
        request.post(url + '/login?username=INVALID&password=password',
            function (error, response, body) {
                expect(response.statusCode).toEqual(401);
                done();
            });
    });

    it("should fail login for invalid password", function (done) {
        request.post(url + '/login?username=BoyCook&password=invalid',
            function (error, response, body) {
                expect(response.statusCode).toEqual(401);
                done();
            });
    });

    it("should allow a user to challenge", function (done) {
        request.put(url + '/user/Hulk/challenges/Superman',
            function (error, response, body) {
                expect(response.statusCode).toEqual(201);
                request(url + "/challenge/Hulk:Superman:1", function (error, response, body) {
                    body = JSON.parse(body);
                    expect(body).toEqual(expectedNewChallenge);
                    assertChallenges(2, done);
                });
            });
    });

    it("should not allow a duplicate active challenge", function (done) {
        request.put(url + '/user/Hulk/challenges/Superman',
            function (error, response, body) {
                expect(response.statusCode).toEqual(409);
                assertChallenges(2, done);
            });
    });

    it("should not allow a duplicate active challenge in reverse", function (done) {
        request.put(url + '/user/Superman/challenges/Hulk',
            function (error, response, body) {
                expect(response.statusCode).toEqual(409);
                assertChallenges(2, done);
            });
    });

    it("should allow updates to challenge by challenger", function (done) {
        request.put(url + '/challenge/Hulk:Superman:1/Hulk/Rock',
            function (error, response, body) {
                expect(response.statusCode).toEqual(201);
                request(url + "/challenge/Hulk:Superman:1", function (error, response, body) {
                    body = JSON.parse(body);
                    expectedNewChallenge.Hulk = 'Rock';
                    expect(body).toEqual(expectedNewChallenge);
                    done();
                });
            });
    });

    it("should allow updates to challenge by challengee", function (done) {
        request.put(url + '/challenge/Hulk:Superman:1/Superman/Spock',
            function (error, response, body) {
                expect(response.statusCode).toEqual(201);
                request(url + "/challenge/Hulk:Superman:1", function (error, response, body) {
                    body = JSON.parse(body);
                    expectedNewChallenge.Hulk = 'Rock';
                    expectedNewChallenge.Superman = 'Spock';
                    expect(body).toEqual(expectedNewChallenge);
                    done();
                });
            });
    });
});

function assertChallenges(cnt, done) {
    request(url + "/challenge", function (error, response, body) {
        body = JSON.parse(body);
        expect(body.length).toEqual(cnt);
        done();
    });
}
