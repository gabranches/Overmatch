var Heroes = require('../models/hero.js').Heroes;
var heroes = require('./heroes.js');

Heroes.remove({}, function(err) { 
   console.log('collection removed');
   process.exit()
});

