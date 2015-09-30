var Path = require('path');

var Collection = module.exports = function(opts) {
  this.options = opts;
}

Collection.prototype.compile = function() {
}

Collection.prototype.render = function() {
  var self = this;
  var filename = Path.join('/', self.options.inputDirectory, self.options.name + '.' + self.options.type);
  if (self.options.type === 'js') {
    return '<script type="text/javascript" src="' + filename + '"></script>';
  } else if (self.options.type === 'css') {
    return '<link rel="stylesheet" type="text/css" href="' + filename + '">';
  }
}
