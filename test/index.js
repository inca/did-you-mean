'use strict';

var assert = require('assert')
  , Matcher = require('../lib/index');

describe('Matcher', function() {

  it('should accept options', function() {
    var m = new Matcher({
      values: ['one', 'two', 'three', 'four', 'five'],
      threshold: 5,
      caseSensitive: true
    });
    assert.equal(m.values.length, 5);
    assert.equal(m.threshold, 5);
    assert.equal(m.caseSensitive, true);
  });

  it('should parse values from string', function() {
    var m = new Matcher({
      values: 'one two three four five'
    });
    assert.equal(m.values.length, 5);
  });

  it('should accept strings instead of options', function() {
    var m = new Matcher('one two three four five');
    assert.equal(m.values.length, 5);
  });

  it('should accept arrays instead of options', function() {
    var m = new Matcher(['one', 'two', 'three', 'four', 'five']);
    assert.equal(m.values.length, 5);
  });

  it('should work with empty dictionary', function() {
    var m = new Matcher();
    assert.equal(m.list('whatever').length, 0);
    assert.equal(m.get('whatever'), null);
  });

  it('should list case-insensitively', function() {
    var list = new Matcher('init install update upgrade')
      .list('UDPDATE');
    assert.equal(list[0].value, 'update');
    assert.equal(list[0].distance, 1);
    assert.equal(list.length, 1);
  });

  it('should list case-sensitively', function() {
    var list = new Matcher('init install update upgrade')
      .matchCase()
      .list('UDPDATE');
    assert.equal(list.length, 0);
  });

  it('should get case-insensitively', function() {
    assert.equal(new Matcher('init install update upgrade').get('UDPDATE'), 'update');
  });

  it('should get case-sensitively', function() {
    assert.equal(new Matcher('init install update upgrade')
      .matchCase().get('UDPDATE'), null);
  });

  it('should list more results with increased threshold', function() {
    var list = new Matcher('upgrade updude update uptrack')
      .setThreshold(4)
      .matchCase()
      .list('uDpDate');
    assert.equal(list.length, 3);
  });

  it('should get a closest result', function() {
    assert.equal(new Matcher('upgrade updude update uptrack')
      .setThreshold(5)
      .matchCase().get('uDpDate'), 'update');
  });

});