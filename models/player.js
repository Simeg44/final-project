var mongoose = require("mongoose");

var Player = mongoose.Schema({
	name: String,
	level: Number,
	alignment: String,
	location: [Number], 
	pet: {
		name: String,
		level: Number,
		currentHealth: Number
	},
	knownMonsters: [String],
	home: {
		lat: Number,
		lng: Number
	},
	inventory: [String]
});

module.exports = mongoose.model("player", Player);