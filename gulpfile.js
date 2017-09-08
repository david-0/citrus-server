var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
var sourcemaps = require("gulp-sourcemaps");
var spawn = require("child_process").spawn;
var runSequence = require("run-sequence");
var jasmine = require("gulp-jasmine");

gulp.task("default", function () {
  runSequence("build", "unittest", ["watch", "run"]);
});

gulp.task("watch", function () {
  gulp.watch(["./**/*.ts", "!./public/**/*"], ["build"]);
});

gulp.task("run", function () {
  spawn("node", ["src/app.js"], {stdio: "inherit"});
});

gulp.task("build", function () {
  return tsProject.src()
    .pipe(sourcemaps.init())
    .pipe(tsProject()).js
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./src/"));
});

// Just run integration-tests, app must have been started before (see README.md)
gulp.task("integration-test", function () {
  return gulp.src("spec/*.js").pipe(jasmine());
});

// run only unittests, no integration tests
gulp.task("unittest", function () {
  return gulp.src("spec/models/*.js").pipe(jasmine());
});
