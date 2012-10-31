var app = require('../../server');
var http = require('http');
var request = require('request');

describe('RestService', function () {

    var expectedBoyCook = {
        "username":"BoyCook", "firstName":"Craig", "lastName":"Cook", "password":"password", "email":"boycook@me.com"
    };
    var expectedChallenge = {
        "challenger":"BoyCook", "challengee":"Jassie", "key":"BoyCook:Jassie1", "Jassie":"Rock", "BoyCook":"Spock"
    };

    it("should return all users", function (done) {
        request("http://localhost:3000/user", function (error, response, body) {
            body = JSON.parse(body);
            expect(body.length).toEqual(2);
            expect(body).toContain('Jassie');
            expect(body).toContain('BoyCook');
            done();
        });
    });

    it("should return a given user", function (done) {
        request("http://localhost:3000/user/BoyCook", function (error, response, body) {
            body = JSON.parse(body);
            expect(body).toEqual(expectedBoyCook);
            done();
        });
    });

//    it("should return a given users challenges", function (done) {
//        request("http://localhost:3000/user/BoyCook/challenges", function (error, response, body) {
////            body = JSON.parse(body);
//            done();
//        });
//    });

    it("should return all challenges", function (done) {
        request("http://localhost:3000/challenge", function (error, response, body) {
            body = JSON.parse(body);
            expect(body.length).toEqual(3);
            expect(body).toContain('BoyCook:Jassie1');
            expect(body).toContain('BoyCook:Jassie2');
            expect(body).toContain('BoyCook:Jassie3');
            done();
        });
    });

    it("should return a given challenge", function (done) {
        request("http://localhost:3000/challenge/BoyCook:Jassie1", function (error, response, body) {
            body = JSON.parse(body);
            expect(body).toEqual(expectedChallenge);
            done();
        });
    });

//    it("should return the logged in users session", function (done) {
//        request("http://localhost:3000/session", function (error, response, body) {
////            body = JSON.parse(body);
//            done();
//        });
//    });


//    app.put('/user/:name/challenges/:challengee', game.challenge);
//    app.put('/challenge/:key/:user/:move', game.makeMove);
//    app.put('/signup', session.signUp);
//    app.post('/login', passport.authenticate('local'), session.authenticateSuccess);
});
