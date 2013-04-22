var EventEmitter = require('events').EventEmitter
  , _ = require('./utils')
  , inherits = require('util').inherits
  ;

var SocialBase = module.exports = function () {
  this.collection = [];
  this.init.apply(this, arguments);
};
inherits(SocialBase, EventEmitter);

SocialBase.extend = function (protoProps, staticProps) {
  var parent = this;
  var child;

  // The constructor function for the new subclass is either defined by you
  // (the "constructor" property in your `extend` definition), or defaulted
  // by us to simply call the parent's constructor.
  if (protoProps && _.has(protoProps, 'constructor')) {
    child = protoProps.constructor;
  } else {
    child = function(){ return parent.apply(this, arguments); };
  }

  // Add static properties to the constructor function, if supplied.
  _.extend(child, parent, staticProps);

  // Set the prototype chain to inherit from `parent`, without calling
  // `parent`'s constructor function.
  var Surrogate = function(){ this.constructor = child; };
  Surrogate.prototype = parent.prototype;
  child.prototype = new Surrogate;

  // Add prototype properties (instance properties) to the subclass,
  // if supplied.
  if (protoProps) _.extend(child.prototype, protoProps);

  // Set a convenience property in case the parent's prototype is needed
  // later.
  child.__super__ = parent.prototype;

  return child;
};

var defaultAjaxSettings = {
    dataType: 'jsonp'
};

SocialBase.fetch = function (options) {
  return $.ajax(options);
};

var root = window;

_.extend(SocialBase.prototype, {

  init: function (ident) { 
    this.ident = ident;

    this.$ = root.jQuery || root.Zepto || root.ender || root.$;

    if (!this.$) throw "jQuery, Zepto or Ender is required to use SocialFeed.";
  }
  
  , fetch: function (options) {
    options = options ? _.clone(options) : {};

    var url = _.result(this, 'url')
      , module = this
      , success = options.success
      ;

    options.url = url;
    options.success = function(resp) {
      var parsed = module.parse(resp);

      module.collection = parsed;
      if (success) success(module, parsed, options);
      module.emit('fetched', module, parsed, options);
    };

    var error = options.error;
    options.error = function(resp) {
      if (error) error(module, resp, options);
      module.emit('error', module, resp, options);
    };

    return SocialBase.fetch(_.extend(defaultAjaxSettings, options));
  }

  , parse: function (resp) { 
    return resp;
  }

  , orderBy: function (item) {  }

  , render: function (item) {  }

});