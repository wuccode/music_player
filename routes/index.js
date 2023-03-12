const express = require('express');
const router = express.Router();
const request = require('request')
const fs = require('fs');
const path = require('path');
//有酷狗会员可以去官网登录一下把cookie(一天有效期)复制过来
const cookie = 'kg_mid=6993d86268f93d01a2253ccc546870b1; kg_dfid=0R8LCD3UNEXa2An74R0LwsUJ; kg_dfid_collect=d41d8cd98f00b204e9800998ecf8427e; Hm_lvt_aedee6983d4cfc62f509129360d6bb3d=1678405877,1678609465; KuGoo=KugooID=1773155682&KugooPwd=05271546DB34A325794C79165A8AD9A6&NickName=%u5433&Pic=http://imge.kugou.com/kugouicon/165/20210908/20210908174920453463.jpg&RegState=1&RegFrom=&t=2c17d7f59bc93c2de793f86aaa0a8bfcd31ae8498ec9f43930b41b748ff49e96&t_ts=1678609493&t_key=&a_id=1014&ct=1678609493&UserName=%u006b%u0067%u006f%u0070%u0065%u006e%u0031%u0037%u0037%u0033%u0031%u0035%u0035%u0036%u0038%u0032; KugooID=1773155682; t=2c17d7f59bc93c2de793f86aaa0a8bfcd31ae8498ec9f43930b41b748ff49e96; a_id=1014; UserName=%u006b%u0067%u006f%u0070%u0065%u006e%u0031%u0037%u0037%u0033%u0031%u0035%u0035%u0036%u0038%u0032; mid=6993d86268f93d01a2253ccc546870b1; dfid=0R8LCD3UNEXa2An74R0LwsUJ; Hm_lpvt_aedee6983d4cfc62f509129360d6bb3d=1678614605'
const mid = '6993d86268f93d01a2253ccc546870b1'
router.get('/audioUrl',function(req,res){
    let url = `https://wwwapi.kugou.com/yy/index.php?r=play/getdata&callback=getUrl&hash=${req.query.hash}&album_id=${req.query.album_id}&mid=${mid}&platid=4&_=${Date.now()}`
    request.get({url,headers:{'Cookie':cookie}},async (err,data)=>{
        let from = data.body.indexOf("(")
        let to = data.body.lastIndexOf(")")
        let r = data.body.slice(from+1,to)
        let body = JSON.parse(r).data
        var data = {
            audio_url: body.play_url,
            audio_name: body.audio_name,
            lyrics:body.lyrics,
            img:body.img,
            author_name:body.author_name,
            song_name:body.song_name,
            hash:body.hash,
            album_name:body.album_name,
            AlbumID:req.query.album_id
        };
        res.json(data)
    })
})
router.get('/fileDownload',async function(req,res){
    var file = path.join(__dirname, '../public/audio')
    fs.exists(file,async (exists)=>{
        if(exists) await removeDir(file);
        fs.mkdir(file, ()=>{
            var audio_filename = req.query.hash + ".mp3";
            if(req.query.url.includes('http')){
                var file_url = path.join(__dirname, '../public/audio/' + audio_filename)
                request(req.query.url).pipe(fs.createWriteStream(file_url).on('close',()=>{
                    res.json({url:`/audio/${audio_filename}`}) 
                }))
            }else{
                res.json({url:req.query.url})
            }
        })
    })
})
function removeDir(dir) {
    return new Promise(function (resolve, reject) {
      fs.stat(dir,function (err, stat) {
        if(stat.isDirectory()){
          fs.readdir(dir,function (err, files) {
            files = files.map(file=>path.join(dir,file));
            files = files.map(file=>removeDir(file)); 
            Promise.all(files).then(function () {
              fs.rmdir(dir,resolve);
            })
          })
        }else {
          fs.unlink(dir,resolve)
        }
      })
    })
}
module.exports = router;