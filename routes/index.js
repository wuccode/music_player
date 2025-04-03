const express = require("express");
const router = express.Router();
const axios = require("axios");
const fs = require("fs");
const path = require("path");
let usrMap = new Map(); //每个ip对应的音乐地址
//酷狗会员可以去官网登录一下把cookie(一天有效期)复制过来
let Cookie = "";

fs.readFile(path.join(__dirname, "./cookie.txt"), "utf8", function (err, txt) {
    if (!err) {
        Cookie = txt;
    }
});
router.get("/songinfo", async function (req, res) {
    let options = Object.keys(req.query).reduce((str, key, index) => {
        return (str += `${index ? "&" : ""}${key}=${req.query[key]}`);
    }, "");
    let url = "https://wwwapi.kugou.com/play/songinfo?" + options;
    let result = await axios({
        url,
        method:"GET",
        headers:{ Cookie }
    });
    let body = result.data.data;
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
        freePart: body.is_free_part,
        EMixSongID: body.encode_album_audio_id,
    };
    res.json(data);
});
router.get("/localurl", async function (req, res) {
    let IP = req.ip.split(":")[3].replace(/\./g, "");
    var file = path.join(__dirname, "../src/audio");
    var audio_filename = req.query.hash + ".mp3";
    var file_url = file + "/" + IP + audio_filename;
    if (usrMap.get(IP) && fs.existsSync(usrMap.get(IP))) {
        fs.unlink(usrMap.get(IP), () => {
            if (req.query.url.includes("http")) usrMap.set(IP, file_url);
        });
    } else {
        usrMap.set(IP, file_url)
    }
    fs.mkdir(file, async () => {
        if (req.query.url.includes("http")) {
            let writer = fs.createWriteStream(file_url)
            let response = await axios({
                url:req.query.url,
                method:"GET",
                responseType:'stream'
            })
            response.data.pipe(writer)
            writer.on('finish',()=>{
                res.json({ url: `/audio/${IP + audio_filename}` });
            })
        } else {
            usrMap.delete(IP);
            res.json({ url: req.query.url });
        }
    });
});
router.get("/download", async function (req, res) {
    var file = path.join(__dirname, "../src/download");
    var audio_filename = req.query.hash + ".mp3";
    let IP = req.ip.split(":")[3].replace(/\./g, "");
    var file_url = file + "/" + IP + audio_filename;
    deleteFolder(file,IP);
    fs.mkdir(file, async () => {
        let writer = fs.createWriteStream(file_url)
        let response = await axios({
            url:req.query.url,
            method:"GET",
            responseType:'stream'
        })
        response.data.pipe(writer)
        writer.on('finish',()=>{
            res.json({ url: `/download/${IP+audio_filename}` });
        })
    });
});
router.get("/unload", (req, res) => {
    let IP = req.ip.split(":")[3].replace(/\./g, "");
    if (fs.existsSync(usrMap.get(IP))) {
        fs.unlinkSync(usrMap.get(IP));
        usrMap.delete(IP);
    }
    res.send();
});
function deleteFolder(path,IP) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach((file) => {
            const curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolder(curPath);
            } else {
                curPath.includes(IP) && fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}
module.exports = router;
