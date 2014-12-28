var gulp = require('gulp'),
	gutil = require('gulp-util'),
	path = require('path'),
	argv = require('yargs')
		.alias('p', 'port')
		.alias('s', 'server')
		.argv;

var devServer = {
	port: argv.port || getRandomPortBasedOnPath(31337),
	server: argv.server || '0.0.0.0',
	livereload: getRandomPortBasedOnPath(35000),
	root: './'
};

gulp.task('default', ['start static server', 'watch changes']);
gulp.task('build', ['make dist', 'browserify', 'copy dist']);


gulp.task('browserify', runBrowserify);

var paths = {
  scripts: ['src/**/*.*'],
  markup: ['src/*.html'],
  styles: { paths: [ path.join(__dirname, 'src/styles') ] }
};

function runBrowserify() {
  var fs = require('fs');

  var bundle = require('browserify')()
    .add('./src/scripts/index.js')
    .bundle()
    .on('error', function (err) {
        gutil.log(gutil.colors.red('Failed to browserify'), gutil.colors.yellow(err.message));
    });
  bundle.pipe(fs.createWriteStream(path.join(__dirname + '/dist/bundle.js')));
}


gulp.task('make dist', function() {
	var fs = require('fs');
	if (!fs.existsSync('./dist')) {
		fs.mkdirSync('./dist');
	}
});


gulp.task('copy dist', copyDist);
function copyDist() {
	gulp.src('./src/index.html')
      .pipe(gulp.dest('./dist'));
}

gulp.task('start static server', startStaticServer);
var lr;
function startStaticServer() {
  var express = require('express');
  var app = express();
  app.use(require('connect-livereload')({port: devServer.livereload }));
  app.use(express.static(devServer.root));
  app.listen(devServer.port, devServer.server, function () {
    gutil.log("opened server on http://" + devServer.server + ":" + devServer.port);
  });

  lr = require('tiny-lr')();
  lr.listen(devServer.livereload);
}

function notifyLivereload(event) {
	var fileName = require('path').relative(devServer.root, event.path);
	lr.changed({ body: { files: [fileName] } });
	gutil.log("Notified live reload for http://" + devServer.server + ":" + devServer.port);
}

gulp.task('watch changes', watchChanges);
function watchChanges() {
  gulp.watch(paths.scripts, ['browserify']);
 // gulp.watch('src/styles/*.less', ['compile less']);
  gulp.watch(paths.markup, ['copy dist']);
  gulp.watch('dist/**').on('change', notifyLivereload);
}

function getRandomPortBasedOnPath(seed) {
	var sillyHash = getHash(__dirname);
	return Math.round(seed + sillyHash);
}
function getHash(str) {
	var result = 0;
	for (var i = 0; i < str.length; ++i) {
		result += str.charCodeAt(i);
	}

	return result;
}