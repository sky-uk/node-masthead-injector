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
  });
});
