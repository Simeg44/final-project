$(document).on('ready', function() {
	
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
	tween.duration(3).delay(0.5);
	TweenLite.set(title, {transformPerspective:500, rotation:120, y:50});


});