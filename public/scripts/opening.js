var canvas = $(".canvas");
var ctx = canvas.getContext("2d");

var particles = [];
// Add one emitter located at `{ x : 100, y : 230}` from the origin (top left)
// that emits at a velocity of `2` shooting out from the right (angle `0`)
var emitters = [new Emitter(new Vector(100, 230), Vector.fromAngle(0, 2))];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function loop() {
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
};