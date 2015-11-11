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

    // Performs the sumproduct and average of an object with "total" and "sum"
    function sumProductAvg(scoresObj) {
        var keys = Object.keys(scoresObj);
        var result = [];

        for (var i=0; i < keys.length; i++) {

            var avg = scoresObj[i].sum === 0 ? 0 : scoresObj[i].sum/scoresObj[i].total;
            result.push({id: i, score: avg});
        }
        return result;
    }

    // Multiply the character matchup score by the map score
    function multiplyByMapScore(scores, map, days) {
        var mapsObj = me.openStatsFile(days, 'maps');
        
        for (var i=0; i < scores.length; i++) {
            var mapScore = mapsObj[i][map].avg_vote;
            scores[i].score *= mapScore;
        }
        return scores;
    }

    me.suggestPick = function (opponentsArr, map, type, days) {
        var mapsObj = me.openStatsFile(days, 'maps');
       

       // Put all opponents stats in one array
        for (var i=0; i < opponentsArr.length; i++) {
            var scores = {};
            console.log(opponentsArr[i]);
            var fullResults = me.getMatchups(opponentsArr[i], days);
            console.log(fullResults);
            var heroScores = fullResults[type];

            for (var j=0; j < heroScores.length; j++) {
                var id = heroScores[j].id;

                if (scores[id]) {
                    scores[id].total += heroScores[j].num;
                    scores[id].sum += heroScores[j].num * heroScores[j].avg;
                } else {
                    scores[id] = {total: heroScores[j].num, sum: (heroScores[j].num * heroScores[j].avg)};
                }
            }
        }

        var matchupScores = sumProductAvg(scores);
        console.log(matchupScores);
        result = multiplyByMapScore(matchupScores, map, 7);

        return JSON.stringify(me.sortArray(result, 'score', 'desc'), null, 2);
    }
    

    return me;

};