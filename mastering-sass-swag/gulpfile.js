'use strict';
var path = require('path');
var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var sourcemaps = require('gulp-sourcemaps');
var sync = require('browser-sync').create();
var pathto = {
	"scss": path.join(__dirname, '/assets/scss'),
	"css" : path.join(__dirname, '/assets/css')
};
var glob = {
	"sass": path.join(pathto.scss, '/**/*.{scss,sass}')
}
gulp.task('log', done => {
	console.log(pathto.scss);
	console.log(pathto.css);
	console.log(glob.sass);
	done();
});
gulp.task('sass:compile', () => {
	return sass(glob.sass, {
		style: 'expanded',
		lineNumbers: true,
		sourcemap: true
	})
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest(pathto.css))
	.pipe(sync.stream({match: pathto.css + '/*.css'}));
});
gulp.task('sass:watch', () => {
	gulp.watch(glob.sass, gulp.series('sass:compile'));
});
gulp.task('serve', gulp.series('log', done => {
	// Set up the options for the server
	sync.init({
		server: {
			// set the root of your server relative to this file (gulpfile.js)
			baseDir: './'
		}
	});
	// Watch for changes and run any task we need
	gulp.watch(glob.sass, gulp.series('sass:compile'));
	// We can also manually run reload on files that aren't
	// in a gulp stream (files not processed by a Gulp task)
	gulp.watch('./*.html').on('change', sync.reload);
	done();
}));
gulp.task('default', gulp.series('serve'));