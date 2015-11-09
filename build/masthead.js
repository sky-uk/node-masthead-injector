'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _lodash = require('lodash');

var injector = {
  _config: null,

  _defaultConfig: {
    host: 'https://assets.sky.com',
    siteArea: 'help-and-support',
    assets: [{
      section: 'head',
      path: '/resources/mobile-ready/12/css'
    }, {
      section: 'body',
      path: '/masthead/:site-area'
    }, {
      section: 'footer',
      path: '/footer'
    }]
  },

  _init: function _init() {
    var _this = this;

    this.setConfig();

    this._config.assets.forEach(function (item) {
      if (item.path.indexOf(':site-area') !== -1) {
        item.path = item.path.replace(':site-area', _this._config.siteArea);
      }
    });

    console.log('MASTHEAD - Initialising');
  },

  _getConfig: function _getConfig() {
    return this._config || this.setConfig();
  },

  _requestAsset: function _requestAsset(asset) {
    console.log('MASTHEAD - Requesting asset - ' + asset.section);
    return (0, _requestPromise2['default'])(this._config.host + asset.path).then(function (r) {
      asset.data = r;
      return asset;
    });
  },

  /**
   * Allows you to override the default config.
   * Should be called before get()
   * @param {Object} config
   *
   * {
   *   host: '',
   *   siteArea: '',
   *   assets: [{
   *     section: 'head',
   *     path: '/path/to/file'
   *   }]
   * }
   */
  setConfig: function setConfig(config) {
    if (!config) {
      this._config = this._defaultConfig;
      return this._config;
    }

    this._config = (0, _lodash.assign)({}, this._defaultConfig, config);

    return this._config;
  },

  /**
   * Returns a promise for the assets
   * Promise resolves with:
   *
   * {
   *   head: '<link href="path/to/file.css />"',
   *   body: '<div class="dropdown></div>',
   *   footer: '<div class="contact-us></div>'
   * }
   *
   * You can also use the global SKY_MASTHEAD if your app
   * can not be updated to the format described above.
   *
   * @return {Promise}
   */
  get: function get() {

    this._init();

    return Promise.all(this._config.assets.map(this._requestAsset.bind(this))).then(function (results) {
      var assets = {};
      results.forEach(function (r) {
        assets[r.section] = r.data;
      });
      console.log('MASTHEAD - Assets received');
      return assets;
    })['catch'](function (error) {
      console.log('MASTHEAD - ====== Error ======');
      console.log('MASTHEAD - statusCode: ' + error.statusCode);
      console.log('MASTHEAD - asset: ' + error.options.uri);
      console.log('MASTHEAD - ====== Error ======');
    });
  }
};

exports['default'] = injector;
module.exports = exports['default'];
