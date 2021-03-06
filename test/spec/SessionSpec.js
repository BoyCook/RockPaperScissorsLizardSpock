var request = require('request');
var url = 'http://localhost:3003';

describe('SessionService', function () {

    var expectedBoyCook = undefined;
    var newUserSpiderMan = undefined;
    var expectedSession = undefined;

    beforeEach(function (done) {
        expectedBoyCook = { email: 'boycook@me.com', firstname: 'Craig', lastname: 'Cook', username: 'BoyCook' };
        newUserSpiderMan = {username: 'SpiderMan', firstName: 'Peter', lastName: 'Parker', email: 'spiderman@me.com'};
        expectedSession = { passport : { user : 'BoyCook' }};
        done();
    });

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

    it("should allow signup", function (done) {
        newUserSpiderMan.password = 'password';
        request.put({
                url: url + '/signup',
                headers: {'content-type': 'application/json', dataType: 'json'},
                body: JSON.stringify(newUserSpiderMan)
            },
            function (error, response, body) {
                body = JSON.parse(body);
                delete newUserSpiderMan['password'];
                expect(response.statusCode).toEqual(201);
                expect(body).toEqual(newUserSpiderMan);
                done();
            });
    });

    it("should not allow duplicate users to signup", function (done) {
        request.put({
                url: url + '/signup',
                headers: {'content-type': 'application/json', dataType: 'json'},
                body: JSON.stringify(newUserSpiderMan)
            },
            function (error, response, body) {
                body = JSON.parse(body);
                expect(response.statusCode).toEqual(409);
                expect(body).toEqual({message: 'User with name [SpiderMan] already exists'});
                done();
            });
    });

    it("should allow login and return session object", function (done) {
        request.post(url + '/login?username=BoyCook&password=password',
            function (error, response, body) {
                body = JSON.parse(body);
                expect(response.statusCode).toEqual(200);
                expect(body).toEqual({user: expectedBoyCook});
                done();
            });
    });

    it("should return the logged in users session", function (done) {
        request(url + "/session", function (error, response, body) {
            body = JSON.parse(body);
            expect(response.statusCode).toEqual(200);
            expect(body.user).toEqual(expectedBoyCook);
            done();
        });
    });

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
});
