var _ = require('lodash');
var Path = require('path');
var FS = require('fs');

var UglifyJS = require('uglify-js');
var CleanCSS = require('clean-css');

var Collection = module.exports = function(opts) {
  opts = JSON.parse(JSON.stringify(opts));
  var self = this;
  self.options = opts;
  var outDir = Path.join(self.options.staticDirectory, self.options.outputDirectory);
  if (!FS.existsSync(outDir)) FS.mkdirSync(outDir);
  self.options.basePath = self.options.basePath || '';
  self.options.rootPath = self.options.rootPath || '';
  self.options.files = self.options.files || [];
  self.options.outputFile = self.options.outputFile ||
      Path.join(outDir, self.options.name + '.' + self.options.type)
}

Collection.prototype.compile = function() {
  var self = this;
  var joinOn = self.options.type === 'js' ? ';\n' : '\n';
  var concat = this.options.files.map(function(filename) {
    filename = Path.join(self.options.staticDirectory, self.options.inputDirectory, filename);
    return FS.readFileSync(filename);
  }).join(joinOn);
  if (self.options.minify) {
    if (self.options.type === 'js') {
      concat = UglifyJS.minify(concat, {fromString: true, mangle: false}).code;
    } else if (self.options.type === 'css') {
      concat = new CleanCSS().minify(concat).styles;
    }
  }
  FS.writeFileSync(this.options.outputFile, concat);
}

Collection.prototype.renderFile = function(filename) {
  var self = this;
  if (self.options.cacheID) filename += '?cacheID=' + self.options.cacheID;
  if (self.options.type === 'js') {
    return '<script type="text/javascript" src="' + filename + '"></script>';
  } else if (self.options.type === 'css') {
    return '<link rel="stylesheet" type="text/css" href="' + filename + '">';
  }
}

Collection.prototype.render = function() {
  var self = this;
  var pathBase = Path.join(self.options.rootPath, '/', self.options.basePath);
  if (self.options.useOriginalAssets) {
    return self.options.files.map(function(filename) {
      filename = Path.join(pathBase, self.options.inputDirectory, filename);
      return self.renderFile(filename);
    }).join('\n');
  } else {
    var filename = Path.join(pathBase, self.options.outputDirectory, self.options.name + '.' + self.options.type);
    return self.renderFile(filename);
  }
}
