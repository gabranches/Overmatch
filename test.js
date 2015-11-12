var path = require('path');
global.appRoot = path.resolve(__dirname);
var stats = require('./lib/stats.js')();

var results = stats.getGraphData(7, 2, 'matchups', 7);

console.log(results);

