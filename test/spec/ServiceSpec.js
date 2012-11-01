var app = require('../../server');
var request = require('request');

describe('RestService', function () {

    var url = 'http://localhost:3003'; 
    
    beforeEach(function (done) {
        require('./testdata').createTestData(require('fakeredis').createClient('testdb'), done);
    });

    var expectedBoyCook = {
        "username":"BoyCook", "firstName":"Craig", "lastName":"Cook", "password":"password", "email":"boycook@me.com"
    };
    var expectedChallenge = {
        BoyCook:'null', Craig:'null', challengee:'Craig', challenger:'BoyCook', key:'BoyCook:Craig:1', winner:'null'
    };

    it("should return all users", function (done) {
        request(url + "/user", function (error, response, body) {
            body = JSON.parse(body);
            expect(body.length).toEqual(2);
            expect(body).toContain('Craig');
            expect(body).toContain('BoyCook');
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

//    it("should return the logged in users session", function (done) {
//        request(url + "/session", function (error, response, body) {
////            body = JSON.parse(body);
//            done();
//        });
//    });


//    app.put('/user/:name/challenges/:challengee', game.challenge);
//    app.put('/challenge/:key/:user/:move', game.makeMove);
//    app.put('/signup', session.signUp);
//    app.post('/login', passport.authenticate('local'), session.authenticateSuccess);
});
