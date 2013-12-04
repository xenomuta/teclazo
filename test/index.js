var teclazo = require('../.');
var assert = require('assert');
var stdin = process.stdin;
stdin.setRawMode(true);

describe('Teclazo', function () {
  describe('teclazo(key)', function () {
    it('should send the expected key', function (done) {
      var callback = function (key) {
        stdin.removeListener('data', callback);
        assert.equal(key.toString(), 'X');
        done();
      }
      stdin.on('data', callback);
      teclazo('X');
    });
  });
  describe('teclazo.sendCtrlC()', function () {
    it('should send the Ctrl+C (\\x03) sequence', function (done) {
      var callback = function (key) {
        stdin.removeListener('data', callback);
        assert.equal(key[0], 0x03);
        done();
      }
      stdin.on('data', callback);
      teclazo.sendCtrlC();
    });
  });
  describe('teclazo.human(string)', function () {
    this.timeout(5000);
    it('should write a string as slow as a human (≥' + teclazo.humanKeysPerMS + ' keys/ms)', function (done) {
      var kpms = teclazo.humanKeysPerMS;
      var lastKeyTime = Date.now();
      var callback = function (data) {
        key = data.toString('utf8');
        process.stdout.write(key);
        if (key === '\r') {
          stdin.removeListener('data', callback);
          assert.ok('keyrate >= ' + kpms + 'ms');
          return done();
        }
        var now = Date.now();
        if (now - lastKeyTime < kpms) {
          assert.fail((now - lastKeyTime) + 'ms', '>= ' + kpms + 'ms');
          return done();
        }
        lastKeyTime = now;
      }
      stdin.on('data', callback);
      setTimeout(function () {
        teclazo.human('Hola!!\r');
      }, kpms);
    });
  });
});
