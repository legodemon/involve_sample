var gulp = require('gulp'),
    runSequence = require('run-sequence'),
    clean = require('gulp-clean'),
    webserver = require('gulp-webserver'),
    spritesmith = require('gulp.spritesmith'),
    less = require('gulp-less'),
    fileinclude = require('gulp-file-include'),
    watch = require('gulp-watch');

var BUILD_DIRECTORY = './build',
    STATIC_DIRECTORY = './static';

gulp.task('clean', function () {
    return gulp.src(BUILD_DIRECTORY, {read: false})
        .pipe(clean());
});

var spriteData = gulp.src([
    STATIC_DIRECTORY + '/img/logos/*.png',
    STATIC_DIRECTORY + '/img/monsters/*.png',
    STATIC_DIRECTORY + '/img/social/*.png',
    STATIC_DIRECTORY + '/img/speakers/*.jpg'
]).pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.less'
}));

gulp.task('build-sprite-img', function () {
    return spriteData.img.pipe(gulp.dest('./static/css/'));
});

gulp.task('build-sprite-css', function () {
    return spriteData.css.pipe(gulp.dest(STATIC_DIRECTORY + '/less/'));
});

gulp.task('build-css', function () {
    return gulp.src(STATIC_DIRECTORY + '/less/style.less')
        .pipe(less({
            paths: ['./less']
        }))
        .pipe(gulp.dest(BUILD_DIRECTORY + '/css'));
});

gulp.task('build-index.html', function () {
    return gulp.src([STATIC_DIRECTORY + '/html/index.html'])
        .pipe(fileinclude({
            prefix: '~~',
            suffix: '~~'
        }))
        .pipe(gulp.dest(BUILD_DIRECTORY));
});

gulp.task('copy', function () {
    return gulp.src([
        STATIC_DIRECTORY + '/css/**/*',
        //STATIC_DIRECTORY + '/font-awesome/**/*',
        STATIC_DIRECTORY + '/fonts/**/*',
        STATIC_DIRECTORY + '/img/**/*',
        STATIC_DIRECTORY + '/js/**/*'
    ], {base: STATIC_DIRECTORY})
        .pipe(gulp.dest(BUILD_DIRECTORY))
});

gulp.task('webserver', function () {
    return gulp.src(BUILD_DIRECTORY).pipe(webserver({
        livereload: true,
        directoryListing: false
    }));
});

gulp.task('default', function () {

    runSequence(
        'clean',
        ['build-sprite-img', 'build-sprite-css'],
        ['copy', 'build-css', 'build-index.html'],
        'webserver'
    );

    watch([
        STATIC_DIRECTORY + '/img/**/*.jpg',
        STATIC_DIRECTORY + '/img/**/*.png',
        '!' + STATIC_DIRECTORY + '/img/backgrounds'
    ], function () {
        console.log('rebuild sprite');
        runSequence(['build-sprite-img', 'build-sprite-css'], ['copy', 'build-css'])
    });

    watch(STATIC_DIRECTORY + '/less/**/*.less', function () {
        console.log('rebuild css');
        runSequence('build-css')
    });

    watch(STATIC_DIRECTORY + '/html/**/*.html', function () {
        console.log('rebuild index.html');
        runSequence('build-index.html')
    });

});