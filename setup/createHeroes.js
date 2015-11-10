var Heroes = require('../models/hero.js').Heroes;
var heroes = require('./heroes.js');


function createHeroes (heroes) {

    var totalHeroes = heroes.length;

    for (var i=0; i < totalHeroes; i++) {
        Heroes.update(
            { id: i },
            { $setOnInsert: { id: i, matchups: [], friends: [], maps: [] } },
            { upsert: true }, 
            function (err) {
                if (err) console.log(err);
                else console.log("Update complete");       
            }
        );
    }
}

createHeroes(heroes);
