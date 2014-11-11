var Player = require("../player.js");

// Prefill the database with information
Player.find({}, function (err, results) {
	// If results has a length, then there are
	// documents already...
	if (results.length === 0){
		// If the collection is empty, fill it in
		console.log("seeding player");

		var player = new Player({
			name: "Meg",
			level: 1,
			pet: {
				name: "sophrosyne",
				level: 1,
				currentHealth: 500
			},
			knownMonsters: ["fraus", "metus"],
			home: {
				lat: 40.016969, 
				lng: -105.219513
			}
		})
		player.save();

		var player2 = new Player({
			name: "John",
			level: 1,
			pet: {
				name: "pistis",
				level: 1,
				currentHealth: 500
			},
			knownMonsters: ["fraus", "metus"],
			home: {
				lat: 40.0176, 
				lng: -105.2797
			}
		})
		player2.save();
	}
});

