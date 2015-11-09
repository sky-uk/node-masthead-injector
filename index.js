import masthead from './app/masthead.js';

masthead.get()
  .then(function(assets) {
    console.log(assets);
  });
