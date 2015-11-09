require('babel/register');

var assert = require('assert');
var _ = require('lodash');
var proxyquire = require('proxyquire').noCallThru();
var _masthead = require('../masthead.js');
var masthead;

describe('Masthead', function() {
  beforeEach(function(){
    masthead = _.clone(_masthead, true);
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
      }
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
      }
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

  describe('_getCategory', function() {
    it('Filters by section', function() {
      var response = masthead._getCategory('body', [{
        section: 'body',
        data: '123'
      }, {
        section: 'footer',
        data: '456'
      }]);

      assert.equal(response, '123');
    });

    it('Returns the data joined in one string', function() {
      var response = masthead._getCategory('body', [{
        section: 'body',
        data: '123'
      }, {
        section: 'body',
        data: '456'
      }]);

      assert.equal(response, '123456');
    });
  });
});
