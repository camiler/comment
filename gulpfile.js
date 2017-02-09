var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var sass = require('gulp-ruby-sass');
var browserSync = require('browser-sync');
var zip = require('gulp-zip');
var del = require('del');

gulp.task('sass', function(){
    return sass('src/sass/*.scss') 
    .on('error', function (err) {
      console.error('Error!', err.message);
    })
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.stream());
})

gulp.task('cssmin', ['sass'], function(){
    gulp.src('src/css/*.css')
        .pipe(minifyCss())
        .pipe(gulp.dest('dist/*.min.css'))
})

gulp.task('jsmin', function(){
    gulp.src('src/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/*.min.js'))
})

gulp.task('server', ['sass'], function(){
    browserSync({
        notify: false,
        port: 4000,
        server: {
            baseDir: './'
        },
        startPath: '/demo/index.html'
    });

    gulp.watch("src/sass/*.scss", ['sass']);

    gulp.watch([
        'src/**/*',
        'demo/*.html'
    ]).on('change', browserSync.reload);
})

gulp.task('clean', function(){
    return del(['*.zip']);
})

gulp.task('build', ['cssmin', 'jsmin', 'clean'], function(){
    return gulp.src('./dist/**/*')
            .pipe(zip('comment-'+ new Date().getTime() +'.zip'))
            .pipe(gulp.dest('./'));
})
