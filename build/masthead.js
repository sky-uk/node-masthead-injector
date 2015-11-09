'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _promise = require('promise');

var _promise2 = _interopRequireDefault(_promise);

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
    }, {
      section: 'footer',
      path: '/resources/mobile-ready/12/js'
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

  _getCategory: function _getCategory(section, assets) {
    return assets.filter(function (item) {
      return item.section === section ? item : false;
    }).map(function (item) {
      return item.data;
    }).join('');
  },

  _requestAssets: function _requestAssets(assets) {
    var _this2 = this;

    console.log('MASTHEAD - Requesting assets');

    assets.forEach(function (item) {
      var request = (0, _requestPromise2['default'])({
        uri: _this2._config.host + item.path,
        method: 'GET'
      }).then(function (data) {
        item.data = data;
      });

      item.request = request;
    });

    return assets;
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
    var _this3 = this;

    var assets, requests;

    this._init();

    return new _promise2['default'](function (resolve, reject) {
      assets = _this3._requestAssets(_this3._config.assets);

      requests = assets.map(function (item) {
        return item.request;
      });

      _promise2['default'].all(requests).then(function () {
        var responses = {
          head: _this3._getCategory('head', assets),
          body: _this3._getCategory('body', assets),
          footer: _this3._getCategory('footer', assets)
        };

        console.log('MASTHEAD - Assets received');

        resolve(responses);
      })['catch'](function (error) {
        console.log('MASTHEAD - ====== Errror ======');
        console.log('MASTHEAD - statusCode: ' + error.statusCode);
        console.log('MASTHEAD - asset: ' + error.options.uri);
        console.log('MASTHEAD - ====== Errror ======');

        reject(error);
      });
    });
  }
};

exports['default'] = injector;
module.exports = exports['default'];
