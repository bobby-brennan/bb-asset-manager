var _ = require('lodash');
var Path = require('path');
var Collection = require('./collection.js');

var TYPES = ['js', 'css'];
var COPY_OPTIONS = ['minify', 'useOriginalAssets', 'basePath'];

var AssMan = module.exports = function(options) {
  options = JSON.parse(JSON.stringify(options));
  this.options = options;
  this.options.basePath = this.options.basePath || '/';
  this.js = {};
  this.css = {};
  TYPES.forEach(function(type) {
    options[type] = options[type] || {};
    options[type].inputDirectory = options[type].inputDirectory || '';
    options[type].outputDirectory = options[type].outputDirectory || '';
    options[type].staticDirectory = options[type].staticDirectory || options.staticDirectory;
    COPY_OPTIONS.forEach(function(opt) {
      if (options[type][opt] === undefined) {
        options[type][opt] = options[opt];
      }
    })
  });
}

AssMan.prototype.addJS = function(name, opts) {
  if (!opts) {
    opts = name;
    name = opts.name;
  }
  if (!name) throw new Error("You must specify a name");
  opts.name = name;
  this.js[opts.name] = new Collection(_.extend({}, {type: 'js'}, this.options.js, opts));
}

AssMan.prototype.addCSS = function(name, opts) {
  if (!opts) {
    opts = name;
    name = opts.name;
  }
  if (!name) throw new Error("You must specify a name");
  opts.name = name;
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

