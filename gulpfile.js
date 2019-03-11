const gulp = require('gulp');
const ts = require('gulp-typescript');
const tsProject = ts.createProject("tsconfig.json");
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const nodemon = require('gulp-nodemon');
const jasmine = require("gulp-jasmine");


gulp.task("watch", function () {
  gulp.watch(["./**/*.ts", "!./public/**/*"], ["build"]);
});

gulp.task('run', function (done) {
  nodemon({
    script: 'dist/app.js'
    , ext: 'js'
    , env: { 'NODE_ENV': 'development' }
    , done: done
  })
})

// run only unittests, no integration tests
gulp.task("unittest", function () {
  return gulp.src("spec/models/*.js").pipe(jasmine());
});

gulp.task("build", function () {
  return tsProject.src()
    .pipe(sourcemaps.init())
    .pipe(tsProject()).js
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./dist/"));
});

// Just run integration-tests, app must have been started before (see README.md)
gulp.task("integration-test", function () {
  return gulp.src("spec/*.js").pipe(jasmine());
});

gulp.task("default", gulp.series("build", "unittest", gulp.parallel("watch", "run")));

