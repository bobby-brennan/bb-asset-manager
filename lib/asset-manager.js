var _ = require('lodash');
var Path = require('path');
var Collection = require('./collection.js');

var TYPES = ['js', 'css'];

var AssMan = module.exports = function(options) {
  this.options = options;
  if (this.options.concatenate === undefined) this.options.concatenate = true;
  TYPES.forEach(function(type) {
    options[type] = options[type] || {};
    options[type].inputDirectory = options[type].inputDirectory || '';
    options[type].outputDirectory = options[type].outputDirectory || '';
    options[type].staticDirectory = options[type].staticDirectory || options.staticDirectory;
    if (options[type].concatenate === undefined) {
      options[type].concatenate = options.concatenate;
    }
  });

  this.js = {};
  this.css = {};
}

AssMan.prototype.addJS = function(opts) {
  this.js[opts.name] = new Collection(_.extend({}, {type: 'js'}, this.options.js, opts));
}

AssMan.prototype.addCSS = function(opts) {
  this.css[opts.name] = new Collection(_.extend({}, {type: 'css'}, this.options.css, opts));
}

AssMan.prototype.compile = function(callback) {
  if (!callback) return this.compileSync();
  else return this.compileAsync(callback);
}

AssMan.prototype.compileSync = function() {
  var self = this;
  ['js', 'css'].forEach(function(type) {
    for (var name in self[type]) {
      self[type][name].compile();
    }
  });
}

AssMan.prototype.compileAsync = function() {throw new Error("Not implemented")}

TYPES.forEach(function(type) {
  AssMan.prototype['render' + type.toUpperCase()] = function(names) {
    var self = this;
    if (typeof names === 'string') names = [names];
    return names.map(function(name) {
      return self[type][name].render();
    }).join('\n');
  }
});

