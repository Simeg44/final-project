var mongoose = require("mongoose");

var Doroi = mongoose.Schema({
	breed: String,
	location: {lat: Number, lng: Number}
});

module.exports = mongoose.model("doroi", Doroi)