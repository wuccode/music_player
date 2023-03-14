const gulp = require('gulp'),
    minifycss = require('gulp-cssmin'),
    minifyimg = require('gulp-imagemin'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify')
    rev = require("gulp-rev"),
    pump = require('pump'),
    htmlmin = require('gulp-htmlmin'),
    autoPrefixer = require('gulp-autoprefixer'),
    babel = require('gulp-babel'),
    revColl=require("gulp-rev-collector"),
    del = require('del')

gulp.task('revCollector', function() {
    return gulp.src(["./dist/src/rev/js.rev.json","./dist/src/rev/css.rev.json","./dist/src/app.html"])
    .pipe(revColl())
    .pipe(gulp.dest("./dist/src"))
});
gulp.task('clean', function(cb) {
    return del(['dist/src'], cb)
});
gulp.task('cleanRev', function(cb) {
    return del(['dist/src/rev'], cb)
});
// 压缩css
gulp.task('cssminTest', function() {
    return gulp.src('src/css/*.css') 
    .pipe(autoPrefixer())
        .pipe(minifycss({}))
        .pipe(rev())
        .pipe(gulp.dest('dist/src/css'))
        .pipe(rev.manifest('css.rev.json'))
        .pipe(gulp.dest('dist/src/rev')) 
});
/*压缩js文件*/
gulp.task('jsminTest', function() {
    return gulp
    .src('./src/js/*.js')
    .pipe(babel({
      presets:['@babel/env']
    })) // es6转es5
    .pipe(uglify({
    })) // 压缩
    .pipe(concat('main.js'))
    .pipe(rev())
    .pipe(gulp.dest('./dist/src/js/'))
    .pipe(rev.manifest('js.rev.json'))
    .pipe(gulp.dest('dist/src/rev'))
});
gulp.task('htmlHandler', function () {
    return gulp
      .src('./src/app.html')
      .pipe(htmlmin({ // 通过配置的参数进行压缩
        collapseWhitespace:true, //移出空格
        removeEmptyAttributes:true, //表示移出空的属性（仅限于原生属性）
        collapseBooleanAttributes:true, // 移出布尔值属性
        removeAttributeQuotes:true, // 移出属性上的双引号
        minifyCSS:true, //压缩内嵌式css代码（只能基本压缩，不能添加前缀）
        minifyJS:true, // 压缩内嵌式js代码（只能基本压缩，不能进行转码）
        removeStyleLinkTypeAttributes:true,//移出style和link标签上的type属性
        removeScriptTypeAttributes:true, // 移出script标签上默认的type属性
        removeComments:true
      }))
      .pipe(gulp.dest('./dist/src'))
  });
// 压缩img
gulp.task('imgminTest', function() {
    return gulp.src('./src/img/*')
        .pipe(minifyimg({})) 
        .pipe(gulp.dest('./dist/src/img'))
});

gulp.task('mp3Test', function() {
    return gulp.src('./src/mp3/*') //img的文件路径
        .pipe(gulp.dest('./dist/src/mp3')) //输出文件夹
});
gulp.task('routesTest', function() {
    return gulp.src('./routes/index.js')
        .pipe(gulp.dest('./dist/routes/'))
});
gulp.task('appTest', function() {
    return gulp.src(['app.js','package.json'])
        .pipe(gulp.dest('./dist/'))
});

gulp.task('default', gulp.series('clean','routesTest','appTest','htmlHandler','cssminTest','imgminTest','jsminTest','revCollector','mp3Test','cleanRev',(done)=>done())
);
