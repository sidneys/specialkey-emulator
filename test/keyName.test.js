'use strict';

var should = require('should'),
    specialkeyEmulator = require('../');

describe('keyName', function() {
    it('should return an error if provided key is null', function(done) {
        specialkeyEmulator(null, function(err, result) {
            should.exist(err);
            should.not.exist(result);
            done()
        })
    });
    it('should return an error if provided key is undefined', function(done) {
        specialkeyEmulator(undefined, function(err, result) {
            should.exist(err);
            should.not.exist(result);
            done()
        })
    });
    it('should return an error if provided key is not a string', function(done) {
        specialkeyEmulator(1234, function(err, result) {
            should.exist(err);
            should.not.exist(result);
            done()
        })
    });
    it('should return an error if provided key is not known', function(done) {
        specialkeyEmulator('1234', function(err, result) {
            should.exist(err);
            should.not.exist(result);
            done()
        })
    });
    it('should succeed', function(done) {
        specialkeyEmulator('NX_KEYTYPE_ILLUMINATION_UP', function(err, result) {
            should.not.exist(err);
            should.exist(result);
            result.should.equal(21)
            done()
        })
    });
});
