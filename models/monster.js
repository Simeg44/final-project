var mongoose = require("mongoose");

var Monster = mongoose.Schema({
	breed: String,
	location: {lat: Number, lng: Number}
});

module.exports = mongoose.model("monster", Monster)

// var monster1 = new Monster("metus", [40.01680206104785, -105.22773742675781]);
// var monster2 = new Monster("nemesis", [40.026727164142486, -105.24052619934082]);
// var monster3 = new Monster("metus", [40.007598688913966, -105.22971153259277]);
// var monster4 = new Monster("tenebrae", [40.011082968626106, -105.20370483398438]);
// var monster5 = new Monster("nemesis", [40.01870831868798, -105.19572257995605]);
// var monster6 = new Monster("fraus", [40.015060089400215, -105.22984027862549]);	

// var data = [monster1, monster2, monster3, monster4, monster5, monster6];

// module.exports = data;