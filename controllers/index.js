// var data = require("../models/tempDatabase.js")
var mongoose = require("mongoose");

// Require monster and player objects
var Monster = require("../models/monster.js");
var Player = require("../models/player.js");

// Require opening text file
var openingText = require("../models/openingtext.js");

var indexController = {
	index: function(req, res) {
		Player.find({}, function(err, playerResults) {
			res.render('index', {
				player: playerResults
			});
		})
		
	},
	
	opening: function(req, res) {
		res.render("opening", {
			text: openingText
		})
	},

	menu: function(req, res) {
		res.render("menu")
	},

	newGame: function (req, res) {
		var newPlayer = new Player({
			name: req.body.name, 
			level: 1, 
			alignment: req.body.alignment, 
			pet: {
				name: "pistis",
				level: 1
			}
		})
		
		newPlayer.save(function(err, playerResults) {
			console.log("playerResults", playerResults);
			res.redirect("/worldMap/" + playerResults._id);
		})
	}
};

module.exports = indexController;