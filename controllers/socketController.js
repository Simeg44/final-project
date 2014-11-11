var mongoose = require("mongoose");
var Monster = require("../models/monster.js");

module.exports = function(socketio, socket) {

	var socketController = {
		message: function(message){
			console.log("recieved:", message);
			socketio.emit("emitted");
		},

		newPos: function(loc){
			console.log("moved");
			Monster.find({ location : { $near: {
				$geometry: {type: "Point", coordinates: loc},
				$maxDistance: 3000 
			}}}, function(err, results) {
				socket.emit("newMonsters", results);
			});
		},

		killed: function(loc){
			Monster.remove({location: loc}, function(err, results){
				console.log("err", err);
				console.log("results:", results);
				socketio.emit("removeMonster", loc);
			})
		}
	};

	return socketController;
};