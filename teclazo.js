// ### **Teclazo** (_keystorke in spanish_)
// _Sends key strokes to current tty_
var teclazo = require('./build/Release/teclazo');
var __tty;

// `Teclazo(key)` sends a keystroke
var Teclazo = function (key) {
  teclazo.write(key, __tty);
};

// `.tty([newTTY])` gets or sets target tty
Teclazo.tty = function (newTTY) {
  if (newTTY || !__tty) {
    __tty = newTTY || teclazo.tty();
  }
  return newTTY ? Teclazo : __tty;
};

// `.sendCtrlC()` sends the `Ctrl+C` sequence
Teclazo.sendCtrlC = function () {
  Teclazo('\x03');
};

// `.write(string)` writes a whole string
Teclazo.write = function (string) {
  string.split('').forEach(Teclazo);
}

// `.human()` types with a simulated human's latency
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

// `humanKeysPerMS` An integer for average human keystrokes per milliseconds
Teclazo.humanKeysPerMS = 50;

// Export it!
module.exports = Teclazo;
