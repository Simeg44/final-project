var mongoose = require("mongoose");
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

		message: function(message){
			console.log("recieved:", message);
			socketio.emit("emitted");
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

		killed: function(loc){
			Monster.remove({location: loc}, function(err, results){
				console.log("err", err);
				console.log("results:", results);
				socketio.emit("removeMonster", loc);
			})
		},

		create: function(data){
			if (data.alignment === "good") {
				var newMonster = spawnGood.create(data.loc);
				socketio.to("evil").emit("justBorn", newMonster);
			}
			else {
				var newMonster = spawnBad.create(data.loc);
				socketio.to("good").emit("justBorn", newMonster);
			}
		}
	};

	return socketController;
};