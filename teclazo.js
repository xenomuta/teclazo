// ### **Teclazo** (_keystorke in spanish_)
// _Sends key strokes to current tty_
var teclazo = require('./build/Release/teclazo');

// Send a keystroke
var Teclazo = function (key) {
  teclazo(key);
};

// Send the `Ctrl+C` sequence
Teclazo.sendCtrlC = function () {
  Teclazo('\x03');
};

// Simulate a human with delayed keys
Teclazo.human = function (string) {
  // Must have at least one byte
  if (!string || !string.length) return;
  // Split string in characters
  var tasks = string.split('').map(function (key) {
    return function () {
      // Send it...
      Teclazo(key);
      setTimeout(function () {
        var fn = tasks.shift();
        if (typeof(fn) === 'function') fn();
      // Use random delays to mimic a human-being.
      }, Teclazo.humanKeysPerMS + Math.round(Math.random() * 100));
    };
  });
  tasks.shift()();
};

// Average human keystrokes per milliseconds
Teclazo.humanKeysPerMS = 50;

// Export it!
module.exports = Teclazo;
