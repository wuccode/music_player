const express = require('express');
const router = express.Router();
const request = require('request')
const fs = require('fs');
const path = require('path')
const cookie = 'kg_mid=6993d86268f93d01a2253ccc546870b1; kg_dfid=0R8LCD3UNEXa2An74R0LwsUJ; kg_dfid_collect=d41d8cd98f00b204e9800998ecf8427e; Hm_lvt_aedee6983d4cfc62f509129360d6bb3d=1678405877; kg_mid_temp=6993d86268f93d01a2253ccc546870b1; KuGoo=KugooID=1773155682&KugooPwd=05271546DB34A325794C79165A8AD9A6&NickName=%u5433&Pic=http://imge.kugou.com/kugouicon/165/20210908/20210908174920453463.jpg&RegState=1&RegFrom=&t=2c17d7f59bc93c2de793f86aaa0a8bfc35a1369d68d4e0ac23c84200c5bf5e6e&t_ts=1678440116&t_key=&a_id=1014&ct=1678440116&UserName=%u006b%u0067%u006f%u0070%u0065%u006e%u0031%u0037%u0037%u0033%u0031%u0035%u0035%u0036%u0038%u0032; KugooID=1773155682; t=2c17d7f59bc93c2de793f86aaa0a8bfc35a1369d68d4e0ac23c84200c5bf5e6e; a_id=1014; UserName=%u006b%u0067%u006f%u0070%u0065%u006e%u0031%u0037%u0037%u0033%u0031%u0035%u0035%u0036%u0038%u0032; mid=6993d86268f93d01a2253ccc546870b1; dfid=0R8LCD3UNEXa2An74R0LwsUJ; Hm_lpvt_aedee6983d4cfc62f509129360d6bb3d=1678440119'
router.get('/audioUrl',function(req,res){
    let url = `https://wwwapi.kugou.com/yy/index.php?r=play/getdata&callback=getUrl&hash=${req.query.hash}&album_id=${req.query.album_id}&mid=6993d86268f93d01a2253ccc546870b1&platid=4&_=7025754637`
    request.get({url,headers:{'Cookie':cookie}},(err,data)=>{
        let from = data.body.indexOf("(")
        let to = data.body.lastIndexOf(")")
        let r = data.body.slice(from+1,to)
        let body = JSON.parse(r).data
        var audio_src = body.play_url; 
        var audio_filename = body.hash + ".mp3";
        var file_url = path.join(__dirname, '../public/audio/' + audio_filename)
        var data = {
            audio_url: `/audio/${audio_filename}`,
            audio_name: body.audio_name,
            lyrics:body.lyrics,
            img:body.img,
            author_name:body.author_name,
            song_name:body.song_name,
            hash:body.hash,
            total_time:body.timelength,
            album_name:body.album_name
        }
        fs.exists(file_url, function(exists) {
            if(!exists){
                console.log('下载文件');
                request(audio_src).pipe(fs.createWriteStream(file_url).on('close',()=>{
                    res.json(data) 
                }))
            }else{
                console.log('直接返回');
                res.json(data) 
            }
        });
    })
})
module.exports = router;