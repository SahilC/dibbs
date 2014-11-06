var gulp = require('gulp')
  , nodemon = require('gulp-nodemon')
  , jshint = require('gulp-jshint')
  , mocha = require('gulp-mocha');

gulp.task('lint', function () {
  gulp.src('./**/*.js')
    .pipe(jshint())
})

gulp.task('test', function(){
  return gulp.src(['test/*.js'], {read: false})
	.pipe(mocha({reporter: 'spec'}));
});

gulp.task('serve', function () {
  //Load env
  var env = require('./config/env/env');
  for(var key in env) {
    process.env[key] = env[key];
  }

  nodemon({ script: 'server.js', ext: 'html js', ignore: ['ignored.js'] })
    .on('change', ['lint'])
    .on('restart', function () {
      console.log('restarted!')
    })
})
