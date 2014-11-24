var line = 1;

var renderText = function () {
	var textbox = $("<div class='intro col-lg-8 col-lg-offset-2'>");

	$("body").append(textbox);

	var text = "line" + line;
	console.log("text:", text);
	
	textbox.append("<p>")

}

$(document).on("ready", function () {

var canvas = document.createElement("canvas");
$("body").append(canvas);
var ctx = canvas.getContext("2d");

// var gui = new dat.GUI();

var particles = [];
// Add one emitter located at `{ x : 100, y : 230}` from the origin (top left)
// that emits at a velocity of `2` shooting out from the right (angle `0`)
// var emitters = [new Emitter(new Vector(100, 230), Vector.fromAngle(0, 2))];

canvas.width = $(window).width();
canvas.height = $(window).height();
ctx.fillRect(0,0, canvas.width, canvas.height);

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

function emitter(radius, color) {
	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.arc(canvas.width/2, canvas.height/2, radius, 0, Math.PI*2, true);
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

var glow = 0;
// Draw the shapes on the canvas using an interval of 30ms
setInterval(function(){

	// Erase canvas
	ctx.fillStyle = "rgba(0,0,0,0.6)";
	ctx.fillRect(0,0,canvas.width,canvas.height);

	emitter(10, "white");
	emitter(14, "rgba(255,255,255,0.7");
	emitter(17, "rgba(255,255,255,0.5");
	emitter(20, "rgba(255,255,255,0.4");
	emitter(30, "rgba(255,255,255,0.2");
	

	// Draw the particles
	for (i = 0; i < settings.density; i++) {
		if (Math.random() > 0.96) {
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

	///////////
	// Text //
	///////////

	

	// renderText();

	// $(".next").on("click", function () {
	// 	renderText();
	// })


})
