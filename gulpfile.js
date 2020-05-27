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
    .src("src/index.html")
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

function scss(done) {
  gulp
    .src("src/styles/style.scss")
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
    root: "dist/",
    livereload,
    port
  });

  done && done();
}

function watch(done) {
  gulp.watch("src/**/*.scss", scss);
  gulp.watch("src/**/*.html", html);

  done && done();
}

const build = gulp.series(html, scss);

const dev = gulp.series(build, serve, watch);

exports.html = html;
exports.scss = scss;
exports.watch = watch;
exports.build = build;
exports.dev = dev;
exports.default = build;
