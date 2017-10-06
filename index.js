import masthead from './app/masthead.js';

masthead.get()
  .then((assets) => {
    console.log(assets);
  });
