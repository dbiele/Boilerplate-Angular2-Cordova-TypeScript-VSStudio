var gulp = require('gulp');
var ts = require('gulp-tsd');

gulp.task('tsd_reinstall', function (callback) {
    ts({
        command: 'reinstall',
        config: './tsd.json'
    }, callback);
});