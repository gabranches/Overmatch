//-- Globals --//

var express = require('express');
var app = express();
var server = app.listen(process.env.PORT || 5000);
var io = require('socket.io').listen(server);
var ioConn = require('./lib/io.js')(io);
var heroes = require('./setup/heroes.js');
var runAll = require('./lib/generateStats.js');


//-- App Config --//

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');


// Front page
app.get('/', function (request, response) {
    response.render('pages/index', {heroes: heroes});
});


// Update db every minute
var minutes = 1, the_interval = minutes * 60 * 1000;
setInterval(function() {
	runAll();
}, the_interval);


app.listen(app.get('port'), function () {
    console.log('Node app is running.');
});
