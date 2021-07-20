'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var injector = {
  _config: null,

  _defaultConfig: {
    host: 'https://assets.sky.com/new',
    siteArea: 'help-and-support',
    debug: false,
    assets: [{
      section: 'head',
      path: '/resources/css'
    }, {
      section: 'header',
      path: '/masthead/help-and-support'
    }, {
      section: 'footer',
      path: '/footer'
    }, {
      section: 'js',
      path: '/resources/js'
    }]
  },

  _startTime: null,

  _init: function _init() {
    var _this = this;

    this._startTime = +new Date();
    if (!this._config) {
      this.setConfig();
    }

    this._config.assets.forEach(function (item) {
      if (item.path.indexOf(':site-area') !== -1) {
        item.path = item.path.replace(':site-area', _this._config.siteArea);
      }
    });

    this._log('MASTHEAD - Starting');
  },

  _getConfig: function _getConfig() {
    return this._config || this.setConfig();
  },

  _log: function _log(message) {
    if (this._config.debug) {
      console.log(message);
    }
  },

  _requestAsset: function _requestAsset(asset) {
    this._log('MASTHEAD - Requesting asset - ' + asset.path);

    var options = {
      uri: this._config.host + asset.path,
      headers: this._config.headers
    };

    return (0, _requestPromise2['default'])(options).then(function (response) {
      asset.data = response;

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

    this._config = Object.assign({}, this._defaultConfig, config);

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
    var _this2 = this;

    var requests = [];

    this._init();

    this._config.assets.forEach(function (item) {
      requests.push(_this2._requestAsset(item));
    });

    return Promise.all(requests).then(function (results) {
      var assets = {};
      var time = +new Date();
      results.forEach(function (response) {
        if (!assets[response.section]) {
          assets[response.section] = '';
        }

        assets[response.section] += response.data;
      });

      _this2._log('MASTHEAD - Assets received (' + (time - _this2._startTime) / 1000 + 's)');
      return assets;
    })['catch'](function (error) {
      _this2._log('MASTHEAD - ====== Error ======');
      _this2._log('MASTHEAD - statusCode: ' + error.statusCode);
      _this2._log('MASTHEAD - asset: ' + error.options.uri);
      _this2._log('MASTHEAD - ====== Error ======');
    });
  }
};

exports['default'] = injector;
module.exports = exports['default'];
