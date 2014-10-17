var Kakoi = function (breed, location) {
	this.breed = breed;
	this.location = location;
};

var monster1 = new Kakoi("Metus", [40.01897124659721, -105.293869972229]);
var monster2 = new Kakoi("Nemesis", [40.02541266390118, -105.26425838470459]);
var monster3 = new Kakoi("Metus", [40.01486288226095, -105.26846408843994]);
var monster4 = new Kakoi("Tenebrae", [40.01213479170214, -105.25627613067627]);
var monster5 = new Kakoi("Nemesis", [40.027154371267265, -105.30331134796143]);
var monster6 = new Kakoi("Fraus", [40.01282504178692, -105.3024959564209]);	

var data = [monster1, monster2, monster3, monster4, monster5, monster6];

module.exports = data;