$(document).on("ready", function () {

var canvas = document.createElement("canvas");
document.body.appendChild(canvas);
var ctx = canvas.getContext("2d");

var particles = [];
// Add one emitter located at `{ x : 100, y : 230}` from the origin (top left)
// that emits at a velocity of `2` shooting out from the right (angle `0`)
// var emitters = [new Emitter(new Vector(100, 230), Vector.fromAngle(0, 2))];

canvas.width = window.innerWidth;
canvas.height = $(window).height();
ctx.fillRect(0,0, canvas.width, canvas.height);

var img = new Image();
img.onLoad = function () {
	ctx.drawImage(img, 500, 500);
};
img.src = "/Images/white-sparkle.png";
console.log(img);

var posX = canvas.width/2;
var posY = canvas.height/2;

// Initial velocities
var velocityX = 10;
var velocityY = -10;
var gravity = 1;

// Particles object
var particles = {};
var particleIndex = 0;
var settings = {
	density: 40,
	particleSize: 5,
	startingX: canvas.width/2,
	startingY: canvas.height/2,
	gravity: 0,
	maxLife: 100
};

// Particles object
var particlesTiny = {};
var particleIndexTiny = 0;
var settingsTiny = {
	density: 40,
	particleSize: 2,
	startingX: canvas.width/2,
	startingY: canvas.height/2,
	gravity: 0,
	maxLife: 200
};

function emitter() {
	ctx.beginPath();
	ctx.fillStyle = "white";
	ctx.arc(canvas.width/2, canvas.height/2, 20, 0, Math.PI*2, true);
	ctx.closePath();
	ctx.fill();
}

function Particle(index) {
	// Establish starting positions and velocities
	this.x = settings.startingX;
	this.y = settings.startingY;

	// Random X and Y velocities
	this.velocityX = Math.random() * 15 - 10;
	this.velocityY = Math.random() * 15 - 5;

	// Add new particle to the index
	particleIndex ++;
	particles[particleIndex] = this;
	this.id = particleIndex;
	this.life = 0;
};

function TinyParticle() {
	// Establish starting positions and velocities
	this.x = settings.startingX;
	this.y = settings.startingY;

	// Random X and Y velocities
	this.velocityX = Math.random() * 20 - 10;
	this.velocityY = Math.random() * 20 - 5;

	// Add new particle to the index
	particleIndexTiny ++;
	particles[particleIndexTiny] = this;
	this.id = particleIndexTiny;
	this.life = 0;
};

Particle.prototype.draw = function() {
	this.x += this.velocityX;
	this.y += this.velocityY;

	// Adjust for gravity
	// this.velocityY += settings.gravity;

	// Age the particle
	this.life++;

	// If particle is old remove it
	if (this.life >= settings.maxLife) {
		delete particles[this.id];
	}

	// Create the shapes
	ctx.beginPath();
	ctx.fillStyle = "white";
	// After setting the fill style, draw an arc on the canvas
	ctx.arc(this.x, this.y, settings.particleSize, 0, Math.PI*2, true);
	ctx.closePath();
	ctx.fill();
};

TinyParticle.prototype.draw = function() {
	this.x += this.velocityX;
	this.y += this.velocityY;

	// Adjust for gravity
	// this.velocityY += settings.gravity;

	// Age the particle
	this.life++;

	// If particle is old remove it
	if (this.life >= settings.maxLife) {
		delete particlesTiny[this.id];
	}

	// Create the shapes
	ctx.beginPath();
	ctx.fillStyle = "white";
	// After setting the fill style, draw an arc on the canvas
	ctx.arc(this.x, this.y, settingsTiny.particleSize, 0, Math.PI*2, true);
	ctx.closePath();
	ctx.fill();
};

// Draw the shapes on the canvas using an interval of 30ms
setInterval(function(){

	// Erase canvas
	ctx.fillStyle = "black";
	ctx.fillRect(0,0,canvas.width,canvas.height);

	// Draw emitter 
	emitter();

	// Draw the particles
	for (i = 0; i < settings.density; i++) {
		if (Math.random() > 0.97) {
			// Introducing a random chance of creating
			// a particle cooresponding to a chance of 1
			// per second per density value
			new Particle();
		}
	}

	// Draw tiny particles
	for (i = 0; i < settingsTiny.density; i++) {
		if (Math.random() > 0.97) {
			// Introducing a random chance of creating
			// a particle cooresponding to a chance of 1
			// per second per density value
			new TinyParticle();
		}
	}

	for (var i in particles) {
		particles[i].draw(settings.particleSize);
	}
	for (var j in particlesTiny) {
		particlesTiny[j].draw(settings.particleSize);
	}
}, 30);



})
/*function loop() {
	clear();
	update();
	draw();
	queue();
}

function clear() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function update() {
	addNewParticles();
	plotParticles(canvas.width, canvas.height);
}

var maxParticles = 200; // experiment
var emissionRate = 4; // how many particles are emitted each frame

function addNewParticles() {
	// if we're at our max, stop emitting
	if (particles.length > maxParticles) return;

	// for each emitter
	for (var i = 0; i < emitters.length; i++) {
		// for [emissionRate], emit a particle
		for (var j = 0; j < emissionRate; j++) {
			particles.push(emitters[i].emitParticle());
		}
	}
}

function plotParticles(boundsX, boundsY) {
	// a new array to hold particles within our bounds
	var currentParticles = [];

	for (var i = 0; i < particles.length; i++) {
		var particle = particles[i];
		var pos = particle.position;

		// If we're out of bounds, drop this particle and move on to the next
		if (pos.x < 0 || pos.x > boundsX || pos.y < 0 || pos.y > boundsY) {
			continue;
		}

		// Move our particles
		particle.move();

		// Add this particle to the list of current particles
		currentParticles.push(particle);
	}

	// Update our global particles, clearing room for old particles
	// to be collected
	particles = currentParticles;
}

var particleSize = 1;

function draw() {
	// Set the color of our particles
	ctx.fillStyle = "rgb(0,0,255)";

	// For each particle
	for (var i = 0; i < particles.length; i++) {
		var position = particles[i].position;

		// Draw a square at our position [particleSize] wide and tall
		ctx.fillRect(position.x, position.y, particleSize, particleSize);
	}
}

function queue() {
	window.requestAnimationFrame(loop);
}

loop();

function Vector(x, y) {
	this.x = x || 0;
	this.y = y || 0;
}

// Add a vector to another 
Vector.prototype.add = function(vector) {
	this.x += vector.x;
	this.y += vector.y;
};

// Gets the length of the vector
Vector.prototype.getMagnitude = function() {
	return Math.sqrt(this.x * this.x + this.y * this.y);
};

// Gets the angle accounting for the quadrant we're in
Vector.prototype.getAngle = function() {
	return Math.atan2(this.y, this.x);
};

// Allows us to get a new vector from angle and magnitude 
Vector.fromAngle = function (angle, magnitude) {
	return new Vector(magnitude * Math.cos(angle), magnitude * Math.sin(angle))
};

function Particle(point, velocity, acceleration) {
	this.position = point || new Vector(0,0);
	this.velocity = velocity || new Vector(0,0);
	this.acceleration = acceleration || new Vector(0,0);
};

Particle.prototype.move = function() {
	// Add our current acceleration to our current velocity
	this.velocity.add(this.acceleration);

	// Add our current velocity to our position
	this.position.add(this.velocity);
};

function Emitter (point, velocity, spread) {
	this.position = point; // Vector
	this.velocity = velocity; // Vector
	this.spread = spread || Math.PI / 32; // Possible angles = velocity +/- spread
	this.drawColor = "#999"; // So we can tell them apart from fields later
};

Emitter.prototype.emitParticle = function() {
	// Use an angle randomized over the spread so we have more of a spray
	var angle = this.velocity.getAngle() + this.spread - (Math.random() * this.spread * 2);

	// The magnitude of the emitter's velocity
	var magnitude = this.velocity.getMagnitude();

	// The emitter's position
	var position = new Vector(this.position.x, this.position.y);

	// New velocity based off of the calculated angle and magnitude
	var velocity = Vector.fromAngle(angle, magnitude);

	// return our new Particle
	return new Particle(position,velocity);
};*/