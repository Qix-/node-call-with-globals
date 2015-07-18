'use strict';

module.exports = function callWithGlobals(fn, globals) {
  var args = Array.prototype.slice.call(arguments, 2);

  var originalGlobals = {};
  try {
    for (var k in globals) {
      if (globals.hasOwnProperty(k)) {
        originalGlobals[k] = global[k];
        global[k] = globals[k];
      }
    }
    return fn.apply(this, args);
  } finally {
    for (var k in originalGlobals) {
      if (originalGlobals.hasOwnProperty(k)) {
        var val = originalGlobals[k];
        if (val === undefined) {
          delete global[k];
        } else {
          global[k] = val;
        }
      }
    }
  }
};
