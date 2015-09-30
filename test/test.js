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
      name: 'home',
      files: ['foo.js', 'bar.js'],
    });
    assman.addCSS({
      name: 'home',
      files: ['a.css', 'b.css'],
    });
    assman.compile();
  })

  it('should combine JS assets', function() {
    Expect(assman.renderJS('home')).to.equal('<script type="text/javascript" src="/assets/js/home.js"></script>');
  });
  it('should combine CSS assets', function() {
    Expect(assman.renderCSS('home')).to.equal('<link rel="stylesheet" type="text/css" href="/assets/css/home.css">');
  });
});
