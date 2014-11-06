
//////////////////////
// Global Variables //
//////////////////////

// array of monster markers
var markers = [];
var iterator = 0;
var turn = true;
var playerPet;
var currentMonster = {};


///////////////
// Functions //
///////////////

// Set player position and marker
var setPlayerPos = function(pos, map) {
	var image = "/Images/sparkle.png";

	var marker = new google.maps.Marker({
		position: pos,
		map: map,
		icon: image,
		animation: google.maps.Animation.BOUNCE,
		title: "Player"
	});
	playerData.location = pos;

	definePlayerPet();
	console.log(playerPet);
}

var defineMonsters = function() {
	var monsters = monsterData.map(function(item) {
		var monster = new breed[item.breed]; 
		monster.location = item.location;
		return monster;
	});
	return monsters;
}

var definePlayerPet = function() {
	playerPet = new blessing[playerData.pet.name];

	// Set client pet data to match server data
	playerPet.level = playerData.pet.level
	playerPet.currentHealth = playerData.pet.currentHealth;
	playerPet.maxHealth = playerPet.maxHealth * playerPet.level;

}

// Fill the map with monsters
var populate = function(map) {

	// Convert monsterData from database into
	// front-end constructor classes
	var localMonsters = defineMonsters();
	console.log(localMonsters);


	if (markers.length > 0) {
		for (var j = 0; j < localmonsters.length; j++) {
			markers[j].setMap(null);
		}
		markers = [];
	}

    // Calls monster.render to link the object to 
    // markers and add them to the map
    for (var i = 0; i < localMonsters.length; i++) {
    	setTimeout(function() {
    		localMonsters[iterator].render(map);
    	}, i * 200);
    }
}

// Appends modal filled with selected monster info
// into the DOM
var appendMonsterInfo = function (monster) {
	if (monster.known === false) {
		var name = $("<h3 class='monster-name'>???</h3><img class='monster-img' src='/Images/duck_shadow.jpg'>");
		var local = $("<p class='monster-pref'>Location: <span>???</span></p>");
		var descrip = $("<div class='descrip'><strong>Purifies To: <strong><p>Common: <span>???</span></p><p>Rare: <span>???</span></p></div>");
	}
	else {
		var name = $("<h3 class='monster-name'>" + monster.name + "</h3><div class='monster-thumb'><img class='monster-img' src='" + monster.image + "'></div>");

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

	$("#monster-info").modal('show');
}

// Enter fight mode 
var enterBattle = function (monster) {

	// Set global monster variable as monster 
	// that player is currently battling
	currentMonster.monster = monster;
	currentMonster.health = currentMonster.monster.health;
	console.log("currentmonster:", currentMonster);

	var audio = document.getElementById("battle-music");
	audio.play();

	// Append images of fighters to DOM
	$(".monster-img").append("<img src='" + monster.image + "'>");
	$(".pet-img").append("<img src='" + playerPet.imageBack + "'>");

	// Append health bar and health numbers to fighters
	$(".health-nums").empty();
	$(".monster-health").find(".health-nums").append("<p>" + currentMonster.health + "/" + monster.health + "</p>");
	$(".pet-health").find(".health-nums").append("<p>" + playerPet.currentHealth + "/" 
		+ playerPet.maxHealth + "</p>");

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
	var audio = document.getElementById("fight-clip")
	audio.play();

	setTimeout(function() {
		$(".fight-txt").hide();
		$(".tlt").textillate("stop");

		$("#battle").modal("show");
	}, 2500);
}

// Function for player attack
var attack = function() {
	var hit = $("<img class='hit' src='/Images/hit.png'>");
	var hitAudio = document.getElementById("hit");
	var missAudio = document.getElementById("miss");
	
	// if monster is hit change animations and health
	if (playerPet.speed+Math.random() > .9) {
		currentMonster.health = currentMonster.health - playerPet.strength;
		$(".monster").prepend(hit);
		// $(".monster-list").find(".selected").append(hit); // show hit animation on selected monster
		hitAudio.play();

		setTimeout(function() {
			$(".monster").find(".hit").remove();

			// monster defeated
			if (currentMonster.health <= 0) {
				$("#battle").modal("hide");
				// $(".monster-health").find(".health-nums").empty();
				// $(".monster-img").empty();
				// $(".pet-img").empty();
				var image = "/Images/icon_shuai.png";
				currentMonster.monster.marker.setIcon(image);

				setTimeout(function() {
					$(".monster-health").find(".health").css("width", "100%");
					currentMonster.monster.health = currentMonster.health;	 // permanently change monster health
					currentMonster.monster.marker.setIcon("/Images/cloud.png");
					var poof = document.getElementById("poof");
					poof.play();

					setTimeout(function() {
						currentMonster.monster.marker.setMap(null);
					}, 500);
				}, 1500);
				
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
		$(".monster").find(".selected").prepend("<p class='miss-text'>Miss!</p>");
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


Kakoi.prototype.render = function(map) {

	var image = {
		url: "/Images/icon_angry.png",
    	anchor: new google.maps.Point(38, 38)
    }

	var myLatLng = new google.maps.LatLng(this.location[0], this.location[1]);
	var marker = (new google.maps.Marker({
		position: myLatLng,
	    map: map,
	    icon: image,
	    animation: google.maps.Animation.DROP
	}));
	markers.push(marker);
	this.marker = marker;

	var monster = this;
	google.maps.event.addListener(marker, 'click', function(event) {

		appendMonsterInfo(monster);

		$("#fight").on("click", function() {
			enterBattle(monster);
		})

	})

	iterator++;
}


Kakoi.prototype.attack = function() {
	// var hit = $("<img class='hit' src='Images/hit.png'>");
	var hitAudio = document.getElementById("hit");
	var missAudio = document.getElementById("miss");
	

	$("#battle").find("button").attr("disabled", "disabled");
		
	setTimeout((function() {
		if (this.speed+Math.random() > 1) {
			hitAudio.play();
			console.log(hit);
			// $(".arena").find(".pet").append(hit);
			playerPet.currentHealth = playerPet.currentHealth - this.strength;
			console.log("pistis:", playerPet.currentHealth);

			$(".pet-health").find(".health-nums").empty();
			$(".pet-health").find(".health-nums").append("<p>" + playerPet.currentHealth + "/" + playerPet.maxHealth + "</p>");
			var healthLeft = (playerPet.currentHealth/playerPet.maxHealth) * 100;
			$(".pet-health").find(".health").css("width", healthLeft + "%");

			setTimeout(function() {
				$(".arena").find(".hit").remove();
			}, 200);

			// Enable buttons for attacking monster
			$("#battle").find("button").removeAttr("disabled");

		}
		else {
			missAudio.play();
			// $(".arena").prepend("<p class='action'>Miss!</p>");
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
			zoomControl: true,
			draggable: true,
			scaleControl: false,
			disableDefaultUI: true,
			scrollwheel: true,

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
		console.log(localMonsters[0]);
	})

	//Associate the styled map with the MapTypeId and set it to display.
	map.mapTypes.set('map_style', styledMap);
  	map.setMapTypeId('map_style');
}
	
	/////////////////////
	// Initialize End //
	/////////////////////

	google.maps.event.addDomListener(window, 'load', initialize);

	$(".sense").on("click", function() {
		iterator = 0;
		populate(map);

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
	})

	// Stops fight music and plays map music whenever
	// the modal is closed
	$('#battle').on('hidden.bs.modal', function (e) {
		var background = document.getElementById("background");
		var fight = document.getElementById("battle-music");

		background.play();
		fight.pause();
		fight.currentTime = 0;

		$(".monster-health").find(".health-nums").empty();
		$(".monster-img").empty();
		$(".pet-img").empty();
	})

	
	$(document).on("click", "#attack", function() {
		attack();
	})

});




