var should = require('should');
var Object = require('../../lib/objectutils');

describe('ObjectUtils', function () {

    it('should think defined is defined', function () {
        Object.isDefined({}).should.be.true;
    });

    it('should not think undefined is defined', function () {
        Object.isDefined(undefined).should.be.false;
    });

    it('should think undefined is undefined', function () {
        Object.isUndefined(undefined).should.be.true;
    });
});
