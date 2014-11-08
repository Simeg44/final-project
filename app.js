var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
// sockets
var socketio = require("socket.io");
var http = require("http")

// controllers
var indexController = require('./controllers/index.js');
var mapController = require("./controllers/map.js")

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));

// Create the server
var server = http.createServer(app);
// Start the web socket server
var io = socketio.listen(server);

mongoose.connect("mongodb://localhost/pandoran");

// Seed the database
// 	Since I don't need to save access
// 	to each seed (as in they just execute),
// 	then I dont need to store them in
// 	a variable
require("./models/seeds/monsterSeed.js");

app.get('/', indexController.index);
app.get("/opening", indexController.opening);
app.get("/menu", indexController.menu);

// Going to google map screen
app.get("/worldMap/:id", mapController.mapContent);

app.get("/populate", mapController.populate)

io.sockets.on("connection", function(socket) {

})

var port = process.env.PORT || 6591;
var server = app.listen(port, function() {
	console.log('Express server listening on port ' + server.address().port);
});
