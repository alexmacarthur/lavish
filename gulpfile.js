var gulp = require('gulp');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var autoprefix = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var rename = require("gulp-rename");
var browserSync = require('browser-sync');
var cp = require('child_process');
var concat = require('gulp-concat');
var jekyll = process.platform === "win32" ? "jekyll.bat" : "jekyll";

gulp.task('build', function (done) {
  return cp.spawn(jekyll, ['build'], {stdio: 'inherit'})
  .on('close', done);
});

gulp.task('rebuild', ['build'], function () {
  browserSync.reload();
});

gulp.task('browserSync', ['sass','scripts','build'], function() {
  browserSync({
    server: {
      baseDir: '_site'
    }
  });
});

gulp.task('jshint',function(){
  gulp.src('assets/js/scripts.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('scripts', function() {
  gulp.src(['assets/js/scripts.js', 'assets/js/hours.js'])
    .pipe(concat('scripts.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('assets/js'));
});

gulp.task('sass',function(){
  gulp.src('assets/scss/style.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(autoprefix('last 3 versions'))
    .pipe(gulp.dest('assets'));
});

gulp.task('watch', function() {
  gulp.watch('assets/js/*.js', ['jshint', 'scripts', 'rebuild']);
  gulp.watch(['*.html', '_layouts/*', '_includes/*'], ['rebuild']);
  gulp.watch('assets/scss/**/*.scss', ['sass', 'rebuild']);
});

gulp.task('default', ['browserSync', 'watch']);
