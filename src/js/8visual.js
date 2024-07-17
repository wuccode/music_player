const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let analyser = audioCtx.createAnalyser(), source = null;
source = audioCtx.createMediaElementSource($('#music'))
analyser.connect(audioCtx.destination);
analyser.fftSize = 512;
let bufferLength = analyser.frequencyBinCount
let dataArray = new Uint8Array(bufferLength)
let gainNode = audioCtx.createGain();
source.connect(analyser);
source.connect(gainNode);
gainNode.connect(audioCtx.destination);
let canvas = document.getElementById('canvas');
let { width, height } = canvas;
let ctx = canvas.getContext('2d');
let grd = ctx.createLinearGradient(0, height, 0, 0);
grd.addColorStop(0, '#f2330d');
grd.addColorStop(.25, 'rgba(14, 17, 20, 1)');
grd.addColorStop(.5, '#f2330d');
grd.addColorStop(1, "#d48250");
audioCtx.onstatechange = () => {
    if (audioCtx.state == 'running') draw()
};
function draw() {
    ctx.clearRect(0, 0, width, height);
    analyser.getByteFrequencyData(dataArray);
    dataArr = [...dataArray]
    dataArr.shift()
    dataArr.shift()
    dataArr.shift()
    dataArr.shift()
    dataArr.shift()
    dataArr.shift()
    const len = dataArr.length / 2;
    const barWidth = width / len / 2;
    ctx.fillStyle = grd;
    for (let i = 0; i < len; i++) {
        const data = dataArr[i];
        const barHeight = (data / 255) * height;
        const x1 = i * 2 + width / 2;
        const x2 = width / 2 - (i * 2)
        const y = height - barHeight;
        ctx.fillRect(x1, y, barWidth - 2, barHeight);
        i && ctx.fillRect(x2, y, barWidth - 2, barHeight);

    }
    if (audioCtx.state == 'running') requestAnimationFrame(draw)
}

