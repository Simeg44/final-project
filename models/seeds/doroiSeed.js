var Doroi = require("../doroi.js");
var _ = require("underscore");

// Array of breeds to choose from 
var breeds = ["dikaiosyne", "apheleia", "bia", "ephiphron", "soter"];

// Returns a set of random coordinantes within
// the circle of given center and radius
function randomCoor(lat,lng, pop)
{
    var theta = Math.random()*((2*Math.PI) + 1);
    var radius = Math.random()*(Math.sqrt(pop)*.0001);

    var x = radius * Math.cos(theta) + lat;
    var y = radius * Math.sin(theta) + lng;

    return {lat: y, lng: x};
}

function createOne(loc) {
	console.log("loc", loc);
	var location = randomCoor(loc.lng, loc.lat, 3000);
	var monster = new Doroi({
		breed: _.sample(breeds),
		location: location
	});
	console.log("monster", monster);
	monster.save();
	console.log("creating monster:", monster);

	return monster;
}

// Prefill the database with information
Doroi.find({}, function (err, results) {
	// If results has a length, then there are
	// documents already...
	if (results.length === 0){
		// If the collection is empty, fill it in
		console.log("seeding doroi");

		// seed Boulder monsters
		for (var i = 0; i < 40; i ++) {

			var monster = new Doroi({
				breed: _.sample(breeds),
				location: randomCoor(40.024603, -105.254139, 103166)
			});
			monster.save();
		}
	}
});

module.exports = {
	create: createOne
}