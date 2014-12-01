var mongoose = require("mongoose");
var Player = require("../models/player.js");
var Monster = require("../models/monster.js");
var Doroi = require("../models/doroi.js");
var spawnBad = require("../models/seeds/monsterSeed.js");
var spawnGood = require("../models/seeds/doroiSeed.js");

module.exports = function(socketio, socket) {
	var myAlignment = "good"; 

	var socketController = {
		setAlignment: function(alignment){
			myAlignment = alignment;
			socket.join(alignment);
		},

		getLevels: function() {
			Monster.find({}, function(err, kakoiResults){
				Doroi.find({}, function(err, doroiResults) {
					socket.emit("currentLevels", {
						kakoi: kakoiResults.length,
						doroi: doroiResults.length
					})
				});
			});
		},

		refreshLevels: function() {
			Monster.find({}, function(err, kakoiResults){
				Doroi.find({}, function(err, doroiResults) {
					socketio.emit("currentLevels", {
						kakoi: kakoiResults.length,
						doroi: doroiResults.length
					})
				});
			});
		},

		newPos: function(data){
			if (data.alignment === "good") {
				Monster.find({ location : { $near: {
					$geometry: {type: "Point", coordinates: data.coor},
					$maxDistance: 3000 
				}}}, function(err, results) {
					socket.emit("newMonsters", results);
				});
			}
			else {
				Doroi.find({ location : { $near: {
					$geometry: {type: "Point", coordinates: data.coor},
					$maxDistance: 3000 
				}}}, function(err, results) {
					socket.emit("newMonsters", results);
				});
			}
		},

		killed: function(data){
			if (data.alignment === "good") {
				Monster.remove({location: data.loc}, function(err, results){
					console.log("err", err);
					console.log("results:", results);
					socketio.to("good").emit("removeMonster", data.loc);
				});
			}
			else {
				Doroi.remove({location: data.loc}, function(err, results){
					console.log("err", err);
					console.log("results:", results);
					socketio.to("evil").emit("removeMonster", data.loc);
				});
			}
		},

		// After monster is killed spawn monster for players of 
		// opposite alignment
		create: function(data){
			if (data.alignment === "good") {
				var newMonster = spawnGood.create(data.loc);
				socketio.to("evil").emit("justBorn", newMonster);
			}
			else {
				var newMonster = spawnBad.create(data.loc);
				socketio.to("good").emit("justBorn", newMonster);
			}
		},

		// If player fails to kill monster after engaging them
		// move monster to another location in same alignment
		moveMonster: function(data) {
			if (data.alignment === "good") {
				var newMonster = spawnBad.create(data.loc);
				socketio.to("good").emit("justBorn", newMonster);
				console.log("monster moved");
			}
			else {
				var newMonster = spawnGood.create(data.loc);
				socketio.to("evil").emit("justBorn", newMonster);
				console.log("monster moved");
			}
		},

		// Update pet's current health
		updateHealth: function (data) {
			var health = +data.health;
			console.log("health", health)
			// Player.update({_id: data.id}, {$set: {pet: {currentHealth: health}}});
			Player.findOne({_id: data.id}, function (err, results) {
				results.pet.currentHealth = health;
				results.save();
				console.log("new health:", results);
			})
		},

		// Set player's "home" location
		setHome: function (data) {
			Player.findOne({_id: data.id}, function (err, results) {
				results.home.lat = data.lat;
				results.home.lng = data.lng;
				results.save();
				console.log("home set", results);
			})
		},

		// Add newly defeated monster to known monsters array
		discovered: function (data) {
			Player.findOne({_id: data.id}, function (err, results) {
				results.knownMonsters.push(data.monster);
				results.save();
				console.log("new array:", results.knownMonsters);
			})
		}
	};

	return socketController;
};