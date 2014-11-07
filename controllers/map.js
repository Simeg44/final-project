// var data = require("../models/tempDatabase.js")
var mongoose = require("mongoose");

// Require monster and player objects
var Monster = require("../models/monster.js");
var Player = require("../models/player.js");

var mapController = {
	mapContent: function(req, res) {
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
	},

	populate: function(req, res) {
		var lat = +req.query.lat;
		var lng = +req.query.lng;
		console.log("coor:", [lat, lng]);
		Monster.find({ location : { $near : [lat, lng], $maxDistance: 0.10 }}, function(err, results) {
			console.log("results:", results);
			res.send(results);
		});
	}
};

module.exports = mapController;