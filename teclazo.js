/*
*Teclazo* (**keystorke in spanish**)
Sends key strokes to current tty
*/
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
  if (!string || !string.length) return;
  var tasks = string.split('').map(function (key) {
    return function () {
      // console.log(this);
      Teclazo(key);
      setTimeout(function () {
        var fn = tasks.shift();
        if (typeof(fn) === 'function') fn();
      }, Teclazo.humanKeysPerMS + Math.round(Math.random() * 100));
    };
  });
  tasks.shift()();
};

// Average human keystrokes per milliseconds
Teclazo.humanKeysPerMS = 50;

// Export it!
module.exports = Teclazo;