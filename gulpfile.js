const gulp = require("gulp");
const htmlmin = require("gulp-htmlmin");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const connect = require("gulp-connect");
const noop = require("gulp-noop");

const { PORT, NODE_ENV } = process.env;

const port = PORT ? +PORT : 5300;
const isDev = NODE_ENV === "development";
const livereload = true;

function html() {
  gulp
    .src("src/**/*.html")
    .pipe(
      !isDev
        ? htmlmin({
            caseSensitive: true,
            collapseWhitespace: true,
            removeComments: true,
            decodeEntities: true
          })
        : noop()
    )
    .pipe(gulp.dest("dist"))
    .pipe(livereload ? connect.reload() : noop());
}

function css() {
  gulp
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
    .pipe(livereload ? connect.reload() : noop());
}

function serve() {
  connect.server({
    root: "dist",
    livereload,
    port
  });
}

function build() {
  gulp.series(html, css);
}

function dev() {
  build();

  serve();

  gulp.watch("src/**/*.scss", css);
  gulp.watch("src/**/*.html", html);
}

exports.html = html;
exports.css = css;
exports.build = build;
exports.dev = dev;
exports.default = build;
