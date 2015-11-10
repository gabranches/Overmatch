var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Game = require('../lib/game.js');

// For running locally
if (!(process.env.MONGO_KEY)) {
	require('../env.js');
}

mongoose.connect(process.env.MONGO_KEY);

//-- Schemas --//


var Dates = new Schema({
    date: Number,
    votes: [Number]
}, { _id: false});


var Opponent = new Schema({
    id: Number,
    days: [Dates]
}, { _id: false});


var Heroes = new Schema({
    id: Number,
    matchups: [Opponent],
    friends: [Opponent],
    maps: [Opponent]
}, { _id: false});


//-- Methods --//




//-- Models --//

var HeroModel = mongoose.model('Heroes', Heroes);


//-- Export Module --//

module.exports = {
    Heroes: HeroModel
}
