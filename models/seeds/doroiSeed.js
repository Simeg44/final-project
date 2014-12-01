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
	var location = randomCoor(loc.lng, loc.lat, 5000);
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
		for (var i = 0; i < 50; i ++) {

			var monster = new Doroi({
				breed: _.sample(breeds),
				location: randomCoor(40.024603, -105.254139, 103166)
			});
			monster.save();
		}

		// seed Lafayette monsters
		for (var i = 0; i < 30; i ++) {

			var monster = new Doroi({
				breed: _.sample(breeds),
				location: randomCoor(39.995619, -105.091319, 26784)
			});
			monster.save();
		}

		// seed Longmont monsters
		for (var i = 0; i < 38; i ++) {

			var monster = new Doroi({
				breed: _.sample(breeds),
				location: randomCoor(40.178335, -105.102477, 89919)
			});
			monster.save();
		}
	}
});

module.exports = {
	create: createOne
}