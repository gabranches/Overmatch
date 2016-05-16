var Heroes = require('../models/hero.js').Heroes;
var heroes = require('../setup/heroes.js');
var maps = require('../setup/maps.js');
var db = require('./dbTransactions.js')();


function sumArr(arr) {
	var sum = 0;
	for (var i=0; i < arr.length; i++) {
		sum += arr[i];
	}
	return sum; 
}


function sumOpponents(heroArr, opponentArr, type, numDays){

	// Remove this when going back to daily data
	numDays = 500;

	var fullOpponentArr = opponentArr;
	var results = {};
	var count = 0;
	var today = db.getDate();

	// Iterate over each hero
	heroArr.forEach(function (hero_id) {

		results[hero_id] = {};

		opponentArry = fullOpponentArr;

		Heroes.find({id: hero_id}, function (err, doc) {
			if (err) {
				console.log(error);
			} else {

				opponentArr.forEach(function(opp_id) {

					var graphData = [];
					var votes = [];
					
					// Get a opponent list (all opponents, or friends)
					var opponents = doc[0][type];

					// Get a specific opponent
					var opponent = db.getElement(opponents, 'id', opp_id);

					if (opponent != undefined) {

						// Get all days with votes
						var dates = opponent.days;

						// Iterate over all days
						for (var i = numDays; i >= 0; i--) {
							var day = db.getElement(dates, 'date', today-i);


							// Add votes to vote array if they exist
							if (day) {
								// votes.push(day.votes);
								votes = votes.concat(day.votes);
							// 	graphData.push(sumArr(day.votes)/day.votes.length);
							// } else {
							// 	graphData.push(0)
							}
						}

						// If there are votes, write to object
						if (votes.length > 0) {
							results[hero_id][opp_id] = {
									num_votes: votes.length,
									avg_vote: sumArr(votes)/votes.length
									// graphData: graphData
							};
						// Else, write default
						} else {
							results[hero_id][opp_id] = {
								num_votes: 0,
								 avg_vote: 5, 
								// graphData: graphData
							};
						}
					} else {
						results[hero_id][opp_id] = {
							num_votes: 0,
							avg_vote: 5,
							// graphData: graphData
						};
					}

					count++;

					if (count == heroArr.length*opponentArr.length) {

						writeToFile(JSON.stringify(results), type, 30);
						// Change this back when going to daily data
						// writeToFile(JSON.stringify(results), type, numDays);
					}

					// Remove hero as its own opponent
					if (type==='opponents' && hero_id === opp_id) {
						delete results[hero_id][opp_id];
					}
				});
			}
		});	
	});
}

function writeToFile(results, type, days) {
	var fs = require('fs');
	fs.writeFile('./api/data/'+type+'/'+days+'days/data.json', results, function (err) {
		if (err) {
			return console.log(err);
		}
	});
}

function listAll(arr) {
	var newArr = [];
	for (var i=0; i < arr.length; i++) {
		newArr.push(i);
	}
	return newArr;
}


var runAll = function() {

		var allHeroes = listAll(heroes);
		var allMaps = listAll(maps);

		// Generate all friends data
		// sumOpponents(allHeroes, allHeroes, 'friends', 7);
		sumOpponents(allHeroes, allHeroes, 'friends', 30);

		// // Generate all opponents data
		// sumOpponents(allHeroes, allHeroes, 'matchups', 7);
		sumOpponents(allHeroes, allHeroes, 'matchups', 30);

		// // Get all map data
		// sumOpponents(allHeroes, allMaps, 'maps', 7);
		sumOpponents(allHeroes, allMaps, 'maps', 30);
}

module.exports = runAll;


