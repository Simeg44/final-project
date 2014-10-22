var mongoose = require("mongoose");

var Player = mongoose.Schema({
	name: String,
	level: Number,
	pet: {
		name: String,
		level: Number,
		currentHealth: Number
	},
	location: [Number]
});

module.exports = mongoose.model("player", Player);