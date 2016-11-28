var gulp          = require('gulp');
var del           = require('del');
var sass          = require('gulp-sass');
var watch         = require('gulp-watch');
var concat        = require('gulp-concat');
var jshint        = require('gulp-jshint');
var uglify        = require('gulp-uglify');
var plumber       = require('gulp-plumber');
var imagemin      = require('gulp-imagemin');
var pngquant      = require('imagemin-pngquant');
var cleanCSS      = require('gulp-clean-css');
var sourcemaps    = require('gulp-sourcemaps');
var autoprefixer  = require('gulp-autoprefixer');
var browserSync   = require('browser-sync').create();

// --------------------------------------------------------------------
// Settings
// --------------------------------------------------------------------
var src = {
  sass:     "./sass/**/*",
  sassFile: "./sass/main.sass",
  js:       "./scripts/**/*.js",
  img:      "./img/**/*",
  html:     "./**/*.html"
};

var output = {
  css:    "./css",
  js:     "./js",
  img:    "./img",
  html:   "./**/*.html",
  root:   "./",
  minCSS: "main.min.css",
  minJS:  "main.min.js"
};

// --------------------------------------------------------------------
// Error Handler
// --------------------------------------------------------------------
var onError = function(err) {
  console.log(err);
  this.emit('end');
};

// --------------------------------------------------------------------
// Task: Sass
// --------------------------------------------------------------------
gulp.task('sass', function() {
  return gulp.src(src.sassFile)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sass())
    .pipe(autoprefixer('last 15 versions'))
    .pipe(concat(output.minCSS))
    .pipe(gulp.dest(output.css))
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(output.css))
    .pipe(browserSync.reload({ stream: true }));
});

// --------------------------------------------------------------------
// Task: JS
// --------------------------------------------------------------------
gulp.task('js', function() {
  return gulp.src(src.js)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(jshint.reporter('default'))
    .pipe(uglify())
    .pipe(concat(output.minJS))
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(output.js))
    .pipe(browserSync.reload({ stream: true }));
});

// --------------------------------------------------------------------
// Task: HTML
// --------------------------------------------------------------------
gulp.task('html', function() {
  return gulp.src(src.html)
    .pipe(gulp.dest(output.root))
    .pipe(browserSync.reload({ stream: true }));
});

// --------------------------------------------------------------------
// Task: Images
// --------------------------------------------------------------------
gulp.task('images', function() {
  gulp.src(src.img)
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}, {cleanupIDs: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest(output.img));
});

// --------------------------------------------------------------------
// Task: Serve
// --------------------------------------------------------------------
gulp.task('serve', ['clean', 'sass', 'js'], function() {
  browserSync.init({
    server: output.root,
    notify: false
  });
  gulp.watch(src.js, ['js']);
  gulp.watch(src.sass, ['sass']);
  gulp.watch(src.img, ['images']);
  gulp.watch(output.html).on('change', browserSync.reload);
});

// --------------------------------------------------------------------
// Task: Clean
// --------------------------------------------------------------------
gulp.task('clean', function() {
  del(['css', 'js']);
});

// --------------------------------------------------------------------
// Task: Default
// --------------------------------------------------------------------
gulp.task('default', ['serve']);
