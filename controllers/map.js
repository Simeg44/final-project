// var data = require("../models/tempDatabase.js")
var mongoose = require("mongoose");

// Require monster and player objects
var Monster = require("../models/monster.js");
var Doroi = require("../models/doroi.js");
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
		console.log("alignment:", req.query.alignment);

		// If play is on the side of good send 
		// over nearby evil monsters
		if (req.query.alignment === "good") {
			Monster.find({ location : { $near: {
				$geometry: {type: "Point", coordinates: [lng, lat]},
				$maxDistance: 3000 
			}}}, function(err, results) {
				res.send(results);
			});
		}
		// Otherwise send over list of good monsters
		else {
			Doroi.find({ location : { $near: {
				$geometry: {type: "Point", coordinates: [lng, lat]},
				$maxDistance: 3000 
			}}}, function(err, results) {
				res.send(results);
			});
		}
	},

	remove: function(req, res) {
		console.log(req.query.loc);
		Monsters.remove({location: req.query.loc}, function(err, results) {
			res.send({
				err: err,
				result: result,
				success: err === null
			});
		})
	},

	getLevels: function(req, res) {
		var kakoi = Monsters.find({});
		var doroi = Doroi.find({});
		console.log("doroi", doroi.length);
	}
};

module.exports = mapController;