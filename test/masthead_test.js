require('babel/register');

var assert = require('assert');
var proxyquire = require('proxyquire').noCallThru();
var masthead;

describe('Masthead', function() {
  beforeEach(function() {
    masthead = proxyquire('../app/masthead.js', {
      'request-promise': function() {
        return {
          then: function() {
            return Promise.resolve();
          },
          catch: function() {
            return Promise.reject();
          }
        };
      }
    });
  });

  describe('Configuration', function() {
    it('Works without setting config', function() {
      var config = {
        host: 'testhost',
        assets: []
      };

      masthead._defaultConfig = config;

      assert.ok(!masthead._config);
      masthead._init();
      assert.deepEqual(masthead._config, config);

    });

    it('Allows you to set override individual params in config', function() {
      masthead._defaultConfig = {
        host: 'randomhost',
        assets: []
      };
      masthead.setConfig({
        host: 'testinghost'
      });

      assert.deepEqual(masthead._config, {
        host: 'testinghost',
        assets: []
      });
    });

    it('Allows you to override the entire config', function() {
      masthead._defaultConfig = {
        host: 'randomhost',
        assets: []
      };
      masthead.setConfig({
        host: 'testinghost',
        assets: [{
          section: 'head',
          path: 'testingurl'
        }]
      });

      assert.deepEqual(masthead._config, {
        host: 'testinghost',
        assets: [{
          section: 'head',
          path: 'testingurl'
        }]
      });
    });

    it('Overrides :site-area with the config attribute', function() {
      masthead._defaultConfig = {
        host: 'randomhost',
        siteArea: 'test-area',
        assets: [{
          path: '/path/to/file/:site-area'
        }]
      };

      masthead._init();

      assert.equal(masthead._config.assets[0].path, '/path/to/file/test-area');
    });
  });

  describe('_requestAsset', function() {
    it('Fires off a request', function(done) {
      var asset = {
        path: '/path',
        section: 'test',
      };

      masthead._config = {
        host: 'host'
      };

      masthead._requestAsset(asset).then(done)
        .catch(done);
    });
  });

  describe('get', function() {
    it('Initialises the config automatically', function() {
      masthead._init = function() {
        assert.ok(true);
        this._config = {
          assets: []
        };
      };

      masthead.get();

      assert.ok(masthead._config);
    });

    it('Returns a single promise', function() {
      var response = masthead.get();

      assert.ok(response);
      assert.ok(response.then);
      assert.ok(response.catch);
    });
  });
});
