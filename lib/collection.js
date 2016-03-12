var _ = require('lodash');
var Path = require('path');
var FS = require('fs');

var UglifyJS = require('uglify-js');
var CleanCSS = require('clean-css');

var Collection = module.exports = function(opts) {
  opts = JSON.parse(JSON.stringify(opts));
  var self = this;
  self.options = opts;
  self.options.files = self.options.files || [];
  self.options.outputFile = self.options.outputFile ||
      Path.join(self.options.staticDirectory, self.options.outputDirectory, self.options.name + '.' + self.options.type)
}

Collection.prototype.compile = function() {
  var self = this;
  var concat = this.options.files.map(function(filename) {
    filename = Path.join(self.options.staticDirectory, self.options.inputDirectory, filename);
    return FS.readFileSync(filename);
  }).join('\n');
  if (self.options.minify) {
    if (self.options.type === 'js') {
      concat = UglifyJS.minify(concat, {fromString: true}).code;
    } else if (self.options.type === 'css') {
      concat = new CleanCSS().minify(concat).styles;
    }
  }
  FS.writeFileSync(this.options.outputFile, concat);
}

Collection.prototype.renderFile = function(filename) {
  var self = this;
  if (self.options.type === 'js') {
    return '<script type="text/javascript" src="' + filename + '"></script>';
  } else if (self.options.type === 'css') {
    return '<link rel="stylesheet" type="text/css" href="' + filename + '">';
  }
}

Collection.prototype.render = function() {
  var self = this;
  if (self.options.useOriginalAssets) {
    return self.options.files.map(function(filename) {
      filename = Path.join(self.options.basePath, self.options.inputDirectory, filename);
      return self.renderFile(filename);
    }).join('\n');
  } else {
    var filename = Path.join('/', self.options.basePath, self.options.outputDirectory, self.options.name + '.' + self.options.type);
    return self.renderFile(filename);
  }
}
