var gulp = require('gulp'),
    runSequence = require('run-sequence'),
    clean = require('gulp-clean'),
    webserver = require('gulp-webserver'),
    spritesmith = require('gulp.spritesmith'),
    svgSprite = require("gulp-svg-sprites"),
    less = require('gulp-less'),
    fileinclude = require('gulp-file-include'),
    iconfont = require('gulp-iconfont'),
    iconfontCss = require('gulp-iconfont-css'),
    watch = require('gulp-watch');

var BUILD_DIRECTORY = './build',
    STATIC_DIRECTORY = './static';

gulp.task('clean', function () {
    return gulp.src([BUILD_DIRECTORY, STATIC_DIRECTORY + '/fonts/involve'], {read: false})
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

gulp.task('iconfont', function(){
    return gulp.src([STATIC_DIRECTORY + '/img/svg/*.svg'])
        .pipe(iconfontCss({
            fontName: 'involve',
            path: './node_modules/gulp-iconfont-css/templates/_icons.css',
            targetPath: '../../less/involve-font.css',
            fontPath: '../fonts/involve/'
        }))
        .pipe(iconfont({
            fontName: 'involve', // required
            prependUnicode: true, // recommended option
            formats: ['ttf', 'eot', 'woff'], // default, 'woff2' and 'svg' are available
            timestamp: Math.round(Date.now() / 1000) // recommended to get consistent builds when watching files
        }))
        .pipe(gulp.dest(STATIC_DIRECTORY + '/fonts/involve'));
});

gulp.task('build-sprites-svg', function () {
    return gulp.src(STATIC_DIRECTORY + '/img/svg/*.svg')
        .pipe(svgSprite({
                asyncTransforms: true,
                transformData: function (data, config, done) {
                    data.svg.forEach(function (element) {
                        element.raw = element.raw.replace(/fill="#[A-Z0-9]+"/g, '');
                    });
                    done(data);
                },
                preview: false,
                mode: 'symbols',
                svg: {
                    symbols: 'img/sprite.svg'
                }
            }
        ))
        .pipe(gulp.dest(STATIC_DIRECTORY));
});

gulp.task('build-css', function () {
    return gulp.src([
        STATIC_DIRECTORY + '/less/style.less',
        STATIC_DIRECTORY + '/less/request.less',
        STATIC_DIRECTORY + '/less/chat.less',
        STATIC_DIRECTORY + '/less/header-main.less',
        STATIC_DIRECTORY + '/less/header-chat.less',
        STATIC_DIRECTORY + '/less/footer-chat.less',
        STATIC_DIRECTORY + '/less/request-overview.less',
        STATIC_DIRECTORY + '/less/animation.less',
        STATIC_DIRECTORY + '/less/common.less'
    ])
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
        STATIC_DIRECTORY + '/fonts/**',
        STATIC_DIRECTORY + '/img/avatars/*',
        STATIC_DIRECTORY + '/js/**/*'
    ], {base: STATIC_DIRECTORY})
        .pipe(gulp.dest(BUILD_DIRECTORY))
});

gulp.task('webserver', function () {
    return gulp.src(BUILD_DIRECTORY).pipe(webserver({
        host: '0.0.0.0',
        livereload: true,
        directoryListing: false
    }));
});

gulp.task('default', function () {

    runSequence(
        'clean',
        ['build-sprite-img', 'build-sprite-css', 'build-sprites-svg'],
        'iconfont',
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

    watch(STATIC_DIRECTORY + '/js/**/*.js', function () {
        console.log('copy js');
        runSequence('copy')
    });
});