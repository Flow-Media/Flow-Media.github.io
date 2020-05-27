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

function html(done) {
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

  done && done();
}

function css(done) {
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

  done && done();
}

function serve(done) {
  connect.server({
    root: "dist",
    livereload,
    port
  });

  done && done();
}

function build(done) {
  gulp.series(html, css);

  done && done();
}

function dev(done) {
  build(done);

  serve(done);

  gulp.watch("src/**/*.scss", css);
  gulp.watch("src/**/*.html", html);

  done && done();
}

exports.html = html;
exports.css = css;
exports.build = build;
exports.dev = dev;
exports.default = build;
