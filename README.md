## 使用原生js实现的音乐播放器
## [在线浏览](http://wuchuang222.gz01.bdysite.com/)

## API接口
我使用的是酷狗的jsonp接口,经过我测试发现这三个接口可以用，我就用来写了这个播放器，

## 我封装的滚动条


```
//html代码,注意main里只能有一个div
<div class="main">
       <div>
           //内容
       </div>
</div>
//js代码
let bar = new ScrollBar({
    div : document.querySelector('.main'),
    bgColor : '#000'
})
bar.init()//初始化
```

效果图

![Alt text](https://github.com/wuccode/music_player/tree/master/img/QQ截图20200622203316.png)
