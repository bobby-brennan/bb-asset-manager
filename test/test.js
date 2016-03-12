var _ = require('lodash');
var FS = require('fs');
var Expect = require('chai').expect;
var AssetMan = require('../index.js');

describe('AssetManager', function() {
  var JS_ASSETS = ['a.js', 'b.js'];
  var CSS_ASSETS = ['a.css', 'b.css'];
  var DEFAULT_OPTS = {
    staticDirectory: __dirname,
    minify: false,
    js: {
      inputDirectory: 'assets/js',
      outputDirectory: 'golden/js',
    },
    css: {
      inputDirectory: 'assets/css',
      outputDirectory: 'golden/css',
    },
  }

  var setup = function(opts) {
    opts = opts || DEFAULT_OPTS;
    var assetMan = new AssetMan(opts);
    assetMan.addAsset('all', {
      js: JS_ASSETS,
      css: CSS_ASSETS,
    })
    assetMan.addJS({
      name: 'reverse',
      files: [JS_ASSETS[1], JS_ASSETS[0]],
    })
    assetMan.addAsset('depend', {
      dependencies: ['all'],
      js: [JS_ASSETS[0]],
      dependents: ['all'],
    });
    return assetMan;
  }

  var getJS = function(filename) {
    return '<script type="text/javascript" src="' + filename  + '"></script>';
  }
  var getCSS = function(filename) {
    return '<link rel="stylesheet" type="text/css" href="' + filename + '">';
  }

  it('should render concatenated assets', function() {
    var assetMan = setup();
    Expect(assetMan.renderJS('all')).to.equal(getJS('/golden/js/all.js'));
    Expect(assetMan.renderJS('reverse')).to.equal(getJS('/golden/js/reverse.js'));
    Expect(assetMan.renderCSS('all')).to.equal(getCSS('/golden/css/all.css'));
  });
  it('should compile', function() {
    var assetMan = setup();
    assetMan.compile();
  });
  it('should compile minified', function() {
    var opts = JSON.parse(JSON.stringify(DEFAULT_OPTS));
    opts.minify = true;
    opts.js.outputDirectory += '_min';
    opts.css.outputDirectory += '_min';
    var assetMan = setup(opts);
    assetMan.compile();
  })
  it('should render original assets', function() {
    var opts = JSON.parse(JSON.stringify(DEFAULT_OPTS));
    opts.useOriginalAssets = true;
    var assetMan = setup(opts);
    Expect(assetMan.renderJS('all')).to.equal(getJS('/assets/js/a.js') + '\n' + getJS('/assets/js/b.js'));
    Expect(assetMan.renderJS('reverse')).to.equal(getJS('/assets/js/b.js') + '\n' + getJS('/assets/js/a.js'));
  });
  it('should allow language override', function() {
    var opts = JSON.parse(JSON.stringify(DEFAULT_OPTS));
    opts.useOriginalAssets = true;
    opts.js.useOriginalAssets = false;
    var assetMan = setup(opts);
    Expect(assetMan.renderJS('all')).to.equal(getJS('/golden/js/all.js'));
    Expect(assetMan.renderCSS('all')).to.equal(getCSS('/assets/css/a.css') + '\n' + getCSS('/assets/css/b.css'));
  });
  it('should allow basePath', function() {
    var opts = JSON.parse(JSON.stringify(DEFAULT_OPTS));
    opts.basePath = '/base';
    var assetMan = setup(opts);
    Expect(assetMan.renderJS('all')).to.equal(getJS('/base/golden/js/all.js'));
    Expect(assetMan.renderCSS('all')).to.equal(getCSS('/base/golden/css/all.css'));
  })
});
