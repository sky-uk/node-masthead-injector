import Request from 'request-promise';

const injector = {
  _config: null,

  _defaultConfig: {
    host: 'https://assets.sky.com',
    siteArea: 'help-and-support',
    debug: false,
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

  _startTime: null,

  _init: function() {
    this._startTime = +(new Date());
    this.setConfig();

    this._config.assets.forEach(item => {
      if (item.path.indexOf(':site-area') !== -1) {
        item.path = item.path.replace(':site-area', this._config.siteArea);
      }
    });

    this._log('MASTHEAD - Starting');
  },

  _getConfig: function() {
    return this._config || this.setConfig();
  },

  _log: function(message) {
    if (this._config.debug) {
      console.log(message);
    }
  },

  _requestAsset: function(asset) {
    this._log('MASTHEAD - Requesting asset - ' + asset.path);

    return Request(this._config.host + asset.path)
      .then(response => {
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
  setConfig: function(config) {
    if (!config) {
      this._config = this._defaultConfig;
      return this._config;
    }

    this._config = Object.assign({},
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
    var requests = [];

    this._init();

    this._config.assets.forEach(item => {
      requests.push(
        this._requestAsset(item)
      )
    });

    return Promise.all(requests)
      .then(results => {
        let assets = {};
        let time = +(new Date());
        results.forEach(response => {
          if (!assets[response.section]) {
            assets[response.section] = '';
          }

          assets[response.section] += response.data;
        });

        this._log('MASTHEAD - Assets received (' + (time - this._startTime) / 1000 + 's)');
        return assets;
      })
      .catch(error => {
        this._log('MASTHEAD - ====== Error ======');
        this._log(`MASTHEAD - statusCode: ${error.statusCode}`);
        this._log(`MASTHEAD - asset: ${error.options.uri}`);
        this._log('MASTHEAD - ====== Error ======');
      });

  }
};

export default injector;
