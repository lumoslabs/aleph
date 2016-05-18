// Underscore-contrib (underscore.util.existential.js 0.3.0)
// (c) 2013 Michael Fogus, DocumentCloud and Investigative Reporters & Editors
// Underscore-contrib may be freely distributed under the MIT license.

_.mixin({
  exists: function(x) { return x != null; },
  truthy: function(x) { return (x !== false) && _.exists(x); },
  falsey: function(x) { return !_.truthy(x); },
  not:    function(b) { return !b; },
  firstExisting: function() {
    for (var i = 0; i < arguments.length; i++) {
      if (arguments[i] != null) return arguments[i];
    }
  }
});
