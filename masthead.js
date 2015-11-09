import Request from 'request-promise';
import Promise from 'promise';
import { assign } from 'lodash';

const injector = {
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

  _init: function() {
    this.setConfig();

    GLOBAL.SKY_MASTHEAD = null;

    this._config.assets.forEach((item) => {
      if (item.path.indexOf(':site-area') !== -1) {
        item.path = item.path.replace(':site-area', this._config.siteArea);
      }
    });

    console.log('MASTHEAD - Initialising');
  },

  _getConfig: function() {
    return this._config || this.setConfig();
  },

  _getCategory: function(section, assets) {
    return assets.filter(item => {
      return item.section === section ? item : false;
    }).map(item => {
      return item.data;
    }).join('');
  },

  _requestAssets: function(assets) {
    console.log('MASTHEAD - Requesting assets');

    assets.forEach(item => {
      var request = Request({
        uri : this._config.host + item.path,
        method : 'GET'
      }).then(data => {
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
  setConfig: function(config) {
    if (!config) {
      this._config = this._defaultConfig;
      return this._config;
    }

    this._config = assign(
      {},
      this._defaultConfig,
      config
    );

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
  get: function() {
    var response,
      assets,
      requests;

    this._init();

    response = new Promise((resolve, reject) => {
      assets = this._requestAssets(this._config.assets);

      requests = assets.map((item) => {
        return item.request;
      });

      Promise.all(requests)
        .then(() => {
          var responses = {
              head: this._getCategory('head', assets),
              body: this._getCategory('body', assets),
              footer: this._getCategory('footer', assets)
          }

          GLOBAL.SKY_MASTHEAD = responses;
          console.log('MASTHEAD - Assets received');

          resolve(responses);
        })
        .catch((error) => {
          console.log('MASTHEAD - ====== Errror ======');
          console.log('MASTHEAD - statusCode: ' + error.statusCode);
          console.log('MASTHEAD - asset: ' + error.options.uri);
          console.log('MASTHEAD - ====== Errror ======');
        });
    });

    return response;
  }
};

export default injector;
