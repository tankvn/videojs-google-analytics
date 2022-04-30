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

  let hasBeenTriggered = false;
  let loadstart = 0;
  let loadend = 0;
  let secondsToLoad = 0;
  let progress = {
    quarter: false,
    half: false,
    threeQuarters: false
  };

  function track(player, action, label, value) {
    let category = options.defaultVideoCategory;

    if (player.isAudio()) {
      category = options.defaultAudioCategory;
    }

    if (!label) {
      label = '';
    }
    gtag('event', action, {
      'event_category': category,
      'event_label': label,
      'value': value
    });
  }

  function onPlaying(player, event) {
    if (!hasBeenTriggered) {
      hasBeenTriggered = true;
      track(player, event.action, event.label, secondsToLoad.toFixed(3));
    }
  }

  function ended(player, event) {
    track(player, event.action, event.label);
    reset();
  }

  function timeupdate(player, event) {
    let elapsed = Math.round(player.currentTime());
    let duration = Math.round(player.duration());
    let percent = Math.round(elapsed / duration * 100);

    if (!progress.quarter && percent > 25) {
      track(player, event.action, 'Complete 25%');
      progress.quarter = true;
    }

    if (!progress.half && percent > 50) {
      track(player, event.action, 'Complete 50%');
      progress.half = true;
    }

    if (!progress.threeQuarters && percent > 75) {
      track(player, event.action, 'Complete 75%');
      progress.threeQuarters = true;
    }
  }

  function watchtime(player, event) {
    let elapsed = Math.round(player.currentTime());
    track(player, event.action, event.label, elapsed);
  }

  function getEvent(eventName) {
    return options.events.filter(function(event) {
      return event.name === eventName;
    })[0];
  }

  function reset() {
    hasBeenTriggered = false;
    loadstart = 0;
    loadend = 0;
    secondsToLoad = 0;
  }

  function onLoadStart() {
    reset();
    loadstart = new Date();
  }

  function onLoadedData() {
    loadend = new Date();
    secondsToLoad = ((loadend - loadstart) / 1000);
  }

  // Set up the custom event tracking that won't use handleEvents

  const eventNames = options.events.map(function(event) {
    return event.name || event;
  });

  if (eventNames.indexOf('firstplay') > -1) {
    const playEvent = getEvent('firstplay');

    player.one('dispose', function() {
      reset();
    });
    player.one('loadstart', function() {
      onLoadStart();
    });
    player.one('loadeddata', function() {
      onLoadedData();
    });
    player.one('playing', function() {
      onPlaying(player, playEvent);
    });

    options.events = options.events.filter((event) => {
      return event.name !== 'firstplay';
    });
  }

  if (eventNames.indexOf('ended') > -1) {
    const endedEvent = getEvent('ended');

    player.one('ended', function() {
      ended(player, endedEvent);
    });
    options.events = options.events.filter((event) => {
      return event.name !== 'ended';
    });
  }

  if (eventNames.indexOf('timeupdate') > -1) {
    const timeupdateEvent = getEvent('timeupdate');

    player.on('timeupdate', function() {
      timeupdate(player, timeupdateEvent);
    });
    options.events = options.events.filter((event) => {
      return event.name !== 'timeupdate';
    });
  }

  if (eventNames.indexOf('watchtime') > -1) {
    const watchtimeEvent = getEvent('watchtime');

    window.addEventListener('beforeunload', function (e) {
      watchtime(player, watchtimeEvent);
      //e.preventDefault();
      //e.returnValue = '';
    });
    options.events = options.events.filter((event) => {
      return event.name !== 'watchtime';
    });
  }

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
