var path = require('path');
global.appRoot = path.resolve(__dirname);
var stats = require('./lib/stats.js')();
var dbTransactions = require('./lib/dbTransactions.js')();



var comment = {
    date: new Date(),
    text: 'Hello this is a test comment',
    rating: 0,
    vote: 7,
    user: 'Anonymous'
}

// var results = dbTransactions.writeComment(7, 0, 'friends', comment);

dbTransactions.removeComment(7, 0, 'friends', '56450c926c23881323703a2c');

