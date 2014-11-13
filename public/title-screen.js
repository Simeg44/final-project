$(document).on('ready', function() {

	// Play title background on loop
	var titleBackground = new Audio("/Sounds/time_passes.mp3");
	titleBackground.addEventListener('ended', function() {
	    this.currentTime = 0;
	    this.play();
	}, false);
	titleBackground.play();

	$(".fight-txt").show();
	$(".tlt-quote").textillate("start");
	$(".tlt-quote").textillate ({
		selector: ".texts",
		minDisplayTime: 0,
	});
	setTimeout(function() {
		$(".opening-quote").fadeOut("slow");
		$(".tlt-quote").textillate("stop");
	}, 6000);
	
	var title = $("#light-title");
	var container = $(".title-background");
	/*var tween = TweenMax.to(title, 0.2, {
	    textShadow:"2px 2px 15px rgba(255, 255, 255, 1)",             
	    // color:"#ffffff",
	    repeat:5,
	    repeatDelay:1,
	    yoyo:true
	});*/
	TweenLite.set(container, {perspective:200});
	var tween = TweenMax.fromTo(title, 0.7, {
	    textShadow: "0px 0px 0px rgba(0,0,0,0.3)"
	}, {
	    textShadow: "1px 1px 15px rgba(0,0,0,1)",
	    repeat: -1,
	    yoyo: true,
	    ease: Linear.easeNone
	})
	tween.duration(3).delay(0.2);

	// Change menu buttons when clicking continue
	// and append the various player objects ids
	// to the elements
	$("#continue-btn").on("click", function(){
		// When clicking on continue give a list 
		// of previously logged player options
		$("#options").css("display", "none");

		console.log(playerData);
		for(var key in playerData) {
			$("#player-options").append("<div class='title-btn'><a href='worldMap/" + playerData[key]._id + "' class='btn btn-default player'>" 
				+ playerData[key].name) + "</div>";
		}
		$("#player-options").append("<div class='title-btn'><button class='btn btn-default' id='back-btn'>Back</button></div>");
		$("#player-options").css("display", "block");
	});

	$(document).on("click", "#back-btn", function(){
		$("#player-options").css("display", "none");
		$("#options").css("display", "block");
		$("#player-options").empty();
	})

	// Play sound on button mouseover
	$(".title-background").on("mouseover", ".btn", function(){
		var mouseover = new Audio("/Sounds/rollover.wav");
		mouseover.play();
	})

	// Play sound when buttons are clicked
	$(".title-background").on("click", ".btn", function(){
		var click = new Audio("/Sounds/click3.wav");
		click.play();
	})

	$("#new-game-btn").on("click", function(){

		/*$(".fight-txt").show();
		$(".tlt").textillate("start");
		$(".tlt").textillate ({
			selector: ".texts",
			minDisplayTime: 0,
		});*/
	})

/*	$(document).on("click", ".player", function(e) {
		e.stopPropagation();


		var id = $(this).attr("id");
		var player;
		
		for(var key in playerData) {
			if(playerData[key]._id === id) {
				console.log(playerData[key]);
				player = playerData[key];
			}
		}
		console.log("id", id);
		$.get("/map", {id: id}, function(responseData) {

		})	
	})*/

});