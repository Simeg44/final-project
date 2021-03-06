var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
// sockets
// var socketio = require("socket.io");

// controllers
var indexController = require('./controllers/index.js');
var mapController = require("./controllers/map.js")

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));

// Create the server
var http = require("http").Server(app);
// Start the web socket server
var socketio = require("socket.io")(http);

mongoose.connect(process.env.MONGOLAB_URI || "mongodb://localhost/pandoran");
// mongoose.connect("mongodb://localhost/pandoran");

// Seed the database
// 	Since I don't need to save access
// 	to each seed (as in they just execute),
// 	then I dont need to store them in
// 	a variable
require("./models/seeds/monsterSeed.js");
require("./models/seeds/doroiSeed.js");
require("./models/seeds/playerSeed.js");

app.get('/', indexController.index);
app.get("/opening", indexController.opening);
app.get("/menu", indexController.menu);

// Create new player when new game is selected and name entered
app.post("/newGame", indexController.newGame);

// Going to google map screen
app.get("/worldMap/:id", mapController.mapContent);

app.get("/populate", mapController.populate);
// app.get("/getLevels", mapController.getLevels);

socketio.on("connection", function(socket) {
	console.log("user connected");
	var socketController = require("./controllers/socketController.js");
	var controller = socketController(socketio, socket);

	socket.on("setAlignment", controller.setAlignment);
	socket.on("getLevels", controller.getLevels);
	socket.on("refreshLevels", controller.refreshLevels);
	socket.on("newPos", controller.newPos);
	socket.on("killed", controller.killed);
	socket.on("create", controller.create);
	socket.on("moveMonster", controller.moveMonster);

	// Update player/pet in database
	socket.on("updateHealth", controller.updateHealth);
	socket.on("setHome", controller.setHome);
	socket.on("discovered", controller.discovered);
})

var port = process.env.PORT || 6591;
var server = http.listen(port, function() {
	console.log('Express server listening on port ' + server.address().port);
});
