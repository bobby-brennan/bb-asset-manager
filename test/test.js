var _ = require('lodash');
var FS = require('fs');
var Expect = require('chai').expect;
var AssMan = require('../index.js');

describe('AssetManager', function() {
  var assman = null;

  var JS_ASSETS = ['foo.js', 'bar.js'];
  var CSS_ASSETS = ['a.css', 'b.css'];

  var setup = function(opts) {
    opts = opts || {};
    assman = new AssMan(_.extend(opts, {
      staticDirectory: __dirname,
      js: {
        inputDirectory: 'assets/js',
        outputDirectory: 'golden/js',
      },
      css: {
        inputDirectory: 'assets/css',
        outputDirectory: 'golden/css',
      },
    }));
    assman.addJS({
      name: 'all',
      files: JS_ASSETS,
    });
    assman.addCSS({
      name: 'all',
      files: CSS_ASSETS,
    });
    assman.addJS({
      name: 'reverse',
      files: [JS_ASSETS[1], JS_ASSETS[0]],
    })
    assman.addJS({
      name: 'foo',
      files: ['foo.js'],
    });
    assman.addCSS({
      name: 'b',
      files: ['b.css'],
    });
  }

  var getJS = function(filename) {
    return '<script type="text/javascript" src="' + filename  + '"></script>';
  }
  var getCSS = function(filename) {
    return '<link rel="stylesheet" type="text/css" href="' + filename + '">';
  }

  it('should render concatenated assets', function() {
    setup();
    Expect(assman.renderJS('all')).to.equal(getJS('/golden/js/all.js'));
    Expect(assman.renderJS('foo')).to.equal(getJS('/golden/js/foo.js'));
    Expect(assman.renderJS('reverse')).to.equal(getJS('/golden/js/reverse.js'));
    Expect(assman.renderCSS('all')).to.equal(getCSS('/golden/css/all.css'));
    Expect(assman.renderCSS('b')).to.equal(getCSS('/golden/css/b.css'));
  });
  it('should render individual assets', function() {
    setup({
      concatenate: false,
    });
    Expect(assman.renderJS('all')).to.equal(getJS('/assets/js/foo.js') + '\n' + getJS('/assets/js/bar.js'));
    Expect(assman.renderJS('foo')).to.equal(getJS('/assets/js/foo.js'));
    Expect(assman.renderJS('reverse')).to.equal(getJS('/assets/js/bar.js') + '\n' + getJS('/assets/js/foo.js'));
    Expect(assman.renderCSS('all')).to.equal(getCSS('/assets/css/a.css') + '\n' + getCSS('/assets/css/b.css'));
    Expect(assman.renderCSS('b')).to.equal(getCSS('/assets/css/b.css'));
  })
});
