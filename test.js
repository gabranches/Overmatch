var path = require('path');
global.appRoot = path.resolve(__dirname);
var stats = require('./lib/stats.js')();

var results = stats.suggestPick([0,1,2,3,4,5], 2, 'matchups', 7);

