var client = {
    socketID: ''
};

var settings = {
	days: 30
};

var heroStats = {};
var mapStats = {};
var heroesSorted = {};

var mapsSorted = {};

var backgrounds = ['anubis', 'dorado', 'gibraltar',
				   'hanamura', 'hanamura2', 'kingsrow',
					'dorado2', 'numbani', 'volskaya',
					'gibraltar2', 'numbani2'];


// Create map tag-strat array
var mapTagToId = [];
maps.forEach(function (map) {
	mapTagToId.push(map.tag + '-' + map.strat);
});

