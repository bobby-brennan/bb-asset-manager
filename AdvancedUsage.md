# Advanced Usage

## Options
Options can be set by calling `new AssetMan(opts)`. They can also be passed to `addAsset(opts)` to
override values set at the top level.

* `basePath` - the prefix to add to URLs in `<script>` and `<style>` tags
* `staticDirectory` - the directory that contains your static assets
* `inputDirectory` - relative to `staticDirectory`, where your raw assets live
* `outputDirectory` - relative to `staticDirectory`, where AssetManager will put your compiled assets
* `useOriginalAssets` (default false) - `renderAsset()` will print `<script>` and `<style>` tags that point to
input files rather than the minified assets


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
assetMan.addAsset('home', {
  css: ['css/home.css'],
  dependencies: ['bootstrap'],
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
