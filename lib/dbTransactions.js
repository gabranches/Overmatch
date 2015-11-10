var Game = require('./game.js');
var Heroes = require('../models/hero.js').Heroes;
var heroes = require('../setup/heroes.js');
var maps = require('../setup/maps.js');


module.exports = function () {

    var recentVotes = {};

    var me = {};

    // Returns the days since 1/1/1970
    me.getDate = function () {
        var date = new Date();
        var ms = date.getTime();
        return Math.floor((ms / (1000*60*60*24)));
    }

    me.validateVote = function (data, type) {

        // console.log(data);
        var valid = true;
        var time = new Date();
        time = time.getTime();

        // Check for vote abuse
        var lastVote = recentVotes[data.socketID];

        if (lastVote) {
            if (time - lastVote < 3000) {
                valid = false;
                console.log('vote abuse detected ' + data.socketID);
            } 
        }
        
        recentVotes[data.socketID] = time;
    
        // Check if integer
        if (!(me.isInteger(data.hero))) valid = false;
        if (!(me.isInteger(data.vote))) valid = false;
        if (!(me.isInteger(data.opponent))) valid = false;

        // Check if vote is valid
        if (data.vote < 0 || data.vote > 10) {
            valid = false;
        }

        // Check array bounds
        if (data.hero > heroes.length -1) valid = false;
        if (data.opponent > heroes.length -1) valid = false;


        return valid;

    }

    me.isInteger = function(num) {
        return num % 1 === 0;
    }

    // Write a vote for the vs game in the DB
    me.writeData = function (data, type) {
       var date = me.getDate();

       Heroes.findOne({id: data.hero}, function (err, doc) {
           if (err) {
               console.log(err)
           } else {
                // Find opponent

                var opponent = me.getElement(doc[type], 'id', data.opponent)

                // Insert opponent if it doesn't exist
                if(opponent == undefined) {
                    doc[type].push({id: data.opponent, days: []});
                    // Refetch opponent
                    var opponent = me.getElement(doc[type], 'id', data.opponent);
                }

                var day = me.getElement(opponent.days, 'date', date);

                console.log(type);
                console.log('Date: ' + date);
                console.log('Hero: ' + data.hero);
                console.log('Opponent: ' + data.opponent);
                console.log('Vote: ' + data.vote);
                console.log('-');

                // Insert date if it doesn't exist
                if(day == undefined) {
                    opponent.days.push({date: date, votes: []});
                    // Refetch day
                    day = me.getElement(opponent.days, 'date', date);
                }

                day.votes.push(data.vote);

                // Save changes
                doc.save(function(err) {
                    if (err) console.log(err);
                });
           }
       });
    }

    me.getElement = function (arr, key, value) {
        return arr.filter(function (elem) {
           return elem[key] == value;
        })[0];
    }

    me.checkExist = function (arr, key, value) {
        return arr.filter(function (elem) {
           return elem[key] == value;
        });
    }


    return me;

};