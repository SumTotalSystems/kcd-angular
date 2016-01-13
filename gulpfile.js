(function () {
  var $ = require('gulp-load-plugins')(),
    gulp = require('gulp'),
    rimraf = require('rimraf');

  gulp.task('clean', function (cb) {
    rimraf('dist', cb);
  });

  gulp.task('build-module', ['clean'], function () {
    return gulp.src('src/**/*.js')
      .pipe($.angularModule({
        masterModule: 'kcd'
      }))
      .pipe($.filter('kcd.js'))
      .pipe(gulp.dest('dist'));
  });

  gulp.task('build', ['build-module', 'clean'], function () {
    return gulp.src(['dist/kcd.js', 'src/**/module.js', 'src/**/*.js'])
      .pipe($.concat('kcd.js'))
      .pipe(gulp.dest('dist'))
      .pipe($.rename('kcd.min.js'))
      .pipe(gulp.dest('dist'));
  });

  gulp.task('default', ['clean', 'build'], function () {

    return gulp.src('dist/kcd.min.js')
      .pipe($.sourcemaps.init())
      .pipe($.uglify())
      .pipe($.sourcemaps.write('./'))
      .pipe(gulp.dest('dist'));

  });
}())
