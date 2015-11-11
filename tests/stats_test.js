var path = require('path');
global.appRoot = '/sites/overmatch/';

var stats = require('../lib/stats.js')();

var results = stats.suggestPick([2,3,14,16,10,0], 10, 'friends', 7);

console.log(results);