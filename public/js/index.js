let index = 0, site = 0, timer = null, timerOne = null, flag = true, active = true, initLeft, muiscTime = [], muiscSite = 0;
//初始化本地数据  
let arrMusicJson = localStorage.getItem('music') != "[]" && localStorage.getItem('music') ? JSON.parse(localStorage.getItem('music')) : dataJson
let buffer = null,flagList = true; 
//歌词滚动条
let mainBar = new ScrollBar({
	div: $('.main'),
	width: 5,
})
$('#int').onkeyup = debounce(function(e){
        if (e.keyCode === 13) return;
        let url = `https://searchtip.kugou.com/getSearchTip?keyword=${this.value}&callback=jsonp&_=${Date.now()}`;
	    get(url);
})
function jsonp(json) {
	$('#list').innerHTML = '';
	if (json == '' || json.data.length == 0) {
		$('#list').style.display = 'none';
		return;
	}
	$('#list').style.display = 'block';
	if (json.data.length > 0) {
		json.data[0].RecordDatas.forEach(key => {
			$('#list').innerHTML += '<li><span id="co">' + key.HintInfo + '</span><span> 热度:' + key.Hot + '</span></li>';
			for (let i = 0; i < $('#list').children.length; i++) {
				$('#list').children[i].onclick = function () {
					getText(this.children[0].innerText)
				}
			}
		})
	}
}
$('#int').onkeydown = function searchDown() {
	if (event.keyCode == 13) {
		getText($('#int').value)
	}
}
$('#bs').onclick = function () {
	getText($('#int').value)
}
//判断列表有没有歌曲
if (arrMusicJson.length > 0) {
	$('.hint').style.display = 'none';
}
//获取歌曲列表数据
function getText(text) {
	//设置搜索前0到50首歌
	let page = 0; let pagesize = 30;
	//清空搜索列表
	$('#listS').innerHTML = '';
	$('#floatHeaderTitle').innerText = `“${text}”`;
	//创建script标签
	get(`https://songsearch.kugou.com/song_search_v2?callback=getList&keyword=${text}&page=${page}&pagesize=${pagesize}&userid=-1&clientver=&platform=WebFilter&tag=em&filter=2&iscorrection=1&privilege_filter=0&_=${Date.now()}`)
	////显示搜索列表
	$('.floatList').style.display = 'block';
	//清空输入框
	$('#int').value = text;
	jsonp('');
}
//关闭搜索列表
$('#esc').onclick = function () {
	this.parentNode.style.display = 'none'
}
//生成时间格式
function time(t) {
	if (!t) return '00:00';
	let F = parseInt(t / 60) < 10 ? parseInt(t / 60).toString().padStart(2, 0) : parseInt(t / 60);
	let M = t % 60 < 10 ? (t % 60).toString().padStart(2, 0) : t % 60;
	return F + ':' + M
}
//获取歌曲
 function getList(data) {
	if (data.data.lists.length < 1) return;
	data.data.lists.forEach((d, index) => {
		let li = document.createElement('li');
		li.innerHTML = `<span class="nums">${index + 1}.</span><span class="mName">${d.FileName}</span><span class="mAlbum">${d.AlbumName}</span><span class="mTime">${time(d.Duration)}</span>`
		$('#listS').appendChild(li)
        
		li.onclick = async function () {
            if(!flagList) return;
            flagList = false
            let {FileHash,AlbumID} = data.data.lists[index]
            let result = await fetch(`/audioUrl?hash=${FileHash}&album_id=${AlbumID}`,{method:'get'}).then((d)=> d.json()).then((d)=> d)
			getUrl(result)
            
		}
	})
	$('.to').innerText = '为你搜索到' + data.data.lists.length + '首歌曲更多请登录客户端...'
}
initList(arrMusicJson)
async function getUrl(get) {
	if (!get.audio_url) {
		alert('获取失败')
		return;
	};
	let obj = {
		hash: get.hash,
		url: get.audio_url,
		name: get.author_name,
		song_name: get.song_name,
		audio_name: get.audio_name,
		lyrics: get.lyrics,
		img: get.img,
		album_name: get.album_name,
        albumID:get.AlbumID
	}
    if(arrMusicJson.findIndex(arr => arr.hash == get.hash) == -1) arrMusicJson.unshift(obj)
	//向数组前面插入一条数据
	//切换页面
	getMuisc(obj)
	//更新播放列表
	initList(arrMusicJson);
	if (arrMusicJson.length > 0) {
		$('.hint').style.display = 'none';
	}
	//开始播放
	$('.pause').click()
}
//创建script标签
function get(url) {
	let oScript = document.createElement('script');
	oScript.src = url;
	document.body.appendChild(oScript);
	document.body.removeChild(oScript);
}
//暂停播放
$('.play').addEventListener('click', async function () {
	if (arrMusicJson.length < 1) return;
	$('#music').pause();
	flag = false;
    audioCtx.suspend()
	this.style.display = 'none';
	$('.pause').style.display = 'inline-block';
	$('.play-bar').className = 'play-bar'
	$('.content-left').className = 'content-left left-active'

})
function select() {
	let urlIndex = arrMusicJson.findIndex(e => e.hash === localStorage.getItem('music_hash'));
	if (urlIndex == -1) return;
	for (let i = 0; i < $('#ul-list').children.length; i++) {
		$('#ul-list').children[i].children[1].className = 'nameList';
	}
	$('#ul-list').children[urlIndex].children[1].className = 'active nameList';
}
//开始播放
$('.pause').onclick = async function () {
	if (arrMusicJson.length < 1) return;
	//定时器的锁
	flag = true;
	//播放
    if(!buffer){
        buffer = await initVisualBuffer(arrMusicJson[site].url)
    }
    play(buffer)
	$('#music').play();  
	//开启定时器
	moveEach(timerOne, 20)
	//切换按钮
	$('.play-bar').className = 'play-bar play-active'
	$('.content-left').className = 'content-left'
	this.style.display = 'none';
	$('.play').style.display = 'inline-block';
	//当前播放的歌曲在列表高亮
	select()
    
}
//初始化页面
getMuisc(arrMusicJson[site],true);
//切换下一首歌
$('.next').onclick = async function () {
	if (arrMusicJson.length < 1 || !flagList) return;
    flagList = false
	//当前索引 + 1
	site = arrMusicJson.findIndex(e => e.hash === localStorage.getItem('music_hash')) + 1;
	//定时器的锁
	flag = true;
	//开启定时器
	moveEach(timerOne, 20)
	if (site > arrMusicJson.length - 1) site = 0;
	//页面切换
	getMuisc(arrMusicJson[site])
	//切换按钮
	$('.play-bar').className = 'play-bar play-active'
	$('.content-left').className = 'content-left'
	$('.pause').style.display = 'none';
	$('.play').style.display = 'inline-block';
	//当前播放的歌曲在列表高亮
	select();
}
//切换上一首歌
$('.prev').onclick = async function () {
	if (arrMusicJson.length < 1 || !flagList) return;
    flagList = false
	//当前索引 - 1
	site = arrMusicJson.findIndex(e => e.hash === localStorage.getItem('music_hash')) - 1;
	flag = true;
	//开启定时器
	moveEach(timerOne, 20)
	if (site < 0) site = arrMusicJson.length - 1;
	//页面切换
	getMuisc(arrMusicJson[site])
	//切换按钮
	$('.play-bar').className = 'play-bar play-active'
	$('.content-left').className = 'content-left'
	$('.pause').style.display = 'none';
	$('.play').style.display = 'inline-block';
	//当前播放的歌曲在列表高亮
	
}
//当歌曲播放完
let status = 0;
let posArr = ['-64px -179px', '0 -179px', '-128px -179px']
$('.icon').onclick = function () {
	status++;
	if (status > posArr.length - 1) status = 0;
	this.style.backgroundPosition = posArr[status];
}
$('#music').onended = function () {
    console.log(status);
	switch (status) {
		case 0:
			$('.next').click();
			break;
		case 1:
			$('#music').play();
            start(0,buffer)
			break;
		case 2:
			$('#ul-list').children[parseInt(Math.random() * arrMusicJson.length)].click()
			break;
	}
}
control();
function control() {
	$('.main').onmouseover = function () {
		active = false;
		this.children[0].style.transition = 'none';
	}
	$('.main').onmouseout = function () {
		active = true;
		this.children[0].style.transition = 'top .4s ease-out';
	}
}
async function getMuisc(option,isPlay) {
	//切换页面内容
	if (arrMusicJson.length < 1) return;
	$('.main-content').innerHTML = '';
	muiscTime = [];
    let res = await fetch(`/fileDownload?hash=${option.hash}&url=${option.url}`,{method:'get'}).then((d)=> d.json()).then((d)=> d)
    $('#music').src = res.url;
	$('#left-content').innerHTML = option.album_name;//专辑
	$('#left-content').title = option.album_name;
	$('#right-content').innerHTML = option.name;//歌手
	$('#right-content').title = option.name;
	$('#content-title').innerHTML = option.song_name//歌名
	$('.musicName').innerText = option.song_name;
	$('#content-title').title = option.song_name;
	$('#img-bg').style.background = `url(${option.img}) no-repeat`;//背景图片
	$('#left-img').src = option.img;
	$('#mu-bg').src = option.img;
	$('.load').href = res.url;
	$('.load').download = option.audio_name;
    buffer = await initVisualBuffer(res.url)
    start(0,buffer)
    !isPlay && $('#music').play();
	localStorage.setItem('music_hash', option.hash)
    localStorage.setItem('music', JSON.stringify(arrMusicJson))
    select();
    //获取歌词
	let lyrics = option.lyrics;
	//切割成数组
	let txt = lyrics.split('[');
	for (let i = 0; i < txt.length; i++) {
		//循环数组再切割
		let text = txt[i].split(']');
		let time = text[0].split(':');
		//获取每句歌词对应的时间
		let eachTime = Math.round(time[0] * 60 + (+time[1]));
		if (!isNaN(eachTime)) {
			//把歌词添加到显示歌曲的容器里
			$('.main-content').innerHTML += `<p>${text[1]}</p>`
			//把歌词时间放进数组里
			muiscTime.push(eachTime);
		}

	}
	//初始化滚动条
	mainBar.init()
	$('.main').children[1].style.transition = 'top .3s ease-out';
	$('#music').ontimeupdate = function () {
		//获取播放的当前时间
		if (!flag) return;
		let currtTime = Math.round($('#music').currentTime);
		if (muiscTime.includes(currtTime)) {
			muiscSite = muiscTime.findIndex(time => time === currtTime)
		}
		lyricsMove(muiscSite)
	}
    flagList = true
}
//拖动进度条
$('.progress-x').onmousedown = function (el) {
	if (arrMusicJson.length < 1) return;
	flag = false;
	let posLeft = el.clientX - ($('.bottom-main').offsetLeft + $('.progress').offsetLeft) - $('.progress-x').offsetLeft + 200;
	document.onmousemove = function (ele) {
		let e = ele || window.event;
		initLeft = e.clientX - $('.bottom-main').offsetLeft - $('.progress').offsetLeft + 200 - posLeft;
		muiscSite = muiscTime.findIndex((time, index) => currentPos(initLeft) >= time && currentPos(initLeft) <= muiscTime[index + 1]);
		lyricsMove(muiscSite)
		$('.progress-w').style.width = initLeft + 'px';
		$('.progress-x').style.left = initLeft + 'px';
		if (initLeft < 0) {
			$('.progress-w').style.width = 0;
			$('.progress-x').style.left = 0;
		}
		if (initLeft > $('.progress').offsetWidth - $('.progress-x').offsetWidth) {
			$('.progress-w').style.width = $('.progress').offsetWidth - $('.progress-x').offsetWidth + 'px';
			$('.progress-x').style.left = $('.progress').offsetWidth - $('.progress-x').offsetWidth + 'px';
		}
		$('#content-time').innerText = time(currentPos(initLeft)) + ' / ' + time(parseInt($('#music').duration));

		return false;
	}
	document.onmouseup = async function () {
		document.onmousemove = null;
		if (!initLeft) return;
		$('#music').currentTime = initLeft * ($('#music').duration / ($('.progress').offsetWidth - 12));
        // let buffer = await initVisualBuffer(arrMusicJson[site].url)
        if(!buffer) {
            buffer = await initVisualBuffer(arrMusicJson[site].url)
        }
        start($('#music').currentTime,buffer)
        $('.pause').click()
		moveEach(timerOne, 20)
		flag = true;
		document.onmouseup = null;
	}
}
function lyricsMove(index) {
	if (index !== -1) {
		[...$('.main-content').children].map(h => h.removeAttribute("class", "action"))
		$('.main-content').children[index] && $('.main-content').children[index].setAttribute("class", "action");
		//移动歌词
		if (!active) return;
		mainBar.conMoveTarget = -(40 * (index - 4));
		let top = parseInt($('.main-content').offsetTop * (($('.main').children[1].offsetHeight - $('.main').offsetHeight) / ($('.main').offsetHeight - $('.main-content').offsetHeight)))
		//移动滚动条
		if (-top < 0) top = 0;
		if (-top > ($('.main').offsetHeight - $('.main').children[1].offsetHeight)) top = -($('.main').offsetHeight - $('.main').children[1].offsetHeight);
		mainBar.scrMoveTarget = -top;
		mainBar.updateTop()
	}

}
//播放时间
function currentPos(pos) {
	let time = parseInt(pos * ($('#music').duration / ($('.progress').offsetWidth - 8)));
	if (time < 0) time = 0;
	else if (time > $('#music').duration) {
		time = parseInt($('#music').duration);
	}
	return time;
}
//进度条点击播放到对应的时间
$('.progress').onclick = async function (el) {
	let left = el.clientX - $('.bottom-main').offsetLeft - $('.progress').offsetLeft + 200;
	muiscSite = muiscTime.findIndex((time, index) => currentPos(left) >= time && currentPos(left) <= muiscTime[index + 1]);
	lyricsMove(muiscSite)
	$('#content-time').innerText = time(currentPos(left)) + ' / ' + time(parseInt($('#music').duration));
	$('#music').currentTime = left * ($('#music').duration / ($('.progress').offsetWidth - 8));
    if(!buffer) {
        buffer = await initVisualBuffer(arrMusicJson[site].url)
    }
    start($('#music').currentTime,buffer)
    $('.pause').click()
	$('.progress-w').style.width = ($('.progress').offsetWidth - 11) / $('#music').duration * $('#music').currentTime + 'px';
	$('.progress-x').style.left = ($('.progress').offsetWidth - 11) / $('#music').duration * $('#music').currentTime + 'px';
}
//进度条实时更新进度
function moveEach(ele, t) {
	clearInterval(ele)
	ele = setInterval(function () {
		$('.progress-w').style.width = ($('.progress').offsetWidth - 11) / $('#music').duration * $('#music').currentTime + 'px';
		$('.progress-x').style.left = ($('.progress').offsetWidth - 11) / $('#music').duration * $('#music').currentTime + 'px';
		$('#content-time').innerText = time(parseInt($('#music').currentTime)) + ' / ' + time(parseInt($('#music').duration));
		if (!flag) {
			clearInterval(ele);
		}
	}, 500)
}
//控制音量
$('#music').volume = 0.33;
$('.sY').onclick = function (el) {
	let e = el || window.event;
	let left = -(e.clientY - $('.fixed-bottom').offsetTop + 4);
	if (left > 96) left = 96
	if (left < 0) left = 0;
	$('.sY-H').style.height = left + 'px';
	$('.sY-Y').style.bottom = left + 'px';
	let vLe = parseInt(getStyleAttr($('.sY-Y'), 'bottom'));
	if (vLe > 100) vLe = 100
	$('#music').volume = vLe / 100;
}
$('.sY-Y').onmousedown = function () {
	document.onmousemove = function (el) {
		let e = el || window.event;
		let sizeTop = -(e.pageY - $('.fixed-bottom').offsetTop) - 4;
		$('.sY-Y').style.bottom = sizeTop + 'px';
		if (sizeTop > 96) $('.sY-Y').style.bottom = 96 + 'px'
		if (sizeTop < 0) $('.sY-Y').style.bottom = 0 + 'px'
		let vLe = parseInt(getStyleAttr($('.sY-Y'), 'bottom'));
		$('.sY-H').style.height = vLe + 'px';
		if (vLe > 100) vLe = 100;
		$('#music').volume = vLe / 100;
		return false;
	}
	document.onmouseup = function () {
		document.onmousemove = null;
	}
}

//打开播放列表和关闭播放列表
$('.mlist').addEventListener('click', function (e) {
	if (e.target.className == 'mlist' || e.target.className == 'icon' || e.target.className == 'num') {
		if ($('.mlist-content').style.display == 'block') {
			$('.mlist-content').style.display = 'none';
		} else {
			$('.mlist-content').style.display = 'block';
			// listBar.init();
		}
	}
})
//把歌曲显示到列表中
function initList(arr) {
	$('#ul-list').innerHTML = ''
	$('.num').innerText = arrMusicJson.length;
	arr.forEach(function (ele, pos) {
		let li = document.createElement('li');
		li.innerHTML = `<span class="id">${pos + 1}</span> <span class="nameList">${ele.audio_name}</span> <span class="del iconfont"></span>`;
		$('#ul-list').appendChild(li);
		li.onclick = async function (e) {
			if (arrMusicJson.length > 0) {
				$('.hint').style.display = 'none';
			}
			if (e.target.className !== 'del iconfont') {
                if(!flagList) return;
                flagList = false
				getMuisc(arrMusicJson[pos])
				flag = true;
				moveEach(timerOne, 20)
				$('.play').style.display = 'inline-block';
				$('.pause').style.display = 'none';
				for (let i = 0; i < $('#ul-list').children.length; i++) {
					$('#ul-list').children[i].children[1].className = 'nameList';
				}
				this.children[1].className = 'active nameList';
			}
			if (e.target.className === 'del iconfont') {
				arrMusicJson.splice(pos, 1)
				localStorage.setItem('music', JSON.stringify(arrMusicJson));
				initList(arrMusicJson)
				select();
			}
		}
	})
}
//结束