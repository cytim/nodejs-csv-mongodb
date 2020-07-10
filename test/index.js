const assert = require('chai').assert;

const csvMongodb = require('..');

describe('Hello World', function () {
  it('says "Hello World!"', function () {
    assert.equal(csvMongodb, 'Hello World!');
  });
});
