const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let analyser = audioCtx.createAnalyser(), source = null;
source = audioCtx.createMediaElementSource($('#music'))
analyser.connect(audioCtx.destination);
analyser.fftSize = 1024;
let bufferLength = analyser.frequencyBinCount
let dataArray = new Uint8Array(bufferLength)
let gainNode = audioCtx.createGain();
source.connect(analyser);
source.connect(gainNode);
gainNode.connect(audioCtx.destination);
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let CW = canvas.width, CH = canvas.height;
let BW = ((CW / bufferLength) - 1), BH;
let grd = ctx.createLinearGradient(0,CH,0,0);
    grd.addColorStop(0,'#f2330d');
    grd.addColorStop(1,"#d48250");
    ctx.fillStyle=grd;
audioCtx.onstatechange = () => {
    if(audioCtx.state == 'running') draw() 
};
function draw() {
    analyser.getByteFrequencyData(dataArray);
    let x = 0;
    ctx.clearRect(0, 0, CW, CH);
    for (let i = 0; i < bufferLength; i++) {
        BH = dataArray[i]
        ctx.fillRect(CW / 2 + x, CH, 1.5, -BH)
        ctx.fillRect(CW / 2 - x, CH, 1.5, -BH)
        x += BW + 1.2;
    }
    if(audioCtx.state == 'running') requestAnimationFrame(draw)
}

