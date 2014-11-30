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

// Pet that is chosen by player at start of game
var Blessing = function(name, level, currentHealth){
	this.name = name;			// string
	this.level = level || 1;
	// this.image = image; 		// image file?
	// this.health = health;		// number
	this.currentHealth = currentHealth;		// current health number
	// this.origin	= origin;		// kakoi object
}


///////////////
// Blessings //
///////////////

var Pistis = function(name, level, currentHealth, maxHealth, strength, speed) {
	Blessing.call(this, name, level, currentHealth);

	// this.name = "pistis";
	// this.role = "attack";			// string (necessary?)
	this.maxHealth = 700;
	this.currentHealth = currentHealth || this.maxHealth;
	this.strength = strength || 100;
	this.speed = speed || 200;
	this.image = "/Images/pets/pet.png";
	this.imageBack = "/Images/pets/pet.png";
}
Pistis.prototype = new Blessing();
Pistis.prototype.constructor = Pistis;

var Sophrosyne = function(name, level, currentHealth, maxHealth, strength, speed) {
	Blessing.call(this, name, level, currentHealth);

	// this.name = "pistis";
	// this.role = "attack";			// string (necessary?)
	this.maxHealth = 500;
	this.currentHealth = currentHealth || this.maxHealth;
	this.strength = strength || 100;
	this.speed = speed || 500;
	this.image = "/Images/pets/sophrosyne.png";
	this.imageBack = "/Images/pets/sophrosyne-sprites.png";
	// this.imageDeath = "/Images/pets/sophrosyne-sprites.png";
}
Sophrosyne.prototype = new Blessing();
Sophrosyne.prototype.constructor = Sophrosyne;

// Object containing all the blessing constructors
var blessing = {
	"pistis": Pistis,
	"sophrosyne": Sophrosyne
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



