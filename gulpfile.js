var gulp = require('gulp'),
    minifycss = require('gulp-cssmin'), //压缩css插件
    minifyimg = require('gulp-imagemin'), //压缩img插件
    concat = require('gulp-concat'), //压缩合并插件
    uglify = require('gulp-uglify'), //执行压缩
    // rename = require('gulp-rename'), //更新压缩的名字加上min后缀
    del = require('del'); //执行压缩前，先删除压缩文件夹里的内容
    const rev=require("gulp-rev");
    var pump = require('pump');
    const htmlmin = require('gulp-htmlmin')
const autoPrefixer = require('gulp-autoprefixer')

const babel = require('gulp-babel')
//执行压缩前，先删除文件夹里的内容
const revColl=require("gulp-rev-collector");

gulp.task('revCollector', function(cb) {
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
    // 将你的默认的任务代码放在这
    return gulp.src('src/css/*.css') //压缩的文件
    .pipe(autoPrefixer())
        .pipe(minifycss({}))
        .pipe(rev())
        .pipe(gulp.dest('dist/src/css')) //输出文件夹
        .pipe(rev.manifest('css.rev.json'))
        .pipe(gulp.dest('dist/src/rev')) //输出文件夹
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
    return gulp.src('./src/img/*') //img的文件路径
        .pipe(minifyimg({})) //执行压缩
        .pipe(gulp.dest('./dist/src/img')) //输出文件夹
});

gulp.task('mp3Test', function() {
    return gulp.src('./src/mp3/*') //img的文件路径
        .pipe(gulp.dest('./dist/src/mp3')) //输出文件夹
});
gulp.task('routesTest', function() {
    return gulp.src('./routes/index.js') //img的文件路径
        .pipe(gulp.dest('./dist/routes/')) //输出文件夹
});
gulp.task('appTest', function() {
    return gulp.src(['app.js','package.json']) //img的文件路径
        .pipe(gulp.dest('./dist/')) //输出文件夹
});

 
// 默认命令，在cmd中输入gulp后，执行的就是这个命令
gulp.task('default', gulp.series('clean','routesTest','appTest','htmlHandler','cssminTest','imgminTest','jsminTest','revCollector','mp3Test','cleanRev',(done)=>done())
);
