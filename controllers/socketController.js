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
				socketio.emit("newMonsters", results);
			});
		}
	};

	return socketController;
};