const express = require('express');
const router = express.Router();
const request = require('request')
const fs = require('fs');
const path = require('path');
let usrMap = new Map()//每个ip对应的音乐地址
//有酷狗会员可以去官网登录一下把cookie(一天有效期)复制过来
let cookie = ''

fs.readFile(path.join(__dirname, './cookie.txt'), 'utf8', function (err, txt) {
  if (!err) {
    cookie = txt
  }
})
router.get('/audioUrl', function (req, res) {
  let options = Object.keys(req.query).reduce((str, key, index) => {
    return (str += `${index ? "&" : ""}${key}=${req.query[key]}`);
  }, "");
  let url = 'https://wwwapi.kugou.com/play/songinfo?' + options
  request.get({ url, headers: { 'Cookie': cookie } }, async (err, data) => {
    if (err) throw err
    let body = JSON.parse(data.body).data
    var data = {
      url: body.play_backup_url,
      audio_name: body.audio_name,
      lyrics: body.lyrics,
      img: body.img,
      author_name: body.author_name,
      song_name: body.song_name,
      hash: body.hash,
      album_name: body.album_name,
      albumID: req.query.album_id,
      freePart: body.is_free_part
    };
    res.json(data)
  })
})
router.get('/fileDownload', async function (req, res) {
  let IP = req.ip.split(':')[3].replace(/\./g, '')
  var file = path.join(__dirname, '../src/audio')
  var audio_filename = req.query.hash + ".mp3";
  var file_url = path.join(__dirname, '../src/audio/' + IP + audio_filename);
  usrMap.get(IP) ? fs.exists(usrMap.get(IP), async (exists) => {
    if (exists) fs.unlink(usrMap.get(IP), () => {
      if (req.query.url.includes('http')) usrMap.set(IP, file_url)
    })
  }) : usrMap.set(IP, file_url)
  fs.mkdir(file, () => {
    if (req.query.url.includes('http')) {
      request(req.query.url).pipe(fs.createWriteStream(file_url).on('close', () => {
        res.json({ url: `/audio/${IP + audio_filename}` })
      }))
    } else {
      usrMap.delete(IP)
      res.json({ url: req.query.url })
    }
  })
})
router.get('/unload', (req, res) => {
  let IP = req.ip.split(':')[3].replace(/\./g, '')
  fs.exists(usrMap.get(IP), async (exists) => {
    if (exists) {
      fs.unlinkSync(usrMap.get(IP))
      usrMap.delete(IP)
    }
  })
  res.send()
})
module.exports = router;