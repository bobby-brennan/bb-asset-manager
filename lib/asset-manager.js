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

AssMan.prototype.addAsset = function(name, opts) {
  this.addJS(name, _.extend({files: opts.js}, opts));
  this.addCSS(name, _.extend({files: opts.css}, opts));
}

AssMan.prototype.addJS = function(name, opts) {
  this.addAssetType(name, opts, 'js')
}

AssMan.prototype.addCSS = function(name, opts) {
  this.addAssetType(name, opts, 'css')
}

AssMan.prototype.addAssetType = function(name, opts, type) {
  var self = this;
  if (!opts) {
    opts = name;
    name = opts.name;
  }
  if (!name) throw new Error("You must specify a name");
  opts.name = name;
  var colOpts = _.extend({}, {type: type}, this.options[type], opts);
  var files = [];
  function addDep(dep) {
    if (self[type][dep]) files = files.concat(self[type][dep].options.files || []);
  }
  (colOpts.dependencies || []).forEach(addDep);
  files = files.concat(colOpts.files || []);
  (colOpts.dependents || []).forEach(addDep);
  colOpts.files = files;
  self[type][opts.name] = new Collection(colOpts);
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

