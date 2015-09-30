var FS = require('fs');
var Expect = require('chai').expect;
var AssMan = require('../index.js');

describe('AssetManager', function() {
  var assman = null;

  var JS_ASSETS = ['foo.js', 'bar.js'];
  var CSS_ASSETS = ['a.css', 'b.css'];

  before(function() {
    assman = new AssMan({
      staticDirectory: __dirname,
      js: {
        inputDirectory: 'assets/js',
        outputDirectory: 'golden/js',
      },
      css: {
        inputDirectory: 'assets/css',
        outputDirectory: 'golden/css',
      },
    });
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
    })
  })

  it('should render compiled JS assets', function() {
    Expect(assman.renderJS('all')).to.equal('<script type="text/javascript" src="/assets/js/all.js"></script>');
    Expect(assman.renderJS('foo')).to.equal('<script type="text/javascript" src="/assets/js/foo.js"></script>');
    Expect(assman.renderJS('reverse')).to.equal('<script type="text/javascript" src="/assets/js/reverse.js"></script>');
  });
  it('should render compiled CSS assets', function() {
    Expect(assman.renderCSS('all')).to.equal('<link rel="stylesheet" type="text/css" href="/assets/css/all.css">');
    Expect(assman.renderCSS('b')).to.equal('<link rel="stylesheet" type="text/css" href="/assets/css/b.css">');
  });
  it('should compile', function() {
    assman.compile();
  })
});
