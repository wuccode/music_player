class AudioInfo {
    constructor() {
        let music = localStorage.getItem("music")
        this.loading = false
        this.arrMusicJson = music != "[]" && music ? JSON.parse(music) : dataJson;
        console.log(this.arrMusicJson);
        
        this.currentHash = ''
        this.currentIndex = 0
        this.nextMusic = {}
        this.prevMusic = {}
        this.initSongList()
        this.setCurrentHash = this.arrMusicJson[0] ? this.arrMusicJson[0].hash : ''
        $("#int").addEventListener('keyup', debounce(this.intKeyUp.bind(this)))
        $("#esc").addEventListener('click', () => $("#esc").parentNode.style.display = "none")
        $("#bs").addEventListener('click', () => this.getSearch($("#int").value))
        $("#int").addEventListener('keydown', (e) => e.keyCode == 13 && this.getSearch($("#int").value))
        $(".mlist").addEventListener("click", this.mlistClick);
    }
    set setLoading(value) {
        let dis = !value ? "none" : "flex"
        $(".loading").style.display = dis;
        this.loading = value
    }
    set setCurrentHash(value) {
        this.setLoading = true
        let index = this.arrMusicJson.findIndex(({ hash }) => hash == value)
        this.currentHash = value
        this.currentIndex = index
        play.change(this.arrMusicJson[this.currentIndex])
        setTimeout(()=>{
            particles.forEach(particle => {
                particle.baseValue = Math.floor(Math.random() * 101);
                particle.value = particle.baseValue;
                particle.x = Math.random() * canvas.width;
                particle.y = Math.random() * canvas.height;
            });
        })
        let list = document.querySelectorAll('.nameList')
        if(list.length){
            list.forEach(li => li.className = 'nameList')
            list[index].className = 'active nameList'
        }
    }
    get getCurrentMusic() {
        if (this.arrMusicJson.length <= 0) {
            alert('请搜索歌曲')
            return () => false
        }
        this.currentHash != this.arrMusicJson[this.currentIndex].hash && (this.setCurrentHash = this.arrMusicJson[this.currentIndex].hash)
        return () => this.arrMusicJson[this.currentIndex]
    }
    get getNextMusic() {
        if (this.arrMusicJson.length <= 0) {
            alert('请搜索歌曲')
            return () => false
        }
        let index = this.currentIndex + 1 > this.arrMusicJson.length - 1 ? 0 : this.currentIndex + 1
        this.nextMusic = this.arrMusicJson[index]
        this.setCurrentHash = this.arrMusicJson[index].hash
        return () => this.nextMusic
    }
    get getPrevMusic() {
        if (this.arrMusicJson.length <= 0) {
            alert('请搜索歌曲')
            return () => false
        }
        let index = this.currentIndex - 1 < 0 ? this.arrMusicJson.length - 1 : this.currentIndex - 1
        this.prevMusic = this.arrMusicJson[index]
        this.setCurrentHash = this.arrMusicJson[index].hash
        return () => this.prevMusic
    }
    async intKeyUp(e) {
        if (e.keyCode === 13) return;
        let self = this
        let url = `https://searchtip.kugou.com/getSearchTip?keyword=${e.target.value}&callback=callback1&_=${Date.now()}`;
        let json = await serve.jsonp(url, 'callback1')
        $('#list').innerHTML = "";
        if (json == "" || json.data.length == 0) {
            $('#list').style.display = "none";
            return;
        }
        $('#list').style.display = "block";
        if (json.data.length > 0) {
            json.data[0].RecordDatas.forEach((key) => {
                $('#list').innerHTML += '<li><span id="co">' + key.HintInfo + "</span><span> 热度:" + key.Hot + "</span></li>";
                for (let i = 0; i < $('#list').children.length; i++) {
                    $('#list').children[i].onclick = function () {
                        self.getSearch(this.children[0].innerText);
                        e.target.value = this.children[0].innerText
                    };
                }
            });
        }
    }
    async getSearch(search) {
        this.setLoading = true
        let data = await serve.getSearchList({
            bitrate: 0,
            callback: "callback2",
            clientver: 1000,
            filter: 10,
            inputtype: 0,
            iscorrection: 1,
            isfuzzy: 0,
            keyword: search,
            page: 1,
            pagesize: 40,
            platform: "WebFilter",
            privilege_filter: 0,
        })
        this.setLoading = false
        if (data.data.lists.length < 1) return;
        $("#listS").innerHTML = "";
        $("#floatHeaderTitle").innerText = `“${search}”`;
        $(".floatList").style.display = "block";
        data.data.lists.forEach((d, index) => {
            let li = document.createElement("li");
            li.innerHTML = `<span class="nums">${index + 1}.</span>
          <span class="mName">${d.FileName}</span>
          <img class="ds" src="./img/d.png" alt="">
          <span class="mAlbum">${d.AlbumName}</span>
          <span class="mTime">${time(d.Duration)}</span>`;
            $("#listS").appendChild(li);
            li.addEventListener('click', () => this.getAudioInfo(data.data.lists[index]))
            li.children[2].addEventListener("click", (e) => {
                e.stopPropagation()
                this.dsClick(data.data.lists[index])
            });
        });
        $("#listS").scrollTop = 0;
        $('#list').innerHTML = "";
        $(".to").innerText = "为你搜索到" + data.data.lists.length + "首歌曲更多请登录客户端...";
    }
    async getAudioInfo({ EMixSongID }, fn) {
        this.setLoading = true
        let data = await serve.getAudio({
            encode_album_audio_id: EMixSongID,
            platid: 4,
        })
        if (!data.url) {
            alert("获取失败");
            this.setLoading = false;
            return;
        }
        this.setLoading = false;
        if (fn) {
            fn(data)
            return
        }
        if (this.arrMusicJson.findIndex((arr) => arr.hash == data.hash) == -1) this.arrMusicJson.unshift(data);
        this.setCurrentHash = data.hash
        localStorage.setItem("music", JSON.stringify(this.arrMusicJson));
        this.initSongList()
    }
    initSongList() {
        $("#ul-list").innerHTML = "";
        $(".num").innerText = this.arrMusicJson.length;
        this.arrMusicJson.length > 0 ? $(".hint").style.display = "none" : $(".hint").style.display = "block"
        let self = this
        this.arrMusicJson.forEach((ele, pos) => {
            let li = document.createElement("li");
            let name = self.arrMusicJson[pos].hash == self.currentHash ? 'active nameList' : 'nameList'
            li.innerHTML = `<span class="id">${pos + 1}</span> <span class="${name}">${ele.audio_name
                }</span> <span class="del iconfont"></span>`;
            $("#ul-list").appendChild(li);
            li.onclick = async function (e) {
                if (self.arrMusicJson.length > 0) {
                    $(".hint").style.display = "none";
                }
                if (e.target.className !== "del iconfont") {
                    self.setCurrentHash = self.arrMusicJson[pos].hash
                }
                if (e.target.className === "del iconfont") {
                    self.arrMusicJson.splice(pos, 1);
                    localStorage.setItem("music", JSON.stringify(self.arrMusicJson));
                    if(self.currentIndex){
                        (self.currentIndex >= pos) && self.currentIndex--
                    }

                    self.initSongList()
                }
            };
        });
    }
    mlistClick(e) {
        if (['mlist', 'icon', 'num'].includes(e.target.className)) {
            if ($(".mlist-content").style.display == "block") {
                $(".mlist-content").style.display = "none";
            } else {
                $(".mlist-content").style.display = "block";
            }
        }
    }
    async dsClick(data) {
        this.setLoading = true
        let result = await serve.getAudio({
            encode_album_audio_id: data.EMixSongID,
            platid: 4,
        })
        let { url } = await serve.getAudioUrl('download', result)
        const oA = document.createElement('a')
        oA.href = url
        oA.download = result.audio_name + ".mp3"
        oA.target = '_blank'
        oA.click()
        this.setLoading = false

    }
}
var audioInfo = new AudioInfo()
