// var data = require("../models/tempDatabase.js")
var mongoose = require("mongoose");

// Require monster and player objects
var Monster = require("../models/monster.js");
var Player = require("../models/player.js");

var indexController = {
	index: function(req, res) {
		res.render('index');
	},
	
	mapContent: function(req, res) {

		// Eventually make player name match users request
		Player.findOne({name: "Meg"}, function(err, playerResults) {
			Monster.find({}, function(err, monsterResults) {
				res.render("map", {
					monster: monsterResults,
					player: playerResults
				});
			});	
		})
	}
};

module.exports = indexController;