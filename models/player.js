var mongoose = require("mongoose");

var Player = mongoose.Schema({
	name: String,
	level: Number,
	location: [Number],
	pet: {
		name: String,
		level: Number,
		currentHealth: Number
	},
	knownMonsters: [String]
});

module.exports = mongoose.model("player", Player);