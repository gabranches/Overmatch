var path = require('path');
global.appRoot = '/Users/gabranches/work/overmatch/';

var stats = require('../lib/stats.js')();

var results = stats.suggestPick([2,3,4,6,10], 3, 'matchups', 7);

console.log(results);