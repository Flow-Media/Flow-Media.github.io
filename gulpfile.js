import gulp from "gulp";
import htmlmin from "gulp-htmlmin";
import sass from "gulp-sass";
import autoprefixer from "gulp-autoprefixer";
import sourcemaps from "gulp-sourcemaps";
import livereload from "gulp-livereload";
import noop from "gulp-noop";

const isDev = process.env.NODE_ENV === "development";

export function html() {
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

export function css() {
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

export function watch() {
  livereload.listen({}, () => {
    console.log("livereload is running...");
  });

  gulp.watch("src/styles/**/*.scss", css);
  gulp.watch("src/**/*.html", html);
}

export function build() {
  return gulp.series(html, css);
}

export default build;
