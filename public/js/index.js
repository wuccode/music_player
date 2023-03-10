let index = 0, site = 0, timer = null, timerOne = null, flag = true, active = true, initLeft, muiscTime = [], muiscSite = 0;
//初始化本地数据  
let arrMusicJson = localStorage.getItem('music') != "[]" && localStorage.getItem('music') ? JSON.parse(localStorage.getItem('music')) : dataJson
let mId = '014b3c1fadcf06c1e3d529a6183c290a';
//播放列表滚动条    
let listBar = new ScrollBar({
	div: $('.bar'),
	width: 8
})
//搜索列表滚动条
let searchBar = new ScrollBar({
	div: $('.search'),
	width: 8,
	bgColor: 'rgba(0,0,0,0.2)'
})
//歌词滚动条
let mainBar = new ScrollBar({
	div: $('.main'),
	width: 5,
})
$('#int').onkeyup = function info() {
	if (event.keyCode === 13) return;
	let url = 'https://searchtip.kugou.com/getSearchTip?keyword=' + this.value + '&callback=jsonp';
	get(url);
}
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
	get(`https://songsearch.kugou.com/song_search_v2?callback=getList&keyword=${text}&page=${page}&pagesize=${pagesize}&userid=-1&clientver=&platform=WebFilter&tag=em&filter=2&iscorrection=1&privilege_filter=0&_=${random(10)}`)
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
		li.onclick = function () {
			let findMusicIndex = arrMusicJson.findIndex(e => e.hash == d.FileHash);
			if (findMusicIndex != -1) {
				getMuisc(arrMusicJson[findMusicIndex]);
				$('.pause').onclick();
				select();
				return;
			}
			//如果没有就创建script标签去请求
			let Url = `https://wwwapi.kugou.com/yy/index.php?r=play/getdata&callback=getUrl&hash=${d.FileHash}&album_id=${d.AlbumID}&mid=${mId}&platid=4&_=${random(10)}`;
			get(Url)
		}
	})
	$('.to').innerText = '为你搜索到' + data.data.lists.length + '首歌曲更多请登录客户端...'
	searchBar.init()
}
initList(arrMusicJson)
function getUrl(get) {
	if (!get.data.play_url) {
		alert('获取失败')
		return;
	};
	let obj = {
		hash: get.data.hash,
		url: get.data.play_url,
		name: get.data.author_name,
		song_name: get.data.song_name,
		audio_name: get.data.audio_name,
		lyrics: get.data.lyrics,
		img: get.data.img,
		album_name: get.data.album_name
	}
	//向数组前面插入一条数据
	arrMusicJson.unshift(obj)
	//切换页面
	getMuisc(obj)
	//更新本地存储
	localStorage.setItem('music', JSON.stringify(arrMusicJson))
	//更新播放列表
	initList(arrMusicJson);
	if (arrMusicJson.length > 0) {
		$('.hint').style.display = 'none';
	}
	//开始播放
	$('.pause').click()
	//当前播放的歌曲在列表高亮
	select();
	//初始化滚动条
	listBar.init();
}
//创建script标签
function get(url) {
	let oScript = document.createElement('script');
	oScript.src = url;
	document.body.appendChild(oScript);
	document.body.removeChild(oScript);
}
//产生随机数
function random(i) {
	let newRandom = ''
	let arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
	for (let j = 0; j < i; j++) {
		newRandom += arr[parseInt(Math.random() * 9)]
	}
	return newRandom;
}
//暂停播放
$('.play').addEventListener('click', function () {
	if (arrMusicJson.length < 1) return;
	$('#music').pause();
	flag = false;
	this.style.display = 'none';
	$('.pause').style.display = 'inline-block';
	$('.play-bar').className = 'play-bar'
	$('.content-left').className = 'content-left left-active'

})
function strUrl() {
	let str = '';
	if (decodeURI($('#music').src).includes('音乐播放器')) {
		str = '.' + decodeURI($('#music').src).split('音乐播放器')[1]
	} else if (decodeURI($('#music').src).includes('http://wuchuang222.gz01.bdysite.com/')) {
		str = './' + decodeURI($('#music').src).split('http://wuchuang222.gz01.bdysite.com/')[1]
	}
	else {
		str = decodeURI($('#music').src);
	}
	return str;
}
function select() {
	let urlIndex = arrMusicJson.findIndex(e => e.url === strUrl());
	if (urlIndex == -1) return;
	for (let i = 0; i < $('#ul-list').children.length; i++) {
		$('#ul-list').children[i].children[1].className = 'nameList';
	}
	$('#ul-list').children[urlIndex].children[1].className = 'active nameList';
}
//开始播放
$('.pause').onclick = function () {
	if (arrMusicJson.length < 1) return;
	//定时器的锁
	flag = true;
	//播放
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
getMuisc(arrMusicJson[site]);
//切换下一首歌
$('.next').onclick = function () {
	if (arrMusicJson.length < 1) return;
	//当前索引 + 1
	site = arrMusicJson.findIndex(e => e.url === strUrl()) + 1;
	//定时器的锁
	flag = true;
	//开启定时器
	moveEach(timerOne, 20)
	if (site > arrMusicJson.length - 1) site = 0;
	//页面切换
	getMuisc(arrMusicJson[site])
	//播放
	$('#music').play();
	//切换按钮
	$('.play-bar').className = 'play-bar play-active'
	$('.content-left').className = 'content-left'
	$('.pause').style.display = 'none';
	$('.play').style.display = 'inline-block';
	//当前播放的歌曲在列表高亮
	select();
}
//切换上一首歌
$('.prev').onclick = function () {
	if (arrMusicJson.length < 1) return;
	//当前索引 - 1
	site = arrMusicJson.findIndex(e => e.url === strUrl()) - 1;
	flag = true;
	//开启定时器
	moveEach(timerOne, 20)
	if (site < 0) site = arrMusicJson.length - 1;
	//页面切换
	getMuisc(arrMusicJson[site])
	//播放
	$('#music').play();
	//切换按钮
	$('.play-bar').className = 'play-bar play-active'
	$('.content-left').className = 'content-left'
	$('.pause').style.display = 'none';
	$('.play').style.display = 'inline-block';
	//当前播放的歌曲在列表高亮
	select();
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
	switch (status) {
		case 0:
			$('.next').click();
			break;
		case 1:
			$('#music').play();
			break;
		case 2:
			$('#ul-list').children[parseInt(Math.random() * arrMusicJson.length - 1)].click()
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
function getMuisc(option) {
	//切换页面内容
	if (arrMusicJson.length < 1) return;
	$('.main-content').innerHTML = '';
	muiscTime = [];
	$('#music').src = option.url;
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
	$('.load').href = option.url;
	$('.load').download = option.audio_name;
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
	document.onmouseup = function () {
		document.onmousemove = null;
		if (!initLeft) return;
		$('#music').currentTime = initLeft * ($('#music').duration / ($('.progress').offsetWidth - 12));
		moveEach(timerOne, 20)
		flag = true;
		document.onmouseup = null;
	}
}
function lyricsMove(index) {
	if (index !== -1) {
		[...$('.main-content').children].map(h => h.removeAttribute("class", "action"))
		$('.main-content').children[index].setAttribute("class", "action");
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
$('.progress').onclick = function (el) {
	let left = el.clientX - $('.bottom-main').offsetLeft - $('.progress').offsetLeft + 200;
	muiscSite = muiscTime.findIndex((time, index) => currentPos(left) >= time && currentPos(left) <= muiscTime[index + 1]);
	lyricsMove(muiscSite)
	$('#content-time').innerText = time(currentPos(left)) + ' / ' + time(parseInt($('#music').duration));
	$('#music').currentTime = left * ($('#music').duration / ($('.progress').offsetWidth - 8));
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
			listBar.init();
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
		li.onclick = function (e) {
			if (arrMusicJson.length > 0) {
				$('.hint').style.display = 'none';
			}
			if (e.target.className !== 'del iconfont') {
				getMuisc(arrMusicJson[pos])
				flag = true;
				$('#music').play();
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
				listBar.updateTop();
			}
		}
	})
}
//结束