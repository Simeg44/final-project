var data = require("./models/tempDatabase.js")

var indexController = {
	index: function(req, res) {
		res.render('index');
	},
	
	mapContent: function(req, res) {
		res.render("map", {
			data: data
		});
	}
};

module.exports = indexController;