var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('build', function () {
var files = [
    'src/lyrics.js',
    'src/karaoke.js',
    'src/simulate.js',
    'src/tweets.js',
    'src/twyrics.js',

];

return gulp.src(files)
    .pipe(concat('jtwyrics.min.js'))
    .pipe(gulp.dest('bin'))
    .pipe(uglify())
    .pipe(gulp.dest('bin'));
});