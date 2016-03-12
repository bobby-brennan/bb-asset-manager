# bb-asset-manager
Yet another asset manager for NodeJS.

This package allows you to declare a directory that will be served statically on your webserver.
You can then package files in that directory together into concatenated and minified assets
which can be easily included in your HTML. You can also easily switch between using raw and minified
assets e.g. for easier debugging in development.

## Basic Usage
```js
  var AssetMan = require('bb-asset-manager');
  var assetMan = new AssetMan({
    staticDirectory: __dirname + '/static', // Where your static assets live
    outputDirectory: '/minified',           // Relative to staticDirectory
  });
  assetMan.addAsset('bootstrap', {
    js:  ['bower_components/bootstrap/bootstrap.js'],
    css: ['bower_components/bootstrap/bootstrap.css'],
  });

  assetMan.addAsset('home', {
    css: ['css/home.css'],
    dependencies: ['bootstrap'],
  })
  
  assetMan.compileSync();
  
  console.log(assetMan.renderAsset('home'))
```

Will output

```html
<link rel="stylesheet" type="text/css" href="/minified/css/home.css">
<script type="text/javascript" src="/minified/js/home.js"></script>
```

## Advanced Usage
See [Advanced Usage](AdvancedUsage.md) for details on controlling minification,
concatenation, and file ordering.


## Contributions
Contributions are welcome! I'll try to respond to PRs within 24 hours.

## TODO
* Add a build process for e.g. ES6 and CoffeScript transpiling
* Expose Express middleware for auto-recompiling in development
