///////////////////////
// Main Constructors //
///////////////////////

var World = function(kakoi, percentage, zone) {
	this.kakoi = kakoi;				// array of monsters in this zone/world
	this.percentBad = percentBad;	// percentage of bad vs good in zone
	this.zone = zone;				// players zone by city or state
}

var Player = function(name, level, pet, location){
	this.name = name; 			// string
	this.level = level; 		// number
	// this.pets = pets || [];  	// array
	this.pet = pet || "none"		// equiped pet
	this.location = location 	// string of coordinantes?
}

var Blessing = function(name, level, currentHealth){
	this.name = name;			// string
	this.level = level || 1;
	// this.image = image; 		// image file?
	// this.health = health;		// number
	this.currentHealth = currentHealth;		// current health number
	// this.origin	= origin;		// kakoi object
}

var Kakoi = function(health, strength, defense, speed, location, creates) {
	this.health = health || 300;			// number
	this.strength = strength || 20;			// number
	this.defense = defense || 40;
	this.speed = speed || .8;			// speed
	this.location = location || "none";	// location coordinates
	this.creates = creates || [];		// array of Doroi born from this
}

////////////////////
// Monster Breeds //
////////////////////


var Metus = function(health, strength, defense, speed, location, creates) {
	Kakoi.call(this, health, strength, defense, speed, location, creates);

	this.name = "metus";				// string
	this.image = "Images/kakoi.png";	// image file
	// store this in object for each breed on server side
	// this.pref = "none";				// preferred location
	this.known = false;					// bool
}
Metus.prototype = new Kakoi();
Metus.prototype.constructor = Metus;

var Nemesis = function(health, strength, defense, speed, location, creates) {
	Kakoi.call(this, health, strength, defense, speed, location, creates);

	this.name = "nemesis";				// string
	this.health = 500;					// overrides health
	this.strength = 65;					// overrides strength
	this.image = "Images/kakoi.png";	// image file
	this.known = false;					// bool
}
Nemesis.prototype = new Kakoi();
Nemesis.prototype.constructor = Nemesis;

var Tenebrae = function(health, strength, defense, speed, location, creates) {
	Kakoi.call(this, health, strength, defense, speed, location, creates);

	this.name = "tenebrae";				// string
	this.health = 650;					// overrides health
	this.strength = 70;					// overrides strength
	this.defense = 60;					// overrides defense
	this.speed = .7;					// overrides speed
	this.image = "Images/kakoi.png";	// image file
	this.known = false;					// bool
}
Tenebrae.prototype = new Kakoi();
Tenebrae.prototype.constructor = Tenebrae;

var Fraus = function(health, strength, defense, speed, location, creates) {
	Kakoi.call(this, health, strength, defense, speed, location, creates);

	this.name = "fraus";				// string
	this.health = 350;					// overrides health
	this.strength = 30;					// overrides strength
	this.defense = 30;					// overrides defense
	this.speed = .9;					// overrides speed
	this.image = "Images/kakoi.png";	// image file
	this.known = false;					// bool
}
Fraus.prototype = new Kakoi();
Fraus.prototype.constructor = Fraus;

// Object containing all the breed constructors
var breed = {
	"metus": Metus,
	"nemesis": Nemesis,
	"tenebrae": Tenebrae,
	"fraus": Fraus
};


///////////////
// Blessings //
///////////////

var Pistis = function(name, health, currentHealth, strength, speed) {
	Blessing.call(this, name, health, currentHealth);

	this.name = "pistis";
	this.role = "attack";			// string (necessary?)
	this.strength = strength || 200;
	this.speed = speed || 200;
	this.image = "Images/carbuncle.png";
}
Pistis.prototype = new Blessing();
Pistis.prototype.constructor = Pistis;

// Object containing all the blessing constructors
var blessing = {
	"pistis": Pistis
}





var Finder = function(name, image, health, currentHealth, origin, known, role, tracking) {
	Blessing.call(this, name, image, health, currentHealth, origin);

	this.role = role;			// string (necessary?)
	this.tracking = tracking;	// number that determines tracking ability strength
}
Finder.prototype = new Blessing();
Finder.prototype.constructor = Finder;

var Fighter = function(name, image, health, currentHealth, origin, role, strength, speed) {
	Blessing.call(this, name, image, health, currentHealth, origin);

	this.role = role;			// string (necessary?)
	this.strength = strength;	// number that determines fighting strength
	this.speed = speed;			// number that determine hit %
}
Fighter.prototype = new Blessing();
Fighter.prototype.constructor = Fighter;



