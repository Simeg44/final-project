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
			alignment: "good",
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
			name: "Antonio",
			level: 1,
			alignment: "evil",
			pet: {
				name: "pistis",
				level: 1,
				currentHealth: 700
			},
			knownMonsters: ["apheleia", "ephiphron"],
			home: {
				lat: 40.015334, 
				lng: -105.246301
			}
		})
		player2.save();

		var player3 = new Player({
			name: "Michael",
			level: 1,
			alignment: "good",
			pet: {
				name: "pistis",
				level: 1,
				currentHealth: 700
			},
			knownMonsters: ["fraus", "metus"],
			home: {
				lat: 40.007478, 
				lng: -105.239520
			}
		})
		player3.save();
	}
});

