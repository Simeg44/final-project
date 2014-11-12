// Monsters/evils in world
var Monster = function(health, strength, defense, speed, location, creates) {
	this.health = health || 300;			// number
	this.strength = strength || 20;			// number
	this.defense = defense || 40;
	this.speed = speed || .8;			// speed
	this.location = location || "none";	// location coordinates
	this.creates = creates || [];		// array of Doroi born from this
}



////////////////////////
// Kakoi/Evil Breeds  //
////////////////////////


var Metus = function(health, strength, defense, speed, location, creates) {
	Monster.call(this, health, strength, defense, speed, location, creates);

	this.name = "metus";				// string
	this.image = "/Images/kakoi/metus.png";	// image file
	// store this in object for each breed on server side
	// this.pref = "none";				// preferred location
	this.known = true;					// bool
}
Metus.prototype = new Monster();
Metus.prototype.constructor = Metus;

var Nemesis = function(health, strength, defense, speed, location, creates) {
	Monster.call(this, health, strength, defense, speed, location, creates);

	this.name = "nemesis";				// string
	this.health = 500;					// overrides health
	this.strength = 65;					// overrides strength
	this.image = "/Images/kakoi/nemesis.png";	// image file
	this.known = false;					// bool
}
Nemesis.prototype = new Monster();
Nemesis.prototype.constructor = Nemesis;

var Tenebrae = function(health, strength, defense, speed, location, creates) {
	Monster.call(this, health, strength, defense, speed, location, creates);

	this.name = "tenebrae";				// string
	this.health = 650;					// overrides health
	this.strength = 70;					// overrides strength
	this.defense = 60;					// overrides defense
	this.speed = .7;					// overrides speed
	this.image = "/Images/kakoi/monster.png";	// image file
	this.known = false;					// bool
}
Tenebrae.prototype = new Monster();
Tenebrae.prototype.constructor = Tenebrae;

var Fraus = function(health, strength, defense, speed, location, creates) {
	Monster.call(this, health, strength, defense, speed, location, creates);

	this.name = "fraus";				// string
	this.health = 350;					// overrides health
	this.strength = 30;					// overrides strength
	this.defense = 30;					// overrides defense
	this.speed = .9;					// overrides speed
	this.image = "/Images/kakoi/fraus.png";	// image file
	this.known = true;					// bool
}
Fraus.prototype = new Monster();
Fraus.prototype.constructor = Fraus;

// Object containing all the breed constructors
var evilBreed = {
	"metus": Metus,
	"nemesis": Nemesis,
	"tenebrae": Tenebrae,
	"fraus": Fraus
};



////////////////////////
// Doroi/Good Breeds  //
////////////////////////


var Apheleia = function(health, strength, defense, speed, location, creates) {
	Monster.call(this, health, strength, defense, speed, location, creates);

	this.name = "apheleia";				// string
	this.image = "/Images/doroi/apheleia.png";	// image file
	// store this in object for each breed on server side
	// this.pref = "none";				// preferred location
	this.known = true;					// bool
}
Apheleia.prototype = new Monster();
Apheleia.prototype.constructor = Apheleia;

var Bia = function(health, strength, defense, speed, location, creates) {
	Monster.call(this, health, strength, defense, speed, location, creates);

	this.name = "bia";				// string
	this.health = 500;					// overrides health
	this.strength = 65;					// overrides strength
	this.image = "/Images/doroi/apheleia.png";	// image file
	this.known = false;					// bool
}
Bia.prototype = new Monster();
Bia.prototype.constructor = Bia;

var Dikaiosyne = function(health, strength, defense, speed, location, creates) {
	Monster.call(this, health, strength, defense, speed, location, creates);

	this.name = "dikaiosyne";				// string
	this.health = 650;					// overrides health
	this.strength = 70;					// overrides strength
	this.defense = 60;					// overrides defense
	this.speed = .7;					// overrides speed
	this.image = "/Images/doroi/soter.png";	// image file
	this.known = false;					// bool
}
Dikaiosyne.prototype = new Monster();
Dikaiosyne.prototype.constructor = Dikaiosyne;

var Ephiphron = function(health, strength, defense, speed, location, creates) {
	Monster.call(this, health, strength, defense, speed, location, creates);

	this.name = "ephiphron";				// string
	this.health = 350;					// overrides health
	this.strength = 30;					// overrides strength
	this.defense = 30;					// overrides defense
	this.speed = .9;					// overrides speed
	this.image = "/Images/doroi/soter.png";	// image file
	this.known = true;					// bool
}
Ephiphron.prototype = new Monster();
Ephiphron.prototype.constructor = Ephiphron;

var Soter = function(health, strength, defense, speed, location, creates) {
	Monster.call(this, health, strength, defense, speed, location, creates);

	this.name = "soter";				// string
	this.health = 350;					// overrides health
	this.strength = 30;					// overrides strength
	this.defense = 30;					// overrides defense
	this.speed = .9;					// overrides speed
	this.image = "/Images/doroi/soter.png";	// image file
	this.known = true;					// bool
}
Soter.prototype = new Monster();
Soter.prototype.constructor = Soter;

// Object containing all the breed constructors
var goodBreed = {
	"apheleia": Apheleia,
	"bia": Bia,
	"dikaiosyne": Dikaiosyne,
	"ephiphron": Ephiphron,
	"soter": Soter
};