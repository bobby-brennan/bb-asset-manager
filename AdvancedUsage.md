# Advanced Usage

## Top-Level Options
These options can be set by calling `new AssetMan(opts)`.

* `basePath` - the prefix to add to URLs in `<script>` and `<style>` tags
* `staticDirectory` - the directory that contains your static assets
* `inputDirectory` - relative to `staticDirectory`, where your raw assets live
* `outputDirectory` - relative to `staticDirectory`, where AssetManager will put your compiled assets
* `useOriginalAssets` (default false) - `renderAsset()` will print `<script>` and `<style>` tags that point to
input files rather than the minified assets

## Asset Options
These options can be set by calling `assetMan.addAsset(name, opts)`

Top-level options can also be overridden at the asset level.

* `js` - an array of JavaScript files, relative to `inputDirectory`
* `css` - an array of CSS files, relative to `outputDirectory`
* `dependencies` - an array of other asset names that need to be loaded **before** this asset
* `dependents` - an array of other asset names that need to be loaded **after** this asset

```js
var AssetMan = require('bb-asset-manager');
var assetMan = new AssetMan({
  staticDirectory: __dirname + '/static', // Where your static assets live
  basePath: '/static_assets',             // Relative to your server root
  outputDirectory: '/minified',           // Relative to staticDirectory
  useOriginalAssets: process.env.DEVELOPMENT,
});
assetMan.addAsset('bootstrap', {
  js: ['bower_components/bootstrap/bootstrap.js']
  css: ['bower_components/bootstrap/bootstrap.css']
});
assetMan.addAsset('widget', {
  js: ['js/widget.js'],
  css: ['css/widget.css'],
})
assetMan.addAsset('home', {
  dependencies: ['bootstrap'],
  js: ['js/app.js'],
  css: ['css/home.css'],
  dependents: ['widget'],
})

assetMan.compileSync();

var app = require('express')();
App.set('view engine', 'jade');
App.engine('jade', require('jade').__express);

var ejs = require('ejs');

app.get('/home', function(req, res) {
  res.render('home', {assetMan: assetMan});
})

app.listen(3000);
```

```jade
doctype html
html
  head
    | !{assetManager.renderAsset('home')}
  body(ng-app="App")
    h1 Hello World!
```
