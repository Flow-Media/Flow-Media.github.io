const gulp = require("gulp");
const htmlmin = require("gulp-htmlmin");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const connect = require("gulp-connect");
const imagemin = require("gulp-imagemin");
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

function scss(done) {
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

function image(done) {
  gulp
    .src([
      "src/**/*.jpg",
      "src/**/*.jpeg",
      "src/**/*.png",
      "src/**/*.gif",
      "src/**/*.svg"
    ])
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: false }, { cleanupIDs: false }]
        })
      ])
    )
    .pipe(gulp.dest("dist"));
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
  gulp.watch("src/**/*.html", html);
  gulp.watch("src/**/*.scss", scss);
  gulp.watch(
    [
      "src/**/*.jpg",
      "src/**/*.jpeg",
      "src/**/*.png",
      "src/**/*.gif",
      "src/**/*.svg"
    ],
    image
  );

  done && done();
}

const build = gulp.series(html, scss, image);

const dev = gulp.series(build, serve, watch);

exports.html = html;
exports.scss = scss;
exports.image = image;
exports.watch = watch;
exports.build = build;
exports.dev = dev;
exports.default = build;
