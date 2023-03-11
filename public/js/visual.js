const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let analyser = audioCtx.createAnalyser(), source = null;
analyser.connect(audioCtx.destination);
analyser.fftSize = 1024;
let bufferLength = analyser.frequencyBinCount
let dataArray = new Uint8Array(bufferLength)
let gainNode = audioCtx.createGain();
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let CW = canvas.width, CH = canvas.height;
let BW = ((CW / bufferLength) - 1), BH;
let grd = ctx.createLinearGradient(0,CH,0,0);
    grd.addColorStop(0,'#f2330d');
    grd.addColorStop(1,"#d48250");
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
    if(source) source.stop()
    audioCtxSet(audioBuffer)
    source.start(0,time)
    draw()
}
audioCtx.onstatechange = () => {
    if(audioCtx.state == 'running') draw() 
};
function draw() {
    analyser.getByteFrequencyData(dataArray);
    let x = 0;
    ctx.clearRect(0, 0, CW, CH);
    for (let i = 0; i < bufferLength; i++) {
        ctx.fillStyle=grd;
        BH = dataArray[i]
        ctx.fillRect(CW / 2 + x, CH, 1.5, -BH)
        ctx.fillRect(CW / 2 - x, CH, 1.5, -BH)
        x += BW + 1.2;
    }
    if(audioCtx.state == 'running') requestAnimationFrame(draw)
}

