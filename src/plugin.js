import videojs from 'video.js';
import {version as VERSION} from '../package.json';

// Default options for the plugin.
const defaults = {
  events: [],
  assetName: 'Video',
  defaultVideoCategory: 'Video',
  defaultAudioCategory: 'Audio'
};

// Cross-compatibility for Video.js 5 and 6.
const registerPlugin = videojs.registerPlugin || videojs.plugin;
// const dom = videojs.dom || videojs;

/**
 * Function to invoke when the player is ready.
 *
 * This is a great place for your plugin to initialize itself. When this
 * function is called, the player will have its DOM and child components
 * in place.
 *
 * @function onPlayerReady
 * @param    {Player} player
 *           A Video.js player object.
 *
 * @param    {Object} [options={}]
 *           A plain object containing options for the plugin.
 */
const onPlayerReady = (player, options) => {
  player.addClass('vjs-google-analytics');

  const GA_VIDEO_NAME = "ga_video_name";
  const GA_VIDEO_CATEGORY = "ga_video_category";
  const GA_VIDEO_ELAPSED = "ga_video_elapsed";
  const GA_VIDEO_DURATION = "ga_video_duration";
  const GA_VIDEO_PERCENT = "ga_video_percent";

  function formatSeconds(seconds) {
    const result = new Date(seconds * 1000).toISOString().slice(11, 19);
    return result;
  }

  function track(player, action, category) {
    let elapsed = Math.round(player.currentTime());
    let duration = Math.round(player.duration());
    let percent = Math.round(elapsed / duration * 100) + '%';

    // console.log('action:', action, category, formatSeconds( elapsed ), formatSeconds( duration ), percent);
    localStorage.setItem(GA_VIDEO_NAME, action);
    localStorage.setItem(GA_VIDEO_CATEGORY, category);
    localStorage.setItem(GA_VIDEO_ELAPSED, formatSeconds( elapsed ));
    localStorage.setItem(GA_VIDEO_DURATION, formatSeconds( duration ));
    localStorage.setItem(GA_VIDEO_PERCENT, percent);
  }

  function onLoadStart() {
    let action = localStorage.getItem(GA_VIDEO_NAME);
    let category = localStorage.getItem(GA_VIDEO_CATEGORY);
    let elapsed = localStorage.getItem(GA_VIDEO_ELAPSED);
    let duration = localStorage.getItem(GA_VIDEO_DURATION);
    let percent = localStorage.getItem(GA_VIDEO_PERCENT);

    if(action != null && category != null && elapsed != null && duration != null && percent != null) {
      gtag('event', action, {
        'event_category': category,
        'view': 1,
        'time': elapsed,
        'duration': duration,
        'percentage': percent
      });
      localStorage.clear();
      //console.log('track:', action, category, elapsed, duration, percent);
    }
  }


  // Set up the custom event tracking that won't use handleEvents

  const events = options.events;

  player.on('loadeddata', function(evt) {
    onLoadStart();
  });

  player.on('timeupdate', function() {
    track(player, events.name, events.category);
  });

};

/**
 * A video.js plugin.
 *
 * In the plugin function, the value of `this` is a video.js `Player`
 * instance. You cannot rely on the player being in a "ready" state here,
 * depending on how the plugin is invoked. This may or may not be important
 * to you; if not, remove the wait for "ready"!
 *
 * @function googleAnalytics
 * @param    {Object} [options={}]
 *           An object of options left to the plugin author to define.
 */
const googleAnalytics = function(options) {
  this.ready(() => {
    onPlayerReady(this, videojs.mergeOptions(defaults, options));
  });
};

// Register the plugin with video.js.
registerPlugin('googleAnalytics', googleAnalytics);

// Include the version number.
googleAnalytics.VERSION = VERSION;

export default googleAnalytics;
