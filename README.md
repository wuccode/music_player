## [在线浏览](http://wuchuang222.gz01.bdysite.com/)
使用原生js实现的音乐播放器
## API接口
我使用的是酷狗的jsonp接口,经过我测试发现这三个接口可以用，我就用来写了这个播放器，
> #### 获取搜索关键字：https://searchtip.kugou.com/getSearchTip

>>主要参数：keyword=`搜索关键字`，callback=`回调函数名字`

>>演示：https://searchtip.kugou.com/getSearchTip?keyword=海阔天空&callback=jsonp

> #### 获取歌曲列表：https://songsearch.kugou.com/song_search_v2

>>主要参数：keyword=`搜索的歌曲`，callback=`回调函数名字`，page=`从第几条开始`，pagesize=`到第几条结束`

>>演示：https://songsearch.kugou.com/song_search_v2?callback=getList&keyword=海阔天空&page=0&pagesize=30&userid=-1&clientver=&platform=WebFilter&tag=em&filter=2&iscorrection=1&privilege_filter=0&_=3805717853

> #### 获取歌曲的url、歌词、图片：https://wwwapi.kugou.com/yy/index.php

>>主要参数：hash=`每首歌对应的hash，这个先要通过歌曲列表接口获取`，callback=`回调函数名字`，mid=`这个参数很重要，经过我的测试如果歌曲的url、歌词、图片获取不到，就是这个参数需要修改（不过这个一般不用改）,不行的可以去酷狗官网放首歌看下它的这个接口里mid参数是多少。`，album_id=`这个id我也不知道有什么用，他也可以通过歌曲列表接口获取`

>>演示：https://wwwapi.kugou.com/yy/index.php?r=play/getdata&callback=getUrl&hash=557FECD1FC8298CA0E1EC675AB8857ED&album_id=37376237&mid=014b3c1fadcf06c1e3d529a6183c290a&platid=4&_=5721125717
## 我封装的滚动条
基本使用方法
```
//html代码,main里只能有一个子标签包裹着内容
<div class="main">
       <div>
           //内容
           <p>1<p/>......
       </div>
</div>
//引入滚动条
<script src="./scrollbar.js"></script>
//js代码
let bar = new ScrollBar({
    div : document.querySelector('.main'),
    bgColor : '#000'
})
bar.init()//初始化
```

效果图

![Alt text](http://wuchuang222.gz01.bdysite.com/img/QQ%E6%88%AA%E5%9B%BE20200622203316.png)
