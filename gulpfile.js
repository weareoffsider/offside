var gulp       = require("gulp"),
    browserify = require("browserify"),
    source     = require("vinyl-source-stream"),
    streamify  = require("gulp-streamify"),
    uglify     = require("gulp-uglify"),
    babelify   = require("babelify"),
    babel      = require("gulp-babel"),
    envify     = require("envify/custom"),
    gutil      = require("gulp-util")


var PATHS = {
  root: "./src/Offside.js",
  src: "./src",
  test: "./test",
  out: "./node",
  dist: "./dist"
}

gulp.task("scripts:compile", function() {
  var stream = gulp.src([
    PATHS.src + "/**/*.js"
  ], { base: PATHS.src })

  stream = stream.pipe(babel())

  return stream.pipe(gulp.dest(PATHS.out))
})

gulp.task("scripts:bundle", function() {
  var bundleStream = browserify({debug: true})
    .transform(envify({
      NODE_ENV: "development"
    }))
    .require(require.resolve(PATHS.out + "/Offside.js"), {entry: true})
    .bundle()

  bundleStream.pipe(source("Offside.js"))
              .pipe(gulp.dest(PATHS.dist))
})


gulp.task('test', function() {
  gulp.watch(PATHS.src + '/**/*.js', ['scripts:compile', "scripts:bundle"])
})

gulp.task("default", ["scripts:compile", "scripts:bundle"], function() {
  gulp.start("test")
})
