var heroes = require('../setup/heroes.js');
var maps = require('../setup/maps.js');


function Game(type) {
    this.type = type;
}


// Create matchup(vs) game
Game.prototype.createMatchup =  function() {
    var hero = heroes[Math.floor(Math.random() * heroes.length)];
    var opponent = hero;

    while (opponent === hero) {
        opponent = heroes[Math.floor(Math.random() * heroes.length)];
    }

    return {hero: hero, opponent: opponent}
};

// Create matchup(vs) game
Game.prototype.createTeam =  function() {
    var hero = heroes[Math.floor(Math.random() * heroes.length)];
    var opponent = heroes[Math.floor(Math.random() * heroes.length)];

    return {hero: hero, opponent: opponent}
};


// Create solo game
Game.prototype.createSolo =  function() {
    var hero = heroes[Math.floor(Math.random() * heroes.length)];
    var opponent = maps[Math.floor(Math.random() * maps.length)];

    return {hero: hero, opponent: opponent}
};



module.exports = Game;
