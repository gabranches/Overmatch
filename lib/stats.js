var Game = require('./game.js');
var Heroes = require('../models/hero.js').Heroes;
var heroes = require('../setup/heroes.js');
var maps = require('../setup/maps.js');
var fs = require('fs');


module.exports = function () {

    me = {};

    me.sortArray = function (arr, key, sort) {
        var len = arr.length;
        for (var i=len-1; i >= 0; i--) {
            for(var j=1; j <= i; j++){
                if(arr[j - 1][key] > arr[j][key]) {
                    var temp = arr[j - 1];
                    arr[j - 1] = arr[j];
                    arr[j] = temp;
                 }
            }
        }

        return sort === 'desc' ? arr.reverse() : arr;
    }

    // Create an array from the JSON object
    me.createArray = function (obj, reverse) {

        var newArr = [];

        for (var key in obj) {
            newArr.push({
                id: key, 
                num: obj[key]['num_votes'],
                avg: obj[key]['avg_vote']
            });
        }

        // Need to reverse the order for the counter array
        if (reverse === 1) {
            newArr = me.sortArray(newArr, 'num', 'asc');
            newArr = me.sortArray(newArr, 'avg', 'asc');
        } else {
            newArr = me.sortArray(newArr, 'num', 'asc');
            newArr = me.sortArray(newArr, 'avg', 'desc');
        }
        return newArr;

    }

    me.openStatsFile = function(days, type) {
       var contents = fs.readFileSync(appRoot + '/api/data/'+type+'/'+days+'days/data.json').toString();
       return JSON.parse(contents);
    }
 
    me.getMatchups = function (hero, days) {
        var results = {};
        var matchupsArr = me.openStatsFile(days, 'matchups');
        var friendsArr = me.openStatsFile(days, 'friends');
        var mapsArr = me.openStatsFile(days, 'maps');

        results['hero'] = heroes[hero];
        results['matchups'] = me.createArray(matchupsArr[hero], 0);
        results['counters'] = me.createArray(matchupsArr[hero], 1);
        results['friends'] = me.createArray(friendsArr[hero], 0);
        results['maps'] = me.createArray(mapsArr[hero], 0);

    
        return results;    
    }

    // This function inverts the maps data set
    me.getMapStats = function (map, days) {
        var results = {};
        var mapsByHero = me.openStatsFile(days, 'maps');

        // For each hero
        for (var hero=0; hero < Object.keys(mapsByHero).length; hero++) {


                if (!(results[hero])) {

                    results[hero] = {
                        num_votes: mapsByHero[hero][map].num_votes,
                        avg_vote: mapsByHero[hero][map].avg_vote
                    }

                } else {
                    var avg = mapsByHero[hero][map].avg_vote;
                    console.log(avg);
                    var num = mapsByHero[hero][map].num_votes;
                    // Weighted avg
                    results[hero].avg_vote = ((avg*num) + (results[hero].num_votes * results[hero].avg_vote)) / (num + results[hero].num_votes);
                    results[hero].num_votes += num;
                }
        }
    

        return me.createArray(results, 0);    
    }

    initScoresArray = function () {
        var scores = [];
        for (var i=0; i < heroes.length; i++) {
            scores.push({id: i, num: 0, sum: 0});
        }
        return scores;
    }

    me.getGraphData = function(hero, opponent, type, days) {
        var fullData = me.openStatsFile(days, type);
        return fullData[hero][opponent]['graphData'];
    }

    me.suggestPick = function (opponentsArr, map, type, days) {

        var scores = initScoresArray();
        var mapsObj = me.openStatsFile(days, 'maps');
       
        // For each hero, add opponent scores
        for (var i=0; i < opponentsArr.length; i++) {
            var fullResults = me.getMatchups(opponentsArr[i], days);

            var opponents = fullResults[type];
            
            // For each opponent
            for (var j=0; j < opponents.length; j++) {
                var id = opponents[j].id;
                scores[id]['num'] += opponents[j].num;
                scores[id]['sum'] += opponents[j].num * opponents[j].avg;
            }
        }

        // For each hero, add map scores
        for (var i=0; i < opponentsArr.length; i++) {
            var id = opponentsArr[i];
            var mapRow = mapsObj[id];
            var mapStats = mapRow[map];
            scores[id]['num'] += mapStats.num_votes * 2;
            scores[id]['sum'] += mapStats.num_votes * mapStats.avg_vote * 2;
        }

        // Average scores
        for (var i=0; i < scores.length; i++) {
            if (scores[i]['sum'] > 0) {
                scores[i]['avg'] = scores[i]['sum'] / scores[i]['num'];
            }
        }

        // Sort by avg then by num desc
        result = me.sortArray(scores, 'num', 'asc');
        result = me.sortArray(scores, 'avg', 'desc');

        return result;
    }
    

    return me;

};