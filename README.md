## 功能介绍
搜索音乐，音乐列表，播放音乐，声音控制，音乐上下切换，进度控制，下载mp3格式音乐(设置cookie可播放下载VIP音乐)，歌词滚动高亮显示，音乐节奏可视化显示
## 酷狗API接口
> #### 获取搜索关键字：https://searchtip.kugou.com/getSearchTip

>>主要参数：keyword=`搜索关键字`，callback=`回调函数名字`

>>演示：https://searchtip.kugou.com/getSearchTip?keyword=海阔天空&callback=jsonp

> #### 获取音乐列表：https://songsearch.kugou.com/song_search_v2

>>主要参数：keyword=`搜索的歌曲`，callback=`回调函数名字`，page=`从第几条开始`，pagesize=`到第几条结束`

>>演示：https://songsearch.kugou.com/song_search_v2?callback=getList&keyword=海阔天空&page=0&pagesize=30&userid=-1&clientver=&platform=WebFilter&tag=em&filter=2&iscorrection=1&privilege_filter=0&_=3805717853

> #### 获取音乐的url、歌词、图片：https://wwwapi.kugou.com/yy/index.php

>>主要参数：hash=`每首歌对应的hash，这个先要通过音乐列表接口获取`，callback=`回调函数名字`，album_id=`他也可以通过音乐列表接口获取`

>>演示：https://wwwapi.kugou.com/yy/index.php?r=play/getdata&callback=getUrl&hash=557FECD1FC8298CA0E1EC675AB8857ED&album_id=37376237&mid=014b3c1fadcf06c1e3d529a6183c290a&platid=4&_=5721125717

## 项目启动
#### 一
```npm install```      
#### 二
```npm run serve```
