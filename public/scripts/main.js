
//////////////////////
// Global Variables //
//////////////////////

// array of monster markers
var markers = [];
var homeMarker = [];
var iterator = 0;
var turn = true;
var playerPet;
var currentMonster = {};
var myMonsters = [];
// sockets
var socketio = io.connect();
// symbols array
var symbols = ["triangle", "circle", "star", "pigtail", "x", "arrow", "caret", "check", "delete", "left curly brace", "rectangle", "v", "zig-zag"];

socketio.on("connect", function(){
	socketio.emit("setAlignment", playerData.alignment);
	socketio.emit("getLevels");
})

///////////////////////
// Gesture Functions //
///////////////////////

var analyzeGesture = function(currentSymbol) {
	$('.add-gesture').gesture(onGesture);

	function onGesture(result) {
		console.log(result.Name, result.Score);
		if (result.Name === currentSymbol) {
			console.log("success");
			// Play sounds bits
			var success = new Audio("/Sounds/shooting_star.wav");
			var purify = new Audio("/Sounds/success.mp3");
			success.play();
			purify.play();

			// remove symbol
			$(".symbol").empty();

			// white flash animation
			$(".arena").append("<div class='white-flash'></div>");

			var tl = new TimelineMax();

			tl.to(".white-flash", 0.2, {backgroundColor: "white"});
			tl.to(".white-flash", 0.2, {backgroundColor: "none"});
			tl.to(".white-flash", 0.2, {backgroundColor: "white"});
			tl.to(".white-flash", 0.2, {backgroundColor: "none"});
			tl.to(".white-flash", 0.6, {backgroundColor: "white"});
			tl.to(".white-flash", 1, {scaleX:1.7, scaleY:1.7, glowFilter:{alpha:1, blurX:450, blurY:450}, repeat:-1, yoyo:true});

			// tl.to("#battle", 0.6, {width: "0%", height: "0%"});
			tl.play();

			// remove white flash from modal and call
			// killMonster function after 3 sec
			setTimeout(function() {
				killMonster();
				purify.pause();
				purify.currentTime = 0;
			}, 2500);

		}
		else {
			console.log("miss");
			
			// remove symbol
			$(".symbol").empty();
			
			monsterEscape();
		}
	}
}


///////////////
// Functions //
///////////////

// Get global levels at set intervals
/*var globalLevels = function() {
	$.get("/getLevels", {}, function(responseData) {
		var total = responseData.kakoi + responseData.doroi;
		console.log("total", total);
		var goodPercent = (responseData.doroi / total) * 100;
		var evilPercent = (responseData.kakoi / total) * 100;

		$(".good-container").find(".percent").css("height", goodPercent + "%");
		$(".evil-container").find(".percent").css("height", evilPercent + "%");
	})
}*/

// Determine global levels of good and evil
socketio.on("currentLevels", function(levels){
	var total = levels.kakoi + levels.doroi;
	console.log("total", total);
	var goodPercent = Math.round((levels.doroi / total) * 100);
	var evilPercent = Math.round((levels.kakoi / total) * 100);

	$(".good-container").find(".percent").css("height", goodPercent + "%");
	$(".evil-container").find(".percent").css("height", evilPercent + "%");

	$(".good-nums").empty();
	$(".evil-nums").empty();
	
	$(".good-nums").append("<p>" + goodPercent + "%</p>");
	$(".evil-nums").append("<p>" + evilPercent + "%</p>");
});

// Set homebase
var setHome = function(map) {
	var image = "/Images/home_icon.png";
	var pos = new google.maps.LatLng(playerData.home.lat, playerData.home.lng);
	console.log("home pos:", pos);

	var marker = new google.maps.Marker({
		position: pos,
		map: map,
		icon: image,
		title: "Home"
	});
	homeMarker.push(marker);
}

// Set player position and marker
var setPlayerPos = function(pos, map) {
	if(playerData.marker) {
		playerData.marker.setMap(null)
	}

	if (homeMarker.length === 0) {
		setHome(map);
	}

	var image = "/Images/sparkle.png";

	var marker = new google.maps.Marker({
		position: pos,
		map: map,
		icon: image,
		animation: google.maps.Animation.BOUNCE,
		title: "Player"
	});
	playerData.location = pos;
	playerData.marker = marker;

	
}

var defineMonsters = function(map, nearbyMonsters) {

	if (playerData.alignment === "good") {
		var monsters = nearbyMonsters.map(function(item) {
			var monster = new evilBreed[item.breed]; 
			monster.location = item.location;
			return monster;
		});
		return monsters;
	}
	else {
		var monsters = nearbyMonsters.map(function(item) {
			var monster = new goodBreed[item.breed]; 
			monster.location = item.location;
			return monster;
		});
		console.log("monsters:", monsters);
		return monsters;
	}
}

var definePlayerPet = function() {
	playerPet = new blessing[playerData.pet.name];

	// Set client pet data to match server data
	playerPet.level = playerData.pet.level
	playerPet.currentHealth = playerData.pet.currentHealth;
	playerPet.maxHealth = playerPet.maxHealth * playerPet.level;

}

// Fill the map with monsters
var populate = function(map, nearbyMonsters) {

	// Convert monsterData from database into
	// front-end constructor classes
	var monsters = defineMonsters(map, nearbyMonsters);

	// If there are already markers/monsters
	if (markers.length > 0) {
		for (var j = 0; j < markers.length; j++) {
			markers[j].setMap(null);
		}
		markers = [];
		myMonsters = [];
	}

	// Calls monster.render to link the object to 
	// markers and add them to the map
	iterator = 0;
	for (var i = 0; i < monsters.length; i++) {
		setTimeout(function() {
			monsters[iterator].render(map);
		}, i);
	}
	
}

var heal = function() {
	if (playerPet.currentHealth !== playerPet.maxHealth) {
		playerPet.currentHealth = playerPet.maxHealth;
		playerData.pet.currentHealth = playerPet.maxHealth;

		homeMarker[0].setIcon("/Images/home_sparkle.png");
		setTimeout(function(){
			homeMarker[0].setIcon("/Images/home_sparkle_2.png");
			setTimeout(function(){
				homeMarker[0].setIcon("/Images/home_icon.png");
			}, 300);
		}, 300);


		var healed = new Audio("/Sounds/home_heal.wav");
		healed.play();
	}

};

var victoryScreen = function() {
	$(".victory-screen").show();
	TweenLite.to(".victory-info", .3, {
		boxShadow: "0px 0px 10px 6px black",
		backgroundColor: "black"
	});

	// Play victory music
	var victory = new Audio("/Sounds/victory_fanfare.mp3");
	victory.play();
	$(".victory-data").empty();
	
	$(".victory-data").append("<p>Experence: " + currentMonster.monster.experience + " xp</p>");
	$(".victory-data").append("<div class='items'><p><u>Drops</u></p><ul><li>Kakoi crystal shard (sm)</li></ul>");
}

// If the correct symbol is drawn kill monster
// and delete from database
function killMonster() {
	$("#battle").modal("hide");
	// $(".arena").find(".white-flash").remove();
	var image = "/Images/icon_shuai.png";
	currentMonster.monster.marker.setIcon(image);
	

	// create opposite side monster in database
	socketio.emit("create", {alignment: playerData.alignment, loc: currentMonster.monster.location});
	console.log("emit");

	// refresh global levels of g vs e for all users
	socketio.emit("refreshLevels"); 
	console.log("refresh");

	victoryScreen();

	setTimeout(function() {
		$(".monster-health").find(".health").css("width", "100%");
		$(".pet-img").empty();
		$(".arena").find(".white-flash").remove();
		currentMonster.monster.health = currentMonster.health;	 // permanently change monster health
		// currentMonster.monster.marker.setIcon("/Images/cloud.png");
		// var poof = document.getElementById("poof");
		// poof.play();

		setTimeout(function() {
			currentMonster.monster.marker.setMap(null);
		}, 500);
	}, 1000);
}

// If the wrong symbol is drawn make monster escape
// refill health and change locations
function monsterEscape() {

	var wrong = new Audio("/Sounds/wrong_answer.wav");
	wrong.play();
	$("#battle").modal("hide");
	setTimeout(function() {
		var laugh = new Audio("/Sounds/giggling.wav");
		laugh.play();
		var background = document.getElementById("background");
		background.play();
	}, 500);
}

// Appends modal filled with selected monster info
// into the DOM
var appendMonsterInfo = function (monster) {
	// Run through array of known player monsters to 
	// see if the current monster is a known one
	currentMonster.known = false;
	playerData.knownMonsters.map(function(item) {
		if (item === monster.name) {
			currentMonster.known = true;
		}
	});

	if (!currentMonster.known) {
		var name = $("<h3 class='monster-name'>???</h3><img class='monster-mini-img' src='/Images/duck_shadow.jpg'>");
		var local = $("<p class='monster-pref'>Location: <span>???</span></p>");
		var descrip = $("<div class='descrip'><strong>Purifies To: <strong><p>Common: <span>???</span></p><p>Rare: <span>???</span></p></div>");
	}
	else {
		var name = $("<h3 class='monster-name'>" + monster.name + "</h3><div class='monster-thumb'><img class='monster-mini-img' src='" + monster.image + "'></div>");

		if (monster.pref === "none") {
			var local = $("<p class='monster-pref'>Location: <span>No Preference</span></p>");
		}
		else {
			var local = $("<p class='monster-pref>Location: " + monster.pref + "</p>");
		} 

		if (monster.creates.length < 1) {
			var descrip = $("<div class='descrip'><strong>Purifies To: <strong><p>Common: <span>None</span></p><p>Rare: <span>None</span></p></div>");
		}
		else if (monster.creates.length === 1) {
			local = local + $("<p><strong>Purifies To: <strong><p>Common: " + monster.creates[0] 
				+ "</p><p>Rare: <span>None</span></p></p>");
		}
		else {
			local = local + $("<p><strong>Purifies To: <strong><p>Common: " + monster.creates[0] 
				+ "</p><p>Rare: " + monster.creates[1] + "</p></p>");
		}
	}

	$("#monster-info").find(".modal-header").append(name);
	$("#monster-info").find(".modal-body").append(local).append(descrip);

	$(".monster-img").empty();
	$(".pet-img").empty();
	$("#monster-info").modal('show');

	// currentMonster.monster = monster;
	// currentMonster.health = currentMonster.monster.health;
	// console.log("currentmonster:", currentMonster);
}

// Enter fight mode 
var enterBattle = function (monster) {

	socketio.emit("killed", {loc: monster.location, alignment: playerData.alignment});

	// Set global monster variable as monster 
	// that player is currently battling
	currentMonster.monster = monster;
	currentMonster.health = currentMonster.monster.health;
	console.log("currentmonster:", currentMonster);

	// Play fight music on loop
	var audio = document.getElementById("battle-music");
	audio.addEventListener("ended", function(){
		this.currentTime = 0;
		this.play();
	}, false);
	audio.play();

	// Append images of fighters to DOM
	$(".monster-img").append("<img src='" + currentMonster.monster.image + "'>");
	$(".pet-img").append("<img src='" + playerPet.imageBack + "'>");

	// Append health bar and health numbers to monster
	$(".health-nums").empty();
	$(".monster-health").find(".health-nums").append("<p>" + currentMonster.monster.health + "/" + currentMonster.monster.health + "</p>");
	var monsterHealthLeft = (currentMonster.health/currentMonster.monster.health) * 100;
	$(".monster-health").find(".health").css("width", monsterHealthLeft + "%");

	// Append health bar and numbers to pet
	$(".pet-health").find(".health-nums").append("<p>" + playerPet.currentHealth + "/" 
		+ playerPet.maxHealth + "</p>");
	var petHealthLeft = (playerPet.currentHealth/playerPet.maxHealth) * 100;
	$(".pet-health").find(".health").css("width", petHealthLeft + "%");

	// Enable buttons for attacking monster
	$("#battle").find("button").removeAttr("disabled");
	console.log("playerpet:", playerPet);
	
	// Pauses map background music and resets it to the
	// start of the song
	var background = document.getElementById("background");
	background.pause();
	background.currentTime = 0;

	// Animates the "Fight!" text
	$(".fight-txt").show();
	$(".tlt").textillate("start");
	$(".tlt").textillate ({
		selector: ".texts",
		minDisplayTime: 0,
	});

	// Plays fight screen music
	var audio = document.getElementById("fight-clip");
	audio.play();

	setTimeout(function() {
		$(".fight-txt").hide();
		$(".tlt").textillate("stop");

		$("#battle").modal("show");
	}, 2500);
}

// Function for player attack
var attack = function() {
	var hitAudio = document.getElementById("hit");
	var missAudio = document.getElementById("miss");
	
	// if monster is hit change animations and health
	if (playerPet.speed+Math.random() > .9) {
		currentMonster.health = currentMonster.health - playerPet.strength;

		// Shake animation
		TweenLite.fromTo(".monster-img", 0.5, {x:-2}, {x:2, ease:RoughEase.ease.config({strength:8, points:20, template:Linear.easeNone, randomize:false}) , clearProps:"x"})
		hitAudio.play();

		setTimeout(function() {

			// monster defeated
			if (currentMonster.health <= 0) {
				$(".symbol").css("display", "block");
				// Attach a random image of a symbol
				var currentSymbol = _.sample(symbols)
				$(".symbol").append("<div class='add-gesture'><img src='/Images/symbols/" + currentSymbol + ".png'></div>");
				TweenMax.to(".add-gesture", 1, {scaleX:1.1, scaleY:1.1, repeat:-1, yoyo:true});
				// TweenMax.to(".add-gesture", 1, {scaleX:1.4, scaleY:1.4, glowFilter:{color:0x91e600, alpha:1, blurX:50, blurY:50}, repeat:-1, yoyo:true});

				analyzeGesture(currentSymbol);
				// $('.add-gesture').gesture(onGesture);
    
			}
			else {
				$(".monster-health").find(".health-nums").empty();
				$(".monster-health").find(".health-nums").append("<p>" + currentMonster.health + "/" + currentMonster.monster.health + "</p>");
				var healthLeft = (currentMonster.health/currentMonster.monster.health) * 100;
				$(".monster-health").find(".health").css("width", healthLeft + "%");


				currentMonster.monster.attack();
			}
		}, 200);


	}
	// player misses monster
	else {
		missAudio.play();

		// Miss animation
		TweenLite.to(".pet-img", 0.5, {xPercent: 20});
		TweenLite.to(".pet-img", 0.5, {xPercent: 0, delay:1});

		console.log("player misses");
		currentMonster.monster.attack();

		setTimeout(function() {
			$(".monster-list").find(".miss-text").remove();
		}, 200);
	}
		
}

////////////////
// Prototypes //
////////////////


Monster.prototype.render = function(map) {
	var image;

	// set monster icon based on alignment
	if (playerData.alignment === "good") {
		image = {
			url: "/Images/cloud-icon-bad.png",
	    	anchor: new google.maps.Point(38, 38)
	    }
	}
	else {
		image = {
			url: "/Images/cloud-icon-good.png",
	    	anchor: new google.maps.Point(38, 38)
	    }
	}


	var myLatLng = new google.maps.LatLng(this.location.lng, this.location.lat);
	var marker = (new google.maps.Marker({
		position: myLatLng,
	    map: map,
	    icon: image
	    // animation: google.maps.Animation.DROP
	}));
	// add markers to global array
	markers.push(marker);
	this.marker = marker;

	// add monsters to global array
	myMonsters.push(this);
	var monster = this;
	google.maps.event.addListener(marker, 'click', function(event) {
		
		appendMonsterInfo(monster);

		$("#fight").on("click", function() {
				

			var location = monster.marker.position.k + "," + monster.marker.position.B;
			// var url = "url('https://maps.googleapis.com/maps/api/streetview?size=600x400&location=" + location + "&heading=235&fov=40')";
			var url = "https://maps.googleapis.com/maps/api/streetview?size=600x400&location=" + location + "&heading=235&fov=40";
			console.log("monster marker pos:", url);
			// panorama = map.getStreetView();
			// panorama.setPosition(monster.marker.position);
			// panorama.setPov(/** @type {google.maps.StreetViewPov} */({
			//     heading: 265,
			//     pitch: 0
		 //  	}));

			// console.log(panorama);
		  	// $(".arena").css("background", url);
		  	$(".arena-img").append("<img src='/Images/downtown_boulder3.jpg'>");
			enterBattle(monster);
		});

	})

	iterator++;
}


Monster.prototype.attack = function() {
	var hitAudio = document.getElementById("hit");
	var missAudio = document.getElementById("miss");
	

	$("#battle").find("button").attr("disabled", "disabled");
		
	setTimeout((function() {
		if (this.speed+Math.random() > 1) {
			hitAudio.play();

			// Shake screen if player is hit
			TweenLite.fromTo(".pet-img", 0.5, {x:-2}, {x:2, ease:RoughEase.ease.config({strength:8, points:20, template:Linear.easeNone, randomize:false}) , clearProps:"x"})
			
			playerPet.currentHealth = playerPet.currentHealth - this.strength;
			console.log("pistis:", playerPet.currentHealth);

			$(".pet-health").find(".health-nums").empty();
			$(".pet-health").find(".health-nums").append("<p>" + playerPet.currentHealth + "/" + playerPet.maxHealth + "</p>");
			var healthLeft = (playerPet.currentHealth/playerPet.maxHealth) * 100;
			$(".pet-health").find(".health").css("width", healthLeft + "%");


			// Enable buttons for attacking monster
			$("#battle").find("button").removeAttr("disabled");

		}
		else {
			missAudio.play();

			// Miss animation
			TweenLite.to(".pet-img", 0.5, {xPercent: 20});
			TweenLite.to(".pet-img", 0.5, {xPercent: 0, delay:1});
			console.log("monster misses");

			// Enable buttons for attacking monster
			$("#battle").find("button").removeAttr("disabled");
		}
	}).bind(this), 1000);
	
}

///////////////////////
// Document On Ready //
///////////////////////

$(document).on('ready', function() {
	
	TweenMax.to("#good-percent", .3, {
	    boxShadow: "0px 0px 24px 6px white",
	    backgroundColor:"white",
	    color:"#999"
	});	

	TweenMax.to("#evil-percent", .3, {
	    boxShadow: "0px 0px 24px 6px black",
	    backgroundColor:"black",
	    color:"#999"
	});


	TweenMax.to(".evil-nums", 0.2, {
	    textShadow:"2px 2px 15px rgba(0, 0, 0, 1)",             
	    color:"white"
	});

	TweenMax.to(".good-nums", 0.2, {
	    textShadow:"2px 2px 15px rgba(255, 255, 255, 1)",             
	    color:"white"
	});



	definePlayerPet();
	console.log(playerPet);

	var map;

	var background = document.getElementById("background");
	background.addEventListener('ended', function() {
	    this.currentTime = 0;
	    this.play();
	}, false);
	background.play();

	var styles = [
	    {
	        "featureType": "water",
	        "stylers": [
	            {"color": "#021019"}
	        ]
	    },
	    {
	        "featureType": "landscape",
	        "stylers": [
	            {"color": "#08304b"}
	        ]
	    },
	    {
	        "featureType": "poi",
	        "elementType": "geometry",
	        "stylers": [
	            {"color": "#0c4152" },
	            {"lightness": 5}
	        ]
	    },
	    {
	        "featureType": "road.highway",
	        "elementType": "geometry.fill",
	        "stylers": [
	            {"color": "#000000"}
	        ]
	    },
	    {
	        "featureType": "road.highway",
	        "elementType": "geometry.stroke",
	        "stylers": [
	            {"color": "#0b434f"},
	            {"lightness": 25}
	        ]
	    },
	    {
	        "featureType": "road.arterial",
	        "elementType": "geometry.fill",
	        "stylers": [
	            {"color": "#000000"}
	        ]
	    },
	    {
	        "featureType": "road.arterial",
	        "elementType": "geometry.stroke",
	        "stylers": [
	            {"color": "#0b3d51"},
	            {"lightness": 16}
	        ]
	    },
	    {
	        "featureType": "road.local",
	        "elementType": "geometry",
	        "stylers": [
	            {"color": "#000000"}
	        ]
	    },
	    {
	        "elementType": "labels.text.fill",
	        "stylers": [
	            {"color": "#ffffff"}
	        ]
	    },
	    {
	        "elementType": "labels.text.stroke",
	        "stylers": [
	            {"color": "#000000"},
	            {"lightness": 13}
	        ]
	    },
	    {
	        "featureType": "transit",
	        "stylers": [
	            {"color": "#146474"}
	        ]
	    },
	    {
	        "featureType": "administrative",
	        "elementType": "geometry.fill",
	        "stylers": [
	            {"color": "#000000"}
	        ]
	    },
	    {
	        "featureType": "administrative",
	        "elementType": "geometry.stroke",
	        "stylers": [
	            {"color": "#144b53"},
	            {"lightness": 14},
	            {"weight": 1.4}
	        ]
	    }
	];

	// Create a new StyledMapType object, passing it the array of styles,
  	// as well as the name to be displayed on the map type control.
	var styledMap = new google.maps.StyledMapType(styles, 
		{name: "Styled Map"});

$('#battle').on('hidden.bs.modal', function (e) {
  $(".monster-list, #run, #attack, #fight").off("click");
})

////////////////
// Initialize //
////////////////
	function initialize() {
		var mapOptions = {
			zoom: 15,
			zoomControl: false,
			draggable: true,
			scaleControl: false,
			disableDefaultUI: true,
			scrollwheel: true,
			streetViewControl: false,

		     // Include the MapTypeId to add to the map type control
		    mapTypeControlOptions: {
		    	mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
		    }
		};
		map = new google.maps.Map(document.getElementById('map-canvas'),
		      mapOptions);


		///////////////////
		// Geolocation //
		///////////////////
	  	if(navigator.geolocation) {
	  	navigator.geolocation.getCurrentPosition(function(position) {
	  		var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

	  		var infoWindow = new google.maps.InfoWindow({
	  			map: map,
	  			position: pos,
	  			content: ""
	  		});

	  		map.setCenter(pos);

	  		// Set map's center as player's location
	  		setPlayerPos(pos, map);

	  	}, function() {
	  		handleNoGeolocation(true);
	  	});
	  } else {
	  	// Browser does not support Geolocation
	  	handleNoGeolocation(false);
	  }
	

	function handleNoGeolocation(errorFlag) {
		if(errorFlag) {
			var content = '';
  		} else {
    		var content = 'Error: Your browser doesn\'t support geolocation.';
  		}

  		var options = {
    		map: map,
    		position: new google.maps.LatLng(40.0176, -105.2797),
    		content: content
  		};

  		var infowindow = new google.maps.InfoWindow(options);
  		map.setCenter(options.position);

  		// Set map's center as player's location
  		setPlayerPos(options.position, map);

	}

	// Construct a circle for each value in city map
	// with an area based on its population
	for (var city in citymap) {
		var populationOptions = {
			strokeColor: "#ff0000",
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: "#ff0000",
			fillOpacity: 0.35,
			map: map,
			center: citymap[city].center,
			radius: Math.sqrt(citymap[city].population)*10
		};
		// Add circle for this city to the map
		cityCircle = new google.maps.Circle(populationOptions);
	}

	var rectangle = new google.maps.Rectangle({
		strokeColor: "#ff0000",
		strokeOpacity: 0.3,
		strokeWeight: 2,
		map: map,
		bounds: denverArea.bounds
	});

	google.maps.event.addListener(map, 'tilesloaded', function() {
		setTimeout(function(){
			$(".map-loading").hide("slow");
		}, 5000);
	})

	google.maps.event.addListener(map, 'click', function(event) {
		var lat = event.latLng.lat();
		var lng = event.latLng.lng();
		console.log(lat, lng);
	})


	//Associate the styled map with the MapTypeId and set it to display.
	map.mapTypes.set('map_style', styledMap);
  	map.setMapTypeId('map_style');
}
	
	/////////////////////
	// Initialize End //
	/////////////////////

	google.maps.event.addDomListener(window, 'load', initialize);
	
	

	// Moves player around the map manually (temporary)
	$(document).keydown(function(e) {
		var latCenter = map.getCenter().k;
		var lngCenter = map.getCenter().B;

		switch(e.which) {
			case 37: // left
				lngCenter-= 0.001;
				break;
			case 38: // up
				latCenter+= 0.001
	        	break;
	        case 39: // right
	        	lngCenter+= 0.001;
	        	break;
	        case 40: // down
	        	latCenter-= 0.001;
	        	break;
			default: return;
		}
		var newPos = new google.maps.LatLng(latCenter, lngCenter);
		map.setCenter(newPos);

	  	// Set map's center as player's location
	  	setPlayerPos(newPos, map);
	  	// Display home marker on map

	  	socketio.emit("newPos", {coor: [lngCenter, latCenter], alignment: playerData.alignment});
	  	var home = new google.maps.LatLng(playerData.home.lat, playerData.home.lng);
	  	var distance = google.maps.geometry.spherical.computeDistanceBetween(newPos, home);
	  	console.log("distance from home:", distance);
	  	if (distance < 200) {
	  		heal();
	  	}

	});



	// Reload monster data after player moves 1100 meters
	socketio.on("newMonsters", function(newMonsters){
		if (markers.length > 0) {
			populate(map, newMonsters);
		}
	});

	socketio.on("removeMonster", function(loc){
		myMonsters.map(function(item) {
			if(item.location.lat === loc.lat && item.location.lng === loc.lng) {
				item.marker.setMap(null);
			}
		})
	});

	socketio.on("justBorn", function(newMonster){
		console.log(newMonster);
		var monster;

		if (playerData.alignment === "good") {
			monster = new evilBreed[newMonster.breed]; 
			monster.location = newMonster.location;
		}
		else {
			monster = new goodBreed[newMonster.breed]; 
			monster.location = newMonster.location;
		}
		console.log("monster:", monster);
		console.log("map", map);
		monster.render(map);
	});

	// $("#fight").on("click", function() {
			
	// 	enterBattle(monster);
	// });

	$(".sense").on("click", function() {

		var lat = map.getCenter().k;
		var lng = map.getCenter().B;

		console.log(playerData.alignment);
		$.get("/populate", {lat: lat, lng: lng, alignment: playerData.alignment}, function(responseData) {
			populate(map, responseData);
		});

		var audio = document.getElementById("sonar-ping");
		audio.play();
	})

	$(".sense").hover(
		function() {
			$(this).addClass("glow");
		}, function() {
			$(this).removeClass("glow");
	});

	// clears modal window after each close
	$('#monster-info').on('hidden.bs.modal', function (e) {
		$(this).find(".modal-header").empty();
		$(this).find(".modal-body").empty();
		$("#fight").off("click");
	})

	// Stops fight music and plays map music whenever
	// the modal is closed
	$('#battle').on('hidden.bs.modal', function (e) {

		var fight = document.getElementById("battle-music");

		fight.pause();
		fight.currentTime = 0;

		$(".monster-health").find(".health-nums").empty();
		$(".monster-img").empty();
		$(".pet-img").empty();
		// $(".symbol").empty();
		$(".symbol").css("display", "none");
	})

	
	$(document).on("click", "#attack", function() {
		attack();
	});

	$("#victory").on("click", "button", function() {
		$(this).closest(".victory-screen").hide();

		var background = document.getElementById("background");
		background.play();
	})

});





