var _ = require('lodash');
var Path = require('path');
var FS = require('fs');
var Collection = require('./collection.js');

var TYPES = ['css', 'js'];
var COPY_OPTIONS = ['minify', 'useOriginalAssets', 'basePath'];

var AssetMan = module.exports = function(options) {
  options = JSON.parse(JSON.stringify(options));
  this.options = options;
  this.options.basePath = this.options.basePath || '/';
  this.options.inputDirectory = this.options.inputDirectory || '';
  this.options.outputDirectory = this.options.outputDirectory || 'minified';
  var outDir = Path.join(this.options.staticDirectory, this.options.outputDirectory);
  if (!FS.existsSync(outDir)) FS.mkdirSync(outDir);
  this.js = {};
  this.css = {};
  TYPES.forEach(function(type) {
    options[type] = options[type] || {};
    options[type].staticDirectory = options[type].staticDirectory || options.staticDirectory;
    options[type].inputDirectory = options[type].inputDirectory || '';
    options[type].outputDirectory = options[type].outputDirectory || options.outputDirectory + '/' + type;
    COPY_OPTIONS.forEach(function(opt) {
      if (options[type][opt] === undefined) {
        options[type][opt] = options[opt];
      }
    })
  });
}

AssetMan.prototype.addAsset = function(name, opts) {
  this.addJS(name, _.extend({files: opts.js}, opts));
  this.addCSS(name, _.extend({files: opts.css}, opts));
}

AssetMan.prototype.addJS = function(name, opts) {
  this.addAssetType(name, opts, 'js')
}

AssetMan.prototype.addCSS = function(name, opts) {
  this.addAssetType(name, opts, 'css')
}

AssetMan.prototype.addAssetType = function(name, opts, type) {
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

AssetMan.prototype.compile = function(callback) {
  if (!callback) return this.compileSync();
  else return this.compileAsync(callback);
}

AssetMan.prototype.compileSync = function() {
  var self = this;
  ['js', 'css'].forEach(function(type) {
    for (var name in self[type]) {
      self[type][name].compile();
    }
  });
}

AssetMan.prototype.compileAsync = function() {throw new Error("Not implemented")}

TYPES.forEach(function(type) {
  AssetMan.prototype['render' + type.toUpperCase()] = function(names) {
    var self = this;
    if (typeof names === 'string') names = [names];
    return names.map(function(name) {
      return self[type][name].render();
    }).join('\n');
  }
});

AssetMan.prototype.renderAsset = function(names) {
  this.renderCSS(names);
  this.renderJS(names);
}

