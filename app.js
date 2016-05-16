//-- Globals --//

var express = require('express');
var app = express();
var server = app.listen(process.env.PORT || 5000);
var io = require('socket.io').listen(server);
var ioConn = require('./lib/io.js')(io);
var heroes = require('./setup/heroes.js');
var maps = require('./setup/maps.js');
var runAll = require('./lib/generateStats.js');
var path = require('path');
global.appRoot = path.resolve(__dirname);
var stats = require('./lib/stats.js')();
// var matchupsArr = stats.openStatsFile(30, 'matchups');
// var friendsArr = stats.openStatsFile(30, 'friends');
// var mapsArr = stats.openStatsFile(30, 'maps');
var mapsUnique =  stats.uniqueObjArr(maps, 'tag');

//-- App Config --//

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');


// Front page
app.get('/', function (request, response) {
    response.render('pages/index', {
    	heroes: heroes,
     	maps: mapsUnique
     });
});


app.get('/api/matchups', function (request, response) {
    response.json(matchupsArr);
});

app.get('/api/teammates', function (request, response) {
    response.json(friendsArr);
});

app.get('/api/maps', function (request, response) {
    response.json(mapsArr);
});

app.get('/api/hero_ids', function (request, response) {
    response.json(heroes);
});

app.get('/api/map_ids', function (request, response) {
    response.json(maps);
});


// Update db every minute
var minutes = 1, the_interval = minutes * 60 * 1000;
setInterval(function() {
	runAll();
}, the_interval);


app.listen(app.get('port'), function () {
    console.log('Node app is running.');
});
