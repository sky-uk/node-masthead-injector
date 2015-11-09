import Request from 'request-promise';
import Promise from 'promise';
import { assign } from 'lodash';

const injector = {
  _config: null,

  _defaultConfig: {
    host: 'https://assets.sky.com',
    assets: [{
        section: 'head',
        path: '/resources/mobile-ready/12/css'
    }, {
        section: 'body',
        path: '/masthead/my-sky'
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
      console.log(Request);
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
        });
    });

    return response;
  }
};

export default injector;
