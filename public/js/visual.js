const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let analyser = audioCtx.createAnalyser();
analyser.connect(audioCtx.destination);
let source = null
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let WIDTH = canvas.width;
let HEIGHT = canvas.height
analyser.fftSize = 1024;
let bufferLength = analyser.frequencyBinCount
let dataArray = new Uint8Array(bufferLength)
let barWidth = ((WIDTH / bufferLength) - 1)
let barHeight;
let gainNode = audioCtx.createGain();
async function initVisualBuffer(url){
    let res = await fetch(url)
    let arrayBuffer = await res.arrayBuffer()
    let audioBuffer = await audioCtx.decodeAudioData(arrayBuffer)
    return audioBuffer
}
function audioCtxSet(buffer){
    source = audioCtx.createBufferSource()
    source.buffer = buffer
    source.connect(analyser);
    source.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    gainNode.gain.value= -1 
}
function play(audioBuffer){
    if(!source){
        audioCtxSet(audioBuffer)
        source.start(0)
    }
    if(audioCtx.state != 'running') audioCtx.resume()
    draw() 
 }
function start(time,audioBuffer){
    if(source){
        source.onended = null
        source.stop()
    }
    audioCtxSet(audioBuffer)
    source.start(0,time)
    draw()
    source.onended = function(){
        console.log('结束');
    }
}
audioCtx.onstatechange = () => {
    console.log(audioCtx.state);
    if(audioCtx.state == 'running') draw() 
};
function draw() {
    analyser.getByteFrequencyData(dataArray);
    let x = 0;
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    for (let i = 0; i < bufferLength; i++) {
        var grd=ctx.createLinearGradient(0,HEIGHT,0,0);
        grd.addColorStop(0,'rgb(203, 114, 104)');
        grd.addColorStop(1,"rgb(255,0,0)");
        ctx.fillStyle=grd;
        barHeight = dataArray[i]
        ctx.fillRect(WIDTH / 2 + x, HEIGHT, 1.5, -barHeight)
        ctx.fillRect(WIDTH / 2 - x, HEIGHT, 1.5, -barHeight)
        x += barWidth + 1.2;
    }
    if(audioCtx.state == 'running') requestAnimationFrame(draw)
}

