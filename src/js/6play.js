class Play {
  constructor() {
    this.musicTime = []
    this.musicSite = 0
    this.status = 0;
    this.isError = true
    this.posArr = ["-64px -179px", "0 -179px", "-128px -179px"];
    $('.pause').addEventListener('click', this.play)
    $('.play').addEventListener('click', this.pause)
    $('.next').addEventListener('click', () => audioInfo.getNextMusic())
    $('.prev').addEventListener('click', () => audioInfo.getPrevMusic())
    $("#music").addEventListener('timeupdate', this.audioUpdate.bind(this))
    $("#music").addEventListener('ended', this.audioEnded.bind(this))
    $("#music").addEventListener('error', this.audioError.bind(this))
    $(".icon").addEventListener('click', this.iconClick.bind(this))
  }
  play(is) {
    !is && audioInfo.getCurrentMusic()
    $("#music").play();
    audioCtx.resume();
    $('.pause').style.display = "none";
    $(".play-bar").className = "play-bar play-active";
    $(".content-left").className = "content-left";
    $(".play").style.display = "inline-block";
  }
  pause() {
    $("#music").pause()
    audioCtx.suspend();
    this.style.display = "none";
    $(".pause").style.display = "inline-block";
    $(".play-bar").className = "play-bar";
    $(".content-left").className = "content-left left-active";
  }
  progress(direction, offset) {
    if (direction == 'x') {
      try {
        $('#music').currentTime = this.audioDuration() * (offset / 400)
      } catch (e) {
      }
    } else {
      $("#music").volume = 1 - offset / 100
    }
  }
  iconClick() {
    this.status++;
    if (this.status > this.posArr.length - 1) this.status = 0;
    $(".icon").style.backgroundPosition = this.posArr[this.status];
  }
  audioEnded() {
    if (this.status == 0) {
      audioInfo.getNextMusic()
    } else if (this.status == 1) {
      $("#music").play();
      audioCtx.resume();
    } else if (this.status == 2) {
      $("#ul-list").children[
        parseInt(Math.random() * audioInfo.arrMusicJson.length)
      ].click();
    }
  }
  audioError() {
    if (this.isError) return
    audioInfo.getAudioInfo(audioInfo.arrMusicJson[audioInfo.currentIndex],(data)=>{
      this.play()
    })
  }
  audioDuration(){
    let d = audioInfo.arrMusicJson[audioInfo.currentIndex].freePart ? 60 : $("#music").duration
    return Number(parseInt(d))
  }
  audioUpdate() {
    let cTime = $("#music").currentTime + 0.4
    this.musicSite = this.musicTime.findIndex((time, index) => time < cTime && cTime < this.musicTime[index + 1])
    if (cTime >= this.musicTime[this.musicTime.length - 1]) this.musicSite = this.musicTime.length - 1
    if (this.musicSite != -1) {
      let y = $(".main").clientHeight / 2
      $(".main-content").style.top = -(40 * (this.musicSite) - y + 40) + 'px';
      [...$(".main-content").children].map((h) => h.removeAttribute("class", "action"));
      $(".main-content").children[this.musicSite] && $(".main-content").children[this.musicSite].setAttribute("class", "action");
    }
    $("#content-time").innerText =
      time(parseInt($("#music").currentTime)) + " / " + time(this.audioDuration());
    audioProgress.flag && audioProgress.amend(400 * (($("#music").currentTime) / this.audioDuration()))
  }
  async change(audio) {
    let { url } = await serve.getAudioUrl('localurl',audio)
    audioInfo.setLoading = false
    this.musicTime = []
    $("#music").src = Server.host + url;
    $("#music").oncanplay = () => {
      $("#left-content").innerHTML = audio.album_name; //专辑
      $("#left-content").title = audio.album_name;
      $("#right-content").innerHTML = audio.author_name; //歌手
      $("#right-content").title = audio.author_name;
      $("#content-title").innerHTML = audio.song_name; //歌名
      $(".musicName").innerText = audio.song_name;
      $("#content-title").title = audio.song_name;
      $("#img-bg").style.background = `url(${audio.img}) no-repeat`; //背景图片
      $("#left-img").src = audio.img;
      $("#mu-bg").src = audio.img;
      $(".load").href = Server.host + url;
      $(".load").download = audio.audio_name+'.mp3';
      $(".main-content").innerHTML = ''
      !this.isError && this.play(1)
      this.isError = false
      let lyrics = audio.lyrics;
      let txt = lyrics.split("[");
      for (let i = 0; i < txt.length; i++) {
        let text = txt[i].split("]");
        let time = text[0].split(":");
        let eachTime = Math.round(time[0] * 60 + +time[1]);
        if (!isNaN(eachTime)) {
          $(".main-content").innerHTML += `<p>${text[1]}</p>`;
          this.musicTime.push(eachTime);
        }
      }
      $("#music").oncanplay = null
    }
  }
}

const play = new Play()
