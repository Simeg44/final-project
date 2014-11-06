// var data = require("../models/tempDatabase.js")
var mongoose = require("mongoose");

// Require monster and player objects
var Monster = require("../models/monster.js");
var Player = require("../models/player.js");

var mapController = {
	mapContent: function(req, res) {
		console.log("params:", req.params.id);
		// Eventually make player name match users request
		Player.findOne({_id: req.params.id}, function(err, playerResults) {
			console.log(playerResults);
			Monster.find({}, function(err, monsterResults) {
				res.render("map", {
					monster: monsterResults,
					player: playerResults
				});
			});	
		})
	}
};

module.exports = mapController;