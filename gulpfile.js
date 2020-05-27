const gulp = require("gulp");
const htmlmin = require("gulp-htmlmin");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const livereload = require("gulp-livereload");
const noop = require("gulp-noop");

const isDev = process.env.NODE_ENV === "development";

function html() {
  return gulp
    .src("src/**/*.html")
    .pipe(
      htmlmin({
        caseSensitive: true,
        collapseWhitespace: true,
        removeComments: true,
        decodeEntities: true
      })
    )
    .pipe(gulp.dest("dist"))
    .pipe(livereload());
}

function css() {
  return gulp
    .src("src/**/*.scss")
    .pipe(isDev ? sourcemaps.init() : noop())
    .pipe(
      sass({ outputStyle: isDev ? "expanded" : "compressed" }).on(
        "error",
        sass.logError
      )
    )
    .pipe(autoprefixer({ cascade: false, grid: "autoplace" }))
    .pipe(isDev ? sourcemaps.write(".") : noop())
    .pipe(gulp.dest("dist"))
    .pipe(livereload());
}

function watch() {
  livereload.listen({}, () => {
    console.log("livereload is running...");
  });

  gulp.watch("src/styles/**/*.scss", css);
  gulp.watch("src/**/*.html", html);
}

function build() {
  return gulp.series(html, css);
}

exports.html = html;
exports.css = css;
exports.watch = watch;
exports.build = build;
exports.default = build;
