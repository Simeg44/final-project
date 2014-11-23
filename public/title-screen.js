// Keeps track of where a side had been chosen
var sideActive = false;

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
	    textShadow: "0px 0px 0px rgba(255,255,255,0.3)"
	}, {
	    textShadow: "1px 1px 15px rgba(255,255,255,1)",
	    repeat: -1,
	    yoyo: true,
	    ease: Linear.easeNone
	})
	tween.duration(3).delay(0.2);

	var tween2 = TweenMax.fromTo(".title-reverse", 0.7, {
	    textShadow: "0px 0px 0px rgba(255,255,255,0.3)"
	}, {
	    textShadow: "1px 1px 15px rgba(255,255,255,1)",
	    repeat: -1,
	    yoyo: true,
	    ease: Linear.easeNone
	})
	tween2.duration(3).delay(0.4);

	TweenMax.to(".title-background", .3, {
	    boxShadow: "0px 0px 24px 6px black",
	    backgroundColor:"black",
	    color:"#999"
	});

	//////////////
	// Continue //
	//////////////

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

	// Return to main menu selection from continue button
	$(document).on("click", "#back-btn", function(){
		$("#player-options").css("display", "none");
		$("#options").css("display", "block");
		$("#player-options").empty();
	});

	// Return to main menu selection from new game button
	$(document).on("click", "#back-btn2", function(){
		$(".title-background").css("backgroundImage", "url('/Images/tempcover.png')");
		$("#options").show();
		$(".sides").hide();
		$("#light-title").show();
		$("#dark-title").show();
		$(this).remove();
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

	///////////////
	// New Game //
	///////////////

	// When starting new game hide main titles and 
	// change background to grayed out one
	$("#new-game-btn").on("click", function(){
		$(".title-background").css("backgroundImage", "url('/Images/tempcover-choose.png')");
		// $(".evil-side").css("color", "gray");
		// $(".good-side").css("color", "gray");
		$(".sides").show()

		// hide Pandoran titles
		$("#light-title").hide();
		$("#dark-title").hide();

		// Hide main menu buttons
		$("#options").hide();
		$(".title-background").append("<div class='title-btn'><button class='btn btn-default' id='back-btn2'>Back</button></div>");
	})

	// When the player clicks on good side change background
	// and bring up info box
	$(".good-side").on("click", function(){
		if (sideActive === false) {
			$(".title-background").css("backgroundImage", "url('/Images/tempcover-good.png')");
			$(".evil-side").hide();
			$(".good-side").show();
			$(".good-side").css("color", "white");

			// Fill info box and add buttons
			TweenMax.to(".good-side", .8, {color: "#000000", right:"63%", zIndex: 2, textShadow: "none"});
			setTimeout(function() {
				$(".good-side").append("<div class='choice-btns'><button id='mychoice' class='btn btn-default'>Continue</button><button id='choose-again-good' class='btn btn-default'>Go Back</button></div>");
			}, 800);

			// Temp hide choice and back button
			$(".choose").hide();
			$("#back-btn2").hide();

			// toggle info boxes
			$(".good-info-box").fadeToggle();
			$(".evil-info-box").hide();

			// Makes sure side cant be clicked a second time
			sideActive = true;
		}
	})

	// After hitting the back button return to main choice page
	$(document).on("click", "#choose-again-good", function () {
		sideActive = false;
		$(".title-background").css("backgroundImage", "url('/Images/tempcover-choose.png')");
		$(".evil-side").show();
		TweenMax.to(".good-side", .8, {color: "white", right:"10%", zIndex: 1, textShadow: "2px 2px black"});
		$(".good-info-box").hide();
		$(".good-side").find(".choice-btns").remove();
		$("#back-btn2").show();
		$(".choose").show();
	})

	// When the player chooses the evil side change background
	// and bring up info box
	$(".evil-side").on("click", function(){
		if (sideActive === false) {
			$(".title-background").css("backgroundImage", "url('/Images/tempcover-evil.png')");
			$(".evil-side").css("color", "white");
			$(".evil-side").show();
			$(".good-side").hide();

			// Fill info box and add buttons
			TweenMax.to(".evil-side", .8, {color: "#000000", left:"60%", zIndex: 2, textShadow: "none"});
			// $(".evil-info").fadeToggle();
			setTimeout(function() {
				$(".evil-side").append("<div class='choice-btns'><a href='/opening' id='mychoice-evil' class='btn btn-default'>Continue</a><button id='choose-again' class='btn btn-default'>Go Back</button></div>");
			}, 800);
			
			// Temp hide choice and back button
			$(".choose").hide();
			$("#back-btn2").hide();

			// toggle info boxes
			$(".evil-info-box").fadeToggle();
			$(".good-info-box").hide();

			// Makes sure side cant be clicked a second time
			sideActive = true;
		}
	})

	// After hitting the back button return to main choice page
	$(document).on("click", "#choose-again-evil", function () {
		$(".title-background").css("backgroundImage", "url('/Images/tempcover-choose.png')");
		$(".good-side").show();
		TweenMax.to(".evil-side", .8, {color: "white", left:"10%", zIndex: 1, textShadow: "2px 2px black"});
		$(".evil-info-box").hide();
		$(".evil-side").find(".choice-btns").remove();
		$(".choose").show();
		$("#back-btn2").show();
		sideActive = false;
	});

	$(document).on("click", "#mychoice-evil", function () {
		// body...
	})





});