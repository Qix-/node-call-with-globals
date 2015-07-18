'use strict';
// jshint mocha:true

require('should');
var callWithGlobals = require('./');

it('should modify a simple global', function() {
  var i = 0;
  var globals = {abcdef: 1234};
  callWithGlobals(function() {
    i = abcdef;
  }, globals);
  i.should.equal(1234);
  global.should.not.have.property('abcdef');
});

it('should propogate errors', function() {
  (function() {
    callWithGlobals(function() {
      throw Error('some error');
    }, {});
  }).should.throw('some error');
});

it('should pass extra args', function() {
  var sum = 0;
  var globals = {a: 12, b: 8};
  callWithGlobals(function(c) {
    sum = a + b + c;
  }, globals, 10);
  sum.should.equal(30);
  global.should.not.have.property('a');
  global.should.not.have.property('b');
});

it('should work with bind', function() {
  var globals = {a: 10};
  var fn = callWithGlobals.bind(null, function(b) {
    return a + b;
  }, globals);

  fn(0).should.equal(10);
  fn(1).should.equal(11);
  fn(300).should.equal(310);
  global.should.not.have.property('a');
});

it('should pass this', function() {
  function Cls() {
    this.a = 10;
  }

  // sums this.a + global.b + (arg) c
  Cls.prototype.sum = function sum(c) {
    return this.a + b + c;
  };

  var obj = new Cls();

  global.should.not.have.property('b');
  (function() {
    obj.sum(10);
  }).should.throw();

  var globals = {b: 15};

  Cls.prototype.sum = callWithGlobals.bind(obj, Cls.prototype.sum, globals);

  obj.sum(5).should.equal(30);
  global.should.not.have.property('b');
});

it('should restore globals', function() {
  var globals = {setTimeout: 1234};
  setTimeout.should.be.a.Function();
  var result = callWithGlobals(function() {
    return setTimeout;
  }, globals);

  result.should.be.a.Number();
  result.should.equal(1234);
  setTimeout.should.be.a.Function();
});
