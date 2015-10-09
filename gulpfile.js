var gulp = require('gulp'),
gdebug = require('gulp-debug'),
debug       = require('debug')('gulp'),
gutil       = require("gulp-util"),
nodemon     = require("gulp-nodemon"),
source      = require("vinyl-source-stream"),
buffer      = require("vinyl-buffer"),
browserify  = require("browserify"),
watchify    = require("watchify"),
babelify    = require("babelify"),
envify      = require("envify"),
lrload      = require("livereactload"),
baseDir     = "./example"

var isProd = process.env.NODE_ENV === "production";

var bundler = browserify({
  entries:      [ `${baseDir}/src/index.jsx` ],
  extensions:   ['.js', '.jsx'],
  transform:    [ [babelify, {}], [envify, {NODE_ENV: process.env.NODE_ENV}] ],
  plugin:       isProd ? [] : [ lrload ],    // no additional configuration is needed
  debug:        !isProd,
  cache:        {},
  packageCache: {},
  fullPaths:    !isProd                       // for watchify
})

gulp.task("bundle:js", function() {
  return bundler
    .bundle()
    .pipe(source("bundle.js"))
    .pipe(gulp.dest(`${baseDir}/dist/`))
})

gulp.task("watch:js", function() {
  // start JS file watching and rebundling with watchify
  var watcher = watchify(bundler)
  rebundle()
  return watcher
    .on("error", gutil.log)
    .on("update", rebundle)

  function rebundle() {
    gutil.log("Update JavaScript bundle")
    watcher
      .bundle()
      .on("error", gutil.log)
      .pipe(source("bundle.js"))
      .pipe(buffer())
      .pipe(gulp.dest(`${baseDir}/dist/`))
  }
})

gulp.task("watch:server", function() {
  nodemon({ script: "server.js", ext: "js", ignore: ["gulpfile.js", "bundle.js", "node_modules/*"] })
    .on("change", [])
    .on("restart", function () {
      console.log("Server restarted")
    })
})

gulp.task("default", ["watch:server", "watch:js"])
