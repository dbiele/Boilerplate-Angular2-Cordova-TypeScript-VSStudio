'use strict';

var gulp = require('gulp');
var ts = require('gulp-tsd');
var tslint = require('gulp-tslint');
var sass = require('gulp-sass');
var prefixer = require('gulp-autoprefixer');
// upgrade to the latest node version or use e6-promise.  Fixes problem with `gulp-postcss "Promise is not defined"`
require('es6-promise').polyfill();

gulp.task('install.tsd', function (callback) {
    ts({
        command: 'reinstall',
        config: './tsd.json'
    }, callback);
});



gulp.task('tslint', function () {
    // TSlint build rules can be found @
    // https://github.com/palantir/tslint#supported-rules
    var tslintConfig = {
        "rules": {
            "semicolon": true,
            "requireReturnType": true,
            "requireParameterType": true,
            "jsdoc-format": true,
            "quotemark": [true, "single"],
            "variable-name": [true, "allow-leading-underscore"]
        }
    };

    return gulp.src(['scripts/**/*.ts', '!scripts/typings/**'])
      // Custom rules can be added to configuration.  rulesDirectory: 'folder/folder'
      .pipe(tslint({ configuration: tslintConfig }))
      .pipe(tslint.report('verbose', { emitError: true, reportLimit: 0 }));
});

gulp.task('build.css', function () {
    gulp.src('./scripts/components/materials/components/**/*.scss')
    // Guilp-Sass runs the pre processor on the .scss files using Sass.
    // Gulp-AutoPrefixer post processes the .css files using PostCSS.
    // CSS and Folder structure is saved to destination folder.
    .pipe(sass().on('error', sass.logError))
    .pipe(prefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(gulp.dest('./www/css'));
});
