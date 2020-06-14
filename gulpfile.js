const gulp = require("gulp");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const terser = require("gulp-terser");
const babel = require("gulp-babel");
const sourcemaps = require("gulp-sourcemaps");
const connect = require("gulp-connect");
const imagemin = require("gulp-imagemin");
const noop = require("gulp-noop");

const { PORT, NODE_ENV } = process.env;

const port = PORT ? +PORT : 5300;
const isDev = NODE_ENV === "development";

const srcDir = "src";
const distDir = "dist";

const htmlSrc = "**/*.html";
const scssSrc = `${srcDir}/**/*.scss`;
const jsSrc = `${srcDir}/**/*.js`;
const imageSrc = [
  "src/**/*.jpg",
  "src/**/*.jpeg",
  "src/**/*.png",
  "src/**/*.gif",
  "src/**/*.svg"
];

function html(done) {
  gulp.src(htmlSrc).pipe(isDev ? connect.reload() : noop());

  done && done();
}

function scss(done) {
  gulp
    .src(scssSrc)
    .pipe(isDev ? sourcemaps.init() : noop())
    .pipe(
      sass({ outputStyle: isDev ? "expanded" : "compressed" }).on(
        "error",
        sass.logError
      )
    )
    .pipe(autoprefixer({ cascade: false, grid: "autoplace" }))
    .pipe(isDev ? sourcemaps.write(".", undefined) : noop())
    .pipe(gulp.dest(distDir))
    .pipe(isDev ? connect.reload() : noop());

  done && done();
}

function js(done) {
  gulp
    .src(jsSrc)
    .pipe(isDev ? sourcemaps.init() : noop())
    .pipe(babel({ presets: ["@babel/env"] }))
    .pipe(terser({ output: { quote_style: 0 } }))
    .pipe(isDev ? sourcemaps.write(".", undefined) : noop())
    .pipe(gulp.dest(distDir))
    .pipe(isDev ? connect.reload() : noop());

  done && done();
}

function image(done) {
  gulp
    .src(imageSrc)
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
    .pipe(gulp.dest(distDir));

  done && done();
}

function serve(done) {
  connect.server({
    root: `${distDir}/`,
    livereload: isDev,
    port
  });

  done && done();
}

function watch(done) {
  gulp.watch(htmlSrc, html);
  gulp.watch(scssSrc, scss);
  gulp.watch(jsSrc, js);
  gulp.watch(imageSrc, image);

  done && done();
}

const build = gulp.series(scss, js, image);

const dev = gulp.series(build, serve, watch);

exports.scss = scss;
exports.js = js;
exports.image = image;
exports.serve = serve;
exports.watch = watch;
exports.build = build;
exports.dev = dev;
exports.default = build;