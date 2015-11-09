# node-masthead-injector

##### Purpose

To provide an simple interface to the masthead API within node.

##### Usage

1) Install the node module using the setup instructions below.
2) Import / Require the masthead
3) Call masthead.get() and receive a promise
```
import masthead from 'masthead';

masthead.get()
  .then(function(assets) {
    console.log(assets);
  })
  .catch(function(error) {
    // An asset could not be retrieved
  });
```

#####  Setup (Development)

`npm install`  \
`npm run dev`

##### Setup (As a node module)

`npm install --save https://github.com/sky-uk/node-masthead-injector.git`

##### Tests

`npm test`

##### Overriding the configuration

You can override these attributes by calling `masthead.setConfig()` before calling `masthead.get()`. Pass in an object to override individual attributes or the entire object.
```
{
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
  }
  ```
