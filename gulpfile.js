var gulp = require("gulp");
var concat = require("gulp-concat");
var livereload = require("gulp-livereload");
// minification for js
var uglify = require("gulp-uglify");
// minification for css
var minifycss = require("gulp-minify-css");


var paths = {
	// scripts: "public/scripts/lib/**/*.js",
	// scriptsDest: "public/scripts",
	styles: "public/styles/lib/**/*.css",
	stylesDest: "public/styles"
};

/*gulp.task("scripts", function() {
	gulp.src(paths.scripts)
		.pipe(concat("main.js"))
		.pipe(uglify())
		.pipe(gulp.dest(paths.scriptsDest))
		.pipe(livereload({ auto: false }))
});*/

gulp.task("styles", function() {
	return gulp.src(paths.styles)
		.pipe(concat("/main.css"))
		// .pipe(minifycss())
		.pipe(gulp.dest(paths.stylesDest))
		.pipe(livereload({ auto: false }))
});

// when run watches files for any changes
// and updates them when there are any; needs
// to constanly run
gulp.task("watch", function(){
	// starts livereload server
	livereload.listen();
	// gulp.watch(paths.scripts, ["scripts"]);
	gulp.watch(paths.styles, ["styles"]);
})

// Combined task that can be run to run
// all the tasks together; the task "default"
// can be run with just "gulp" on the command line
gulp.task("default", ["styles"]);

