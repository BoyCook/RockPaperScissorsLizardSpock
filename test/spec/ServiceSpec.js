var app = require('../../server');
var request = require('request');
var url = 'http://localhost:3003';

describe('RestService', function () {

    beforeEach(function (done) {
        require('./testdata').createTestData(require('fakeredis').createClient('testdb'), done);
    });

    var expectedChallenge = {BoyCook:'', Craig:'', challengee:'Craig', challenger:'BoyCook', key:'BoyCook:Craig:1', winner:''};
    var expectedNewChallenge = {Hulk:'', Superman:'', challengee:'Superman', challenger:'Hulk', key:'Hulk:Superman:1', winner:''};

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

    it("should return all challenges between users", function (done) {
        request(url + "/challenge/between/BoyCook/and/Craig", function (error, response, body) {
            body = JSON.parse(body);
            expect(body.length).toEqual(1);
            expect(body).toContain(expectedChallenge);
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

    it("should allow updates to challenge by challengee and should set winner", function (done) {
        request.put(url + '/challenge/Hulk:Superman:1/Superman/Spock',
            function (error, response, body) {
                expect(response.statusCode).toEqual(201);
                request(url + "/challenge/Hulk:Superman:1", function (error, response, body) {
                    body = JSON.parse(body);
                    expectedNewChallenge.Hulk = 'Rock';
                    expectedNewChallenge.Superman = 'Spock';
                    expectedNewChallenge.winner = 'Superman';
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
