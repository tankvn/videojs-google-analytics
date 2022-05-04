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
<head>
  ...
  <script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    window.gtag =  function() { dataLayer.push(arguments); }
    window.gtag('js', new Date());

    window.gtag('config', 'GA_TRACKING_ID');
  </script>
</head>
<body>
  ...
<script src="//path/to/video.min.js"></script>
<script src="//path/to/videojs-google-analytics.min.js"></script>
<script>
  var player = videojs('my-video');

  player.googleAnalytics({
    events: {
      name: 'VIDEO NAME',
      category: 'Video Category Demo'
    }
  });
</script>
</body>
```

### Available options

#### Google Analytics

There are two options you can pass to the plugin. The first is to configure which events you would like to trigger from videojs.
This option is an array objects for each event.  Each event contains the name of the event triggered by Video.js and a label and action which will be sent to Google Analytics.  Choose from the list below:

```javascript
player.analytics({
  events: {
      name: 'VIDEO NAME',
      category: 'Video Category Demo'
  }
})
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
