import injector from './app.js';

injector.get()
  .then(function(assets) {
    console.log(assets);
  });
