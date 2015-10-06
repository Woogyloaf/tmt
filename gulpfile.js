// ////////////////////////////////////////////////
//
// EDIT CONFIG OBJECT BELOW !!!
// 
// jsConcatFiles => list of javascript files (in order) to concatenate
// buildFilesFoldersRemove => list of files to remove when running final build
// // /////////////////////////////////////////////

var config = {
	jsConcatFiles: [
		'./app/js/module1.js', 
		'./app/js/main.js'
	], 
	buildFilesFoldersRemove:[
		'build/stylus/', 
		'build/js/!(*.min.js)',
		'build/bower.json',
		'build/bower_components/',
		'build/maps/',
		'build/images/'
	]
};


// ////////////////////////////////////////////////
// Required taskes
// gulp build
// bulp build:serve
// // /////////////////////////////////////////////

var gulp = require('gulp'),
	stylus = require('gulp-stylus'),
	sourcemaps = require('gulp-sourcemaps'),
	autoprefixer = require('gulp-autoprefixer'),
	browserSync = require('browser-sync'),
	reload = browserSync.reload,
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	plumber = require('gulp-plumber'),
	rename = require('gulp-rename'),
	del = require('del'),

	imagemin = require('gulp-imagemin'),
	spritesmith  = require('gulp.spritesmith');


// ////////////////////////////////////////////////
// Log Errors
// // /////////////////////////////////////////////

function errorlog(err){
	console.log(err.message);
	this.emit('end');
}


// ////////////////////////////////////////////////
// Image  Min Tasks
// ///////////////////////////////////////////////

gulp.task('imagemin', function () {
    gulp.src('./app/images/sprite.png')
        .pipe(imagemin())
        .pipe(gulp.dest('./app'))
});

// ////////////////////////////////////////////////
// Scripts Tasks
// ///////////////////////////////////////////////

gulp.task('scripts', function() {
  return gulp.src(config.jsConcatFiles)
	.pipe(sourcemaps.init())
		.pipe(concat('temp.js'))
		.pipe(uglify())
		.on('error', errorlog)
		.pipe(rename('app.min.js'))		
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('./app/js/'))

    .pipe(reload({stream:true}));
});


// ////////////////////////////////////////////////
// Sprite Tasks
// ///////////////////////////////////////////////

gulp.task('sprite', function() {
    var spriteData = 
        gulp.src('./app/images/sprite/*.*') // путь, откуда берем картинки для спрайта
            .pipe(spritesmith({
                imgName: 'sprite.png',
                cssName: 'sprite.css',
            }));

    spriteData.img.pipe(gulp.dest('./app/images/')); // путь, куда сохраняем картинку
    spriteData.css.pipe(gulp.dest('./app/images/')); // путь, куда сохраняем стили
});


// ////////////////////////////////////////////////
// Styles Tasks
// ///////////////////////////////////////////////

gulp.task('styles', function() {
	gulp.src('app/stylus/style.styl')
		.pipe(plumber())
		.pipe(sourcemaps.init())
	    .pipe(stylus({compress: false }))

			.on('error', errorlog)
			.pipe(autoprefixer({
	            browsers: ['last 3 versions'],
	            cascade: false
	        }))	
		.pipe(sourcemaps.write('../maps'))
		.pipe(gulp.dest('app/css'))
		.pipe(reload({stream:true}));
});


// ////////////////////////////////////////////////
// HTML Tasks
// // /////////////////////////////////////////////

gulp.task('html', function(){
    gulp.src('app/**/*.html')
    .pipe(reload({stream:true}));
});


// ////////////////////////////////////////////////
// Browser-Sync Tasks
// // /////////////////////////////////////////////

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./app/"
        }
    });
});

// task to run build server for testing final app
gulp.task('build:serve', function() {
    browserSync({
        server: {
            baseDir: "./build/"
        }
    });
});


// ////////////////////////////////////////////////
// Build Tasks
// // /////////////////////////////////////////////

// clean out all files and folders from build folder
gulp.task('build:cleanfolder', function (cb) {
	del([
		'build/**'
	], cb);
});

// task to create build directory of all files
gulp.task('build:copy', ['build:cleanfolder'], function(){
    return gulp.src('app/**/*/')
    .pipe(gulp.dest('build/'));
});

// task to removed unwanted build files
// list all files and directories here that you don't want included
gulp.task('build:remove', ['build:copy'], function (cb) {
	del(config.buildFilesFoldersRemove, cb);
});

gulp.task('build', ['build:copy', 'build:remove']);


// ////////////////////////////////////////////////
// Watch Tasks
// // /////////////////////////////////////////////

gulp.task ('watch', function(){
	gulp.watch('app/stylus/**/*.styl', ['styles']);
	gulp.watch('app/js/**/*.js', ['scripts']);
  	gulp.watch('app/**/*.html', ['html']);
  	gulp.watch('app/images/sprite/*.*', ['sprite']);
  	gulp.watch('app/images/sprite.png', ['imagemin']);
});


gulp.task('default', ['sprite','imagemin','scripts', 'styles', 'html', 'browser-sync', 'watch']);
