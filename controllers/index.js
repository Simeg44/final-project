// var data = require("../models/tempDatabase.js")
var mongoose = require("mongoose");

// Require monster and player objects
var Monster = require("../models/monster.js");
var Player = require("../models/player.js");

var indexController = {
	index: function(req, res) {
		Player.find({}, function(err, playerResults) {
			res.render('index', {
				player: playerResults
			});
		})
		
	},
	
	opening: function(req, res) {
		res.render("opening")
	},

	menu: function(req, res) {
		res.render("menu")
	}
};

module.exports = indexController;