var _ = require('lodash');
var FS = require('fs');
var Expect = require('chai').expect;
var AssetMan = require('../index.js');

describe('AssetManager', function() {
  var JS_ASSETS = ['a.js', 'b.js'];
  var CSS_ASSETS = ['a.css', 'b.css'];
  var defaultOpts = function(overrides) {
    var opts = {
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
    return _.extend(opts, overrides || {});
  }

  var setup = function(opts) {
    opts = defaultOpts(opts);
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
    Expect(assetMan.getJSTags('all')).to.equal(getJS('/golden/js/all.js'));
    Expect(assetMan.getJSTags('reverse')).to.equal(getJS('/golden/js/reverse.js'));
    Expect(assetMan.getCSSTags('all')).to.equal(getCSS('/golden/css/all.css'));
  });
  it('should render all tags', function() {
    var assetMan = setup();
    Expect(assetMan.getAssetTags('all')).to.equal(
      getCSS('/golden/css/all.css') + getJS('/golden/js/all.js'));
  });
  if('should render cacheID', function() {
    var assetMan = setup({cacheID: 3});
    Expect(assetMan.getAssetTags('all')).to.equal(
      getCSS('/golden/css/all.css?cacheID=3') + getJS('/golden/js/all.js?cacheID=3'));
  })
  it('should compile', function() {
    var assetMan = setup();
    assetMan.compile();
  });
  it('should compile minified', function() {
    var opts = defaultOpts({minify: true});
    opts.js.outputDirectory += '_min';
    opts.css.outputDirectory += '_min';
    var assetMan = setup(opts);
    assetMan.compile();
  })
  it('should render original assets', function() {
    var assetMan = setup({useOriginalAssets: true});
    Expect(assetMan.getJSTags('all')).to.equal(getJS('/assets/js/a.js') + '\n' + getJS('/assets/js/b.js'));
    Expect(assetMan.getJSTags('reverse')).to.equal(getJS('/assets/js/b.js') + '\n' + getJS('/assets/js/a.js'));
  });
  it('should allow language override', function() {
    var opts = defaultOpts({
      useOriginalAssets: true,
    });
    opts.js.useOriginalAssets = false;
    var assetMan = setup(opts);
    Expect(assetMan.getJSTags('all')).to.equal(getJS('/golden/js/all.js'));
    Expect(assetMan.getCSSTags('all')).to.equal(getCSS('/assets/css/a.css') + '\n' + getCSS('/assets/css/b.css'));
  });
  it('should allow basePath', function() {
    var assetMan = setup({basePath: '/base'});
    Expect(assetMan.getJSTags('all')).to.equal(getJS('/base/golden/js/all.js'));
    Expect(assetMan.getCSSTags('all')).to.equal(getCSS('/base/golden/css/all.css'));
  })
});
