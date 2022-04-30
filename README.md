# videojs-google-analytics

Track Google Analytics events from video.js players

## Installation

```sh
npm install --save videojs-google-analytics
```

## Usage

To include videojs-google-analytics on your website or web application, use any of the following methods.

### `<script>` Tag

This is the simplest case. Get the script in whatever way you prefer and include the plugin _after_ you include [video.js][videojs], so that the `videojs` global is available.

```html
<script src="//path/to/video.min.js"></script>
<script src="//path/to/videojs-google-analytics.min.js"></script>
<script>
  var player = videojs('my-video');

  player.googleAnalytics();
</script>
```

### Browserify/CommonJS

When using with Browserify, install videojs-google-analytics via npm and `require` the plugin as you would any other module.

```js
var videojs = require('video.js');

// The actual plugin function is exported by this module, but it is also
// attached to the `Player.prototype`; so, there is no need to assign it
// to a variable.
require('videojs-google-analytics');

var player = videojs('my-video');

player.googleAnalytics();
```

### RequireJS/AMD

When using with RequireJS (or another AMD library), get the script in whatever way you prefer and `require` the plugin as you normally would:

```js
require(['video.js', 'videojs-google-analytics'], function(videojs) {
  var player = videojs('my-video');

  player.googleAnalytics();
});
```

## License

MIT. Copyright (c) Tank.vn &lt;tanvd357@gmail.com&gt;


[videojs]: http://videojs.com/
