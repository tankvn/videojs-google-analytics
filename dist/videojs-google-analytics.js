/*! @name videojs-google-analytics @version 2.0.0 @license MIT */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('video.js')) :
  typeof define === 'function' && define.amd ? define(['video.js'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.videojsGoogleAnalytics = factory(global.videojs));
}(this, (function (videojs) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var videojs__default = /*#__PURE__*/_interopDefaultLegacy(videojs);

  var version = "2.0.0";

  var defaults = {
    events: [],
    assetName: 'Video',
    defaultVideoCategory: 'Video',
    defaultAudioCategory: 'Audio'
  }; // Cross-compatibility for Video.js 5 and 6.

  var registerPlugin = videojs__default['default'].registerPlugin || videojs__default['default'].plugin; // const dom = videojs.dom || videojs;

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

  var onPlayerReady = function onPlayerReady(player, options) {
    player.addClass('vjs-google-analytics');
    var GA_VIDEO_NAME = "ga_video_name";
    var GA_VIDEO_CATEGORY = "ga_video_category";
    var GA_VIDEO_ELAPSED = "ga_video_elapsed";
    var GA_VIDEO_DURATION = "ga_video_duration";
    var GA_VIDEO_PERCENT = "ga_video_percent";

    function formatSeconds(seconds) {
      var result = new Date(seconds * 1000).toISOString().slice(11, 19);
      return result;
    }

    function track(player, action, category) {
      var elapsed = Math.round(player.currentTime());
      var duration = Math.round(player.duration());
      var percent = Math.round(elapsed / duration * 100) + '%'; // console.log('action:', action, category, formatSeconds( elapsed ), formatSeconds( duration ), percent);

      localStorage.setItem(GA_VIDEO_NAME, action);
      localStorage.setItem(GA_VIDEO_CATEGORY, category);
      localStorage.setItem(GA_VIDEO_ELAPSED, formatSeconds(elapsed));
      localStorage.setItem(GA_VIDEO_DURATION, formatSeconds(duration));
      localStorage.setItem(GA_VIDEO_PERCENT, percent);
    }

    function onLoadStart() {
      var action = localStorage.getItem(GA_VIDEO_NAME);
      var category = localStorage.getItem(GA_VIDEO_CATEGORY);
      var elapsed = localStorage.getItem(GA_VIDEO_ELAPSED);
      var duration = localStorage.getItem(GA_VIDEO_DURATION);
      var percent = localStorage.getItem(GA_VIDEO_PERCENT);

      if (action != null && category != null && elapsed != null && duration != null && percent != null) {
        gtag('event', action, {
          'event_category': category,
          'view': 1,
          'time': elapsed,
          'duration': duration,
          'percentage': percent
        });
        localStorage.clear(); //console.log('track:', action, category, elapsed, duration, percent);
      }
    } // Set up the custom event tracking that won't use handleEvents


    var events = options.events;
    player.on('loadeddata', function (evt) {
      onLoadStart();
    });
    player.on('timeupdate', function () {
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


  var googleAnalytics = function googleAnalytics(options) {
    var _this = this;

    this.ready(function () {
      onPlayerReady(_this, videojs__default['default'].mergeOptions(defaults, options));
    });
  }; // Register the plugin with video.js.


  registerPlugin('googleAnalytics', googleAnalytics); // Include the version number.

  googleAnalytics.VERSION = version;

  return googleAnalytics;

})));
